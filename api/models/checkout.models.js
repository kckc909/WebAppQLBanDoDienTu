// models/checkoutModel.js
const db = require('../common/db');

const CheckoutModel = {
    // Kiểm tra tồn kho cho danh sách sản phẩm
    checkStockAvailability: async (items) => {
        const variantIds = items.map(item => item.variant_id);
        const query = `
        SELECT variant_id, stock, name, price 
        FROM product_variants 
        WHERE variant_id IN (?)
    `;
        const [variants] = await db.query(query, [variantIds]);

        const stockMap = {};
        variants.forEach(v => {
            stockMap[v.variant_id] = v;
        });

        const unavailable = [];
        items.forEach(item => {
            const variant = stockMap[item.variant_id];
            if (!variant || variant.stock < item.quantity) {
                unavailable.push({
                    variant_id: item.variant_id,
                    requested: item.quantity,
                    available: variant ? variant.stock : 0
                });
            }
        });

        return { isAvailable: unavailable.length === 0, unavailable, variants: stockMap };
    },

    // Lấy thông tin chi tiết sản phẩm cho checkout
    getCheckoutItems: async (items) => {
        const variantIds = items.map(item => item.variant_id);
        const query = `
        SELECT 
            pv.variant_id,
            pv.product_id,
            pv.name as variant_name,
            pv.sku,
            pv.price,
            pv.stock,
            pv.thumbnail_url,
            p.name as product_name,
            p.thumbnail_url as product_thumbnail
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.product_id
        WHERE pv.variant_id IN (?) AND p.is_active = 1
    `;
        const [results] = await db.query(query, [variantIds]);

        return items.map(item => {
            const variant = results.find(v => v.variant_id === item.variant_id);
            if (!variant) return null;

            return {
                ...variant,
                quantity: item.quantity,
                subtotal: variant.price * item.quantity
            };
        }).filter(Boolean);
    },

    // Tạo đơn hàng mới
    createOrder: async (orderData) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const { user_id, address_id, total, shipping_fee, payment_method, note, items } = orderData;

            // Insert order
            const orderQuery = `
        INSERT INTO orders (user_id, address_id, total, shipping_fee, status, payment_status, payment_method, note, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'pending', 'unpaid', ?, ?, NOW(), NOW())
      `;
            const [orderResult] = await connection.query(orderQuery, [
                user_id, address_id, total, shipping_fee, payment_method, note || null
            ]);

            const order_id = orderResult.insertId;

            // Insert order items
            const orderItemsQuery = `
        INSERT INTO order_items (order_id, product_id, variant_id, product_name_snapshot, sku_snapshot, qty, price, created_at)
        VALUES ?
      `;
            const orderItemsValues = items.map(item => [
                order_id,
                item.product_id,
                item.variant_id,
                item.product_name,
                item.sku,
                item.quantity,
                item.price,
                new Date()
            ]);

            await connection.query(orderItemsQuery, [orderItemsValues]);

            await connection.commit();
            return { order_id, success: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Cập nhật trạng thái đơn hàng sang completed và giảm tồn kho
    completeOrder: async (order_id) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Lấy thông tin order items
            const [orderItems] = await connection.query(
                'SELECT variant_id, qty FROM order_items WHERE order_id = ?',
                [order_id]
            );

            // Cập nhật stock cho từng variant
            for (const item of orderItems) {
                await connection.query(
                    'UPDATE product_variants SET stock = stock - ? WHERE variant_id = ? AND stock >= ?',
                    [item.qty, item.variant_id, item.qty]
                );
            }

            // Cập nhật trạng thái đơn hàng
            await connection.query(
                'UPDATE orders SET status = ?, payment_status = ?, updated_at = NOW() WHERE order_id = ?',
                ['delivered', 'paid', order_id]
            );

            await connection.commit();
            return { success: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Lấy danh sách địa chỉ của user
    getUserAddresses: async (user_id) => {
        const query = `
      SELECT 
        address_id,
        receiver_name,
        phone,
        province,
        ward,
        address_text,
        is_default
      FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC
    `;
        const [addresses] = await db.query(query, [user_id]);
        return addresses;
    },

    // Thêm địa chỉ mới
    addAddress: async (addressData) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Nếu địa chỉ mới là default, bỏ default của các địa chỉ cũ
            if (addressData.is_default) {
                await connection.query(
                    'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
                    [addressData.user_id]
                );
            }

            const query = `
        INSERT INTO addresses (user_id, receiver_name, phone, province, ward, address_text, is_default, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
            const [result] = await connection.query(query, [
                addressData.user_id,
                addressData.receiver_name,
                addressData.phone,
                addressData.province,
                addressData.ward,
                addressData.address_text,
                addressData.is_default || 0
            ]);

            await connection.commit();
            return { address_id: result.insertId, success: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Lấy voucher của user
    getUserVouchers: async (user_id) => {
        const query = `
      SELECT 
        vo.ownership_id,
        v.voucher_id,
        v.code,
        v.description,
        v.discount_type,
        v.discount_value,
        v.max_discount_amount,
        v.min_order_amount,
        v.start_date,
        v.end_date,
        vo.is_used
      FROM voucher_ownerships vo
      JOIN vouchers v ON vo.voucher_id = v.voucher_id
      WHERE vo.user_id = ? 
        AND v.is_active = 1
        AND v.start_date <= NOW()
        AND v.end_date >= NOW()
      ORDER BY vo.acquired_at DESC
    `;
        const [vouchers] = await db.query(query, [user_id]);
        return vouchers;
    },

    // Áp dụng voucher
    applyVoucher: async (order_id, ownership_id) => {
        const query = `
      INSERT INTO voucher_usages (ownership_id, order_id, applied_at)
      VALUES (?, ?, NOW())
    `;
        await db.query(query, [ownership_id, order_id]);

        // Đánh dấu voucher đã được sử dụng
        await db.query(
            'UPDATE voucher_ownerships SET is_used = 1 WHERE ownership_id = ?',
            [ownership_id]
        );

        return { success: true };
    }
};

module.exports = CheckoutModel;