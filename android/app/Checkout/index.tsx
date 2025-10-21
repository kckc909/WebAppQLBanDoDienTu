// app/checkout/index.tsx - COMPLETE VERSION
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddressSelector } from '@/components/Checkout/AddressSection';
import { CheckoutItem } from '@/components/Checkout/CheckoutItem';
import { OrderSummary } from '@/components/Checkout/OrderSummary';
import { PaymentMethod } from '@/components/Checkout/PaymentMethodSection';
import { VoucherSelector } from '@/components/Checkout/VoucherSelector';
import { api_checkout_checkStock, api_checkout_createOrder, api_checkout_getData } from '@/api/api_checkout';

// ==================== FAKE DATA ====================
const FAKE_CHECKOUT_DATA = {
    items: [
        {
            variant_id: 1,
            product_id: 101,
            product_name: "iPhone 15 Pro Max",
            variant_name: "256GB - Titan Tự Nhiên",
            sku: "IP15PM-256-TN",
            price: 29990000,
            quantity: 1,
            subtotal: 29990000,
            stock: 50,
            thumbnail_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png",
            product_thumbnail: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png"
        },
        {
            variant_id: 2,
            product_id: 102,
            product_name: "AirPods Pro Gen 2",
            variant_name: "USB-C",
            sku: "APP2-USBC",
            price: 6490000,
            quantity: 2,
            subtotal: 12980000,
            stock: 100,
            thumbnail_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c.png",
            product_thumbnail: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/i/airpods-pro-2-usb-c.png"
        },
        {
            variant_id: 3,
            product_id: 103,
            product_name: "MacBook Air M2",
            variant_name: "13 inch - 8GB - 256GB",
            sku: "MBA-M2-8-256",
            price: 28990000,
            quantity: 1,
            subtotal: 28990000,
            stock: 5, // Low stock for testing
            thumbnail_url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-2022.png",
            product_thumbnail: "https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook-air-m2-2022.png"
        }
    ],
    addresses: [
        {
            address_id: 1,
            receiver_name: "Nguyễn Văn An",
            phone: "0901234567",
            province: "Hà Nội",
            ward: "Phường Láng Hạ",
            address_text: "Số 123, Đường Láng",
            is_default: 1
        },
        {
            address_id: 2,
            receiver_name: "Trần Thị Bình",
            phone: "0912345678",
            province: "TP. Hồ Chí Minh",
            ward: "Phường Bến Nghé",
            address_text: "Số 456, Lê Lợi, Quận 1",
            is_default: 0
        },
        {
            address_id: 3,
            receiver_name: "Lê Minh Cường",
            phone: "0923456789",
            province: "Đà Nẵng",
            ward: "Phường Hải Châu I",
            address_text: "Số 789, Trần Phú",
            is_default: 0
        }
    ],
    vouchers: [
        {
            ownership_id: 1,
            voucher_id: 101,
            code: "SALE50K",
            description: "Giảm 50.000đ cho đơn hàng từ 500.000đ",
            discount_type: "amount",
            discount_value: 50000,
            max_discount_amount: null,
            min_order_amount: 500000,
            start_date: "2024-01-01 00:00:00",
            end_date: "2025-12-31 23:59:59",
            is_used: 0
        },
        {
            ownership_id: 2,
            voucher_id: 102,
            code: "FREESHIP",
            description: "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ",
            discount_type: "amount",
            discount_value: 30000,
            max_discount_amount: null,
            min_order_amount: 1000000,
            start_date: "2024-01-01 00:00:00",
            end_date: "2025-12-31 23:59:59",
            is_used: 0
        },
        {
            ownership_id: 3,
            voucher_id: 103,
            code: "TECH20",
            description: "Giảm 20% tối đa 500.000đ cho sản phẩm công nghệ",
            discount_type: "percent",
            discount_value: 20,
            max_discount_amount: 500000,
            min_order_amount: 2000000,
            start_date: "2024-01-01 00:00:00",
            end_date: "2025-12-31 23:59:59",
            is_used: 0
        },
        {
            ownership_id: 4,
            voucher_id: 104,
            code: "MEGA100K",
            description: "Giảm 100.000đ cho đơn hàng từ 5.000.000đ",
            discount_type: "amount",
            discount_value: 100000,
            max_discount_amount: null,
            min_order_amount: 5000000,
            start_date: "2024-01-01 00:00:00",
            end_date: "2025-12-31 23:59:59",
            is_used: 1
        },
        {
            ownership_id: 5,
            voucher_id: 105,
            code: "VIP30",
            description: "Giảm 30% tối đa 1.000.000đ cho khách hàng VIP",
            discount_type: "percent",
            discount_value: 30,
            max_discount_amount: 1000000,
            min_order_amount: 10000000,
            start_date: "2024-01-01 00:00:00",
            end_date: "2025-12-31 23:59:59",
            is_used: 0
        }
    ],
    summary: {
        subtotal: 71960000,
        shipping_fee: 30000,
        total: 71990000
    }
};

// xác nhận đăng nhập -> import sản phẩm vào orders  -> tạo orders mới (set trạng thái) -> 
export default function CheckoutScreen() {
    const params = useLocalSearchParams<any>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [checkoutData, setCheckoutData] = useState<any>(null);
    const [selectedAddress, setSelectedAddress] = useState<any>(null);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [note, setNote] = useState('');
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        // For testing with fake data
        setTimeout(() => {
            setCheckoutData(FAKE_CHECKOUT_DATA);
            const defaultAddr = FAKE_CHECKOUT_DATA.addresses.find(a => a.is_default === 1);
            if (defaultAddr) {
                setSelectedAddress(defaultAddr);
            }
            setLoading(false);
        }, 1000);

        // For real API - uncomment below
        // fetchCheckoutData();
    }, []);

    const fetchCheckoutData = async () => {
        try {
            setLoading(true);
            const items = JSON.parse(params.items || '[]');
            const response = await api_checkout_getData(items);

            if (response.success) {
                setCheckoutData(response.data);
                const defaultAddr = response.data.addresses.find((a: any) => a.is_default === 1);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                } else if (response.data.addresses.length > 0) {
                    setSelectedAddress(response.data.addresses[0]);
                }
            }
        } catch (error: any) {
            console.error('Fetch checkout data error:', error);
            Alert.alert('Lỗi', error.message || 'Không thể tải thông tin thanh toán');
        } finally {
            setLoading(false);
        }
    };

    // ========== QUANTITY CHANGE HANDLER ==========
    const handleQuantityChange = (variantId: number, newQuantity: number) => {
        setCheckoutData((prev: any) => {
            // 1. Update item quantity and subtotal
            const updatedItems = prev.items.map((item: any) => {
                if (item.variant_id === variantId) {
                    return {
                        ...item,
                        quantity: newQuantity,
                        subtotal: item.price * newQuantity
                    };
                }
                return item;
            });

            // 2. Recalculate summary
            const newSubtotal = updatedItems.reduce(
                (sum: number, item: any) => sum + item.subtotal,
                0
            );

            const newTotal = newSubtotal + prev.summary.shipping_fee;

            // 3. Return updated state
            return {
                ...prev,
                items: updatedItems,
                summary: {
                    ...prev.summary,
                    subtotal: newSubtotal,
                    total: newTotal
                }
            };
        });

        // Log for debugging
        // console.log(`Updated quantity for variant ${variantId} to ${newQuantity}`);
    };

    // ========== REMOVE ITEM HANDLER ==========
    const handleRemoveItem = (variantId: number) => {
        setCheckoutData((prev: any) => {
            // Filter out removed item
            const updatedItems = prev.items.filter(
                (item: any) => item.variant_id !== variantId
            );

            // Check if cart is empty
            if (updatedItems.length === 0) {
                Alert.alert(
                    'Giỏ hàng trống',
                    'Không có sản phẩm nào trong giỏ hàng',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back()
                        }
                    ]
                );
                return prev; // Don't update if going back
            }

            // Recalculate totals
            const newSubtotal = updatedItems.reduce(
                (sum: number, item: any) => sum + item.subtotal,
                0
            );

            const newTotal = newSubtotal + prev.summary.shipping_fee;

            return {
                ...prev,
                items: updatedItems,
                summary: {
                    ...prev.summary,
                    subtotal: newSubtotal,
                    total: newTotal
                }
            };
        });

        console.log(`Removed item with variant_id: ${variantId}`);
    };

    // ========== DISCOUNT CALCULATION ==========
    const calculateDiscount = () => {
        if (!selectedVoucher || !checkoutData) return 0;

        const voucher = checkoutData.vouchers.find(
            (v: any) => v.ownership_id === selectedVoucher
        );
        if (!voucher) return 0;

        const subtotal = checkoutData.summary.subtotal;

        // Check minimum order amount
        if (subtotal < voucher.min_order_amount) {
            return 0;
        }

        let discountAmount = 0;

        if (voucher.discount_type === 'percent') {
            discountAmount = (subtotal * voucher.discount_value) / 100;
            if (voucher.max_discount_amount) {
                discountAmount = Math.min(discountAmount, voucher.max_discount_amount);
            }
        } else {
            discountAmount = voucher.discount_value;
        }

        return discountAmount;
    };

    useEffect(() => {
        setDiscount(calculateDiscount());
    }, [selectedVoucher, checkoutData]);

    // ========== PLACE ORDER ==========
    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert('Thông báo', 'Vui lòng chọn địa chỉ giao hàng');
            return;
        }

        const finalTotal = checkoutData.summary.total - discount;

        Alert.alert(
            'Xác nhận đặt hàng',
            `Số lượng: ${checkoutData.items.length} sản phẩm\nTổng thanh toán: ${finalTotal.toLocaleString('vi-VN')}₫`,
            [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Đặt hàng', onPress: submitOrder }
            ]
        );
    };

    const submitOrder = async () => {
        setSubmitting(true);

        // Simulate order for fake data
        setTimeout(() => {
            const orderId = Math.floor(Math.random() * 1000000);
            setSubmitting(false);

            Alert.alert(
                'Đặt hàng thành công! 🎉',
                `Mã đơn hàng: #${orderId}\n\nĐơn hàng của bạn đang được xử lý`,
                [
                    {
                        text: 'Về trang chủ',
                        onPress: () => router.push('/')
                    }
                ]
            );
        }, 2000);

        // For real API - uncomment below
        /*
        try {
            const itemsToCheck = checkoutData.items.map((item: any) => ({
                variant_id: item.variant_id,
                quantity: item.quantity
            }));

            const stockCheck = await api_checkout_checkStock(itemsToCheck);

            if (!stockCheck.success) {
                Alert.alert('Thông báo', 'Một số sản phẩm không đủ số lượng');
                return;
            }

            const orderData = {
                address_id: selectedAddress.address_id,
                payment_method: paymentMethod,
                note: note,
                items: itemsToCheck,
                voucher_ownership_id: selectedVoucher || null
            };

            const response = await api_checkout_createOrder(orderData);

            if (response.success) {
                Alert.alert(
                    'Đặt hàng thành công',
                    `Mã đơn hàng: #${response.data.order_id}`,
                    [
                        {
                            text: 'Xem đơn hàng',
                            onPress: () => router.replace(`/orders/${response.data.order_id}`)
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Place order error:', error);
            Alert.alert('Lỗi', error.message || 'Không thể đặt hàng');
        } finally {
            setSubmitting(false);
        }
        */
    };

    // ========== LOADING STATE ==========
    if (loading) {
        return (
            <View className="items-center justify-center flex-1 bg-gray-50">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Đang tải thông tin...</Text>
            </View>
        );
    }

    // ========== ERROR STATE ==========
    if (!checkoutData) {
        return (
            <View className="items-center justify-center flex-1 p-4 bg-gray-50">
                <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-lg font-semibold text-gray-800">Có lỗi xảy ra</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="px-6 py-3 mt-4 bg-blue-600 rounded-lg"
                >
                    <Text className="font-medium text-white">Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const selectedVoucherData = checkoutData.vouchers.find(
        (v: any) => v.ownership_id === selectedVoucher
    );

    // ========== MAIN UI ==========
    return (
        <View className="flex-1 bg-gray-50">

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Danh sách sản phẩm */}
                <View className="mb-2 bg-white">
                    <View className="px-4 py-3 border-b border-gray-200">
                        <Text className="text-lg font-semibold text-gray-800">
                            Sản phẩm ({checkoutData.items.length})
                        </Text>
                    </View>
                    {checkoutData.items.map((item: any) => (
                        <CheckoutItem
                            key={item.variant_id}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveItem}
                            editable={true}
                        />
                    ))}
                </View>

                {/* Địa chỉ giao hàng */}
                <AddressSelector
                    addresses={checkoutData.addresses}
                    selectedAddress={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                    onAddNew={() => Alert.alert('Thông báo', 'Chức năng đang phát triển')}
                />

                {/* Phương thức thanh toán */}
                <PaymentMethod selected={paymentMethod} onSelect={setPaymentMethod} />

                {/* Voucher */}
                <VoucherSelector
                    vouchers={checkoutData.vouchers}
                    selected={selectedVoucher}
                    onSelect={setSelectedVoucher}
                />

                {/* Thông tin thanh toán */}
                <OrderSummary
                    subtotal={checkoutData.summary.subtotal}
                    shippingFee={checkoutData.summary.shipping_fee}
                    discount={discount}
                    voucherCode={selectedVoucherData?.code}
                    itemCount={checkoutData.items.length}
                    showDetails={true}
                />

                <View className="h-24" />
            </ScrollView>

            {/* Bottom Bar */}
            <View className="px-4 py-3 bg-white border-t border-gray-200">
                <View className="flex-row items-center justify-between mb-3">
                    <View>
                        <Text className="text-sm text-gray-600">Tổng thanh toán:</Text>
                        {discount > 0 && (
                            <Text className="text-xs text-gray-400 line-through">
                                {checkoutData.summary.total.toLocaleString('vi-VN')}₫
                            </Text>
                        )}
                    </View>
                    <Text className="text-2xl font-bold text-red-600">
                        {(checkoutData.summary.total - discount).toLocaleString('vi-VN')}₫
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handlePlaceOrder}
                    disabled={submitting || !selectedAddress}
                    className={`rounded-lg py-4 items-center ${submitting || !selectedAddress ? 'bg-gray-300' : 'bg-red-600'
                        }`}
                >
                    {submitting ? (
                        <View className="flex-row items-center">
                            <ActivityIndicator size="small" color="white" />
                            <Text className="ml-2 text-base font-semibold text-white">
                                Đang xử lý...
                            </Text>
                        </View>
                    ) : (
                        <Text className="text-base font-semibold text-white">
                            Đặt hàng
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}