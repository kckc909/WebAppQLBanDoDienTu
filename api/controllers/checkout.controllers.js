// controllers/checkoutController.js
const CheckoutModel = require('../models/checkout.models')

const CheckoutController = {
    // Lấy thông tin chuẩn bị checkout
    getCheckoutData: async (req, res) => {
        try {
            console.log("log")
            const { user_id } = req.user | 3; // Từ middleware auth
            const { items } = req.body; // Array of {variant_id, quantity}

            if (!items || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Không có sản phẩm nào được chọn'
                });
            }

            // Lấy thông tin sản phẩm
            const checkoutItems = await CheckoutModel.getCheckoutItems(items);

            // Lấy địa chỉ của user
            const addresses = await CheckoutModel.getUserAddresses(user_id);

            // Lấy voucher của user
            const vouchers = await CheckoutModel.getUserVouchers(user_id);

            // Tính tổng tiền
            const subtotal = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);
            const shipping_fee = 30000; // Phí ship cố định hoặc tính theo logic

            res.json({
                success: true,
                data: {
                    items: checkoutItems,
                    addresses,
                    vouchers,
                    summary: {
                        subtotal,
                        shipping_fee,
                        total: subtotal + shipping_fee
                    }
                }
            });
        } catch (error) {
            console.error('Get checkout data error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tải thông tin thanh toán'
            });
        }
    },

    // Kiểm tra tồn kho trước khi đặt hàng
    checkStock: async (req, res) => {
        try {
            const { items } = req.body;

            const stockCheck = await CheckoutModel.checkStockAvailability(items);

            if (!stockCheck.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: 'Một số sản phẩm không đủ số lượng',
                    unavailable: stockCheck.unavailable
                });
            }

            res.json({
                success: true,
                message: 'Tất cả sản phẩm đều có sẵn'
            });
        } catch (error) {
            console.error('Check stock error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi kiểm tra tồn kho'
            });
        }
    },

    // Tạo đơn hàng
    createOrder: async (req, res) => {
        try {
            const { user_id } = req.user;
            const { address_id, payment_method, note, items, voucher_ownership_id } = req.body;

            // Validate
            if (!address_id || !payment_method || !items || items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc'
                });
            }

            // Kiểm tra tồn kho
            const stockCheck = await CheckoutModel.checkStockAvailability(items);
            if (!stockCheck.isAvailable) {
                return res.status(400).json({
                    success: false,
                    message: 'Một số sản phẩm không đủ số lượng',
                    unavailable: stockCheck.unavailable
                });
            }

            // Lấy thông tin chi tiết sản phẩm
            const checkoutItems = await CheckoutModel.getCheckoutItems(items);

            // Tính tổng tiền
            const subtotal = checkoutItems.reduce((sum, item) => sum + item.subtotal, 0);
            const shipping_fee = 30000;
            let discount = 0;

            // Áp dụng voucher nếu có
            if (voucher_ownership_id) {
                const vouchers = await CheckoutModel.getUserVouchers(user_id);
                const selectedVoucher = vouchers.find(v => v.ownership_id === voucher_ownership_id);

                if (selectedVoucher && subtotal >= selectedVoucher.min_order_amount) {
                    if (selectedVoucher.discount_type === 'percent') {
                        discount = Math.min(
                            (subtotal * selectedVoucher.discount_value) / 100,
                            selectedVoucher.max_discount_amount || Infinity
                        );
                    } else {
                        discount = selectedVoucher.discount_value;
                    }
                }
            }

            const total = subtotal + shipping_fee - discount;

            // Tạo đơn hàng
            const orderData = {
                user_id,
                address_id,
                total,
                shipping_fee,
                payment_method,
                note,
                items: checkoutItems
            };

            const result = await CheckoutModel.createOrder(orderData);

            // Áp dụng voucher nếu có
            if (voucher_ownership_id && discount > 0) {
                await CheckoutModel.applyVoucher(result.order_id, voucher_ownership_id);
            }

            res.status(201).json({
                success: true,
                message: 'Đặt hàng thành công',
                data: {
                    order_id: result.order_id,
                    total,
                    discount
                }
            });
        } catch (error) {
            console.error('Create order error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tạo đơn hàng'
            });
        }
    },

    // Thêm địa chỉ mới
    addAddress: async (req, res) => {
        try {
            const { user_id } = req.user;
            const { receiver_name, phone, province, ward, address_text, is_default } = req.body;

            if (!receiver_name || !phone || !province || !address_text) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin địa chỉ'
                });
            }

            const addressData = {
                user_id,
                receiver_name,
                phone,
                province,
                ward,
                address_text,
                is_default: is_default || 0
            };

            const result = await CheckoutModel.addAddress(addressData);

            res.status(201).json({
                success: true,
                message: 'Thêm địa chỉ thành công',
                data: { address_id: result.address_id }
            });
        } catch (error) {
            console.error('Add address error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm địa chỉ'
            });
        }
    },

    // Admin: Hoàn thành đơn hàng và giảm tồn kho
    completeOrder: async (req, res) => {
        try {
            const { order_id } = req.params;

            // Kiểm tra role admin (từ middleware)
            if (req.user.role !== 'admin' && req.user.role !== 'staff') {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền thực hiện'
                });
            }

            const result = await CheckoutModel.completeOrder(order_id);

            res.json({
                success: true,
                message: 'Đơn hàng đã được hoàn thành'
            });
        } catch (error) {
            console.error('Complete order error:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi hoàn thành đơn hàng'
            });
        }
    },

    // test
    test: async (req, res) => {
        console.log("Log")
        res.json({
            success: true,
            message: 'Đơn hàng đã được hoàn thành'
        });
    }
};

module.exports = CheckoutController;