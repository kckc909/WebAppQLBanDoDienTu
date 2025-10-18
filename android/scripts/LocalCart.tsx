// xử lý với cart tại AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { CART_KEY, DEFAULT_PRODUCT_IMAGE } from '@/constants/default';
import { CartItemType } from '@/constants/custom.d';

/**
 * Thêm sản phẩm vào giỏ hàng trong AsyncStorage
 * @param {Object} item - Thông tin sản phẩm cần thêm
 * @param {number} item.product_id - ID sản phẩm
 * @param {number} item.variant_id - ID biến thể 
 * @param {number} item.quantity - Số lượng thêm (mặc định 1)
 * @param {number} item.price_snapshot - Giá tại thời điểm thêm
 * 
 * @param {string} [item.name] - tên sản phẩm
 * @param {string} [item.thumbnail_url] - ảnh đại diện sản phẩm
 * @returns {Promise<Object>} - Trả về giỏ hàng cập nhật
 */
export async function addToCart({
    product_id,
    variant_id,
    quantity = 1,
    price_snapshot,
    name,
    thumbnail_url
}: any) {
    if (!product_id || !price_snapshot || quantity <= 0) {
        throw new Error('Thông tin sản phẩm không hợp lệ');
    }

    try {
        // Lấy giỏ hàng hiện tại từ AsyncStorage
        const cartJson = await AsyncStorage.getItem(CART_KEY);
        let cart = cartJson ? JSON.parse(cartJson) : [];

        // Tìm sản phẩm đã tồn tại trong giỏ (cùng product_id và variant_id)
        const existingIndex = cart.findIndex(
            (item: any) =>
                item.product_id === product_id &&
                ((item.variant_id === variant_id) ||
                    (item.variant_id == null && variant_id == null))
        );

        if (existingIndex !== -1) {
            // Nếu đã tồn tại, tăng số lượng
            cart[existingIndex].quantity += quantity;

            // Cập nhật lại giá nếu giá nhỏ hơn giá hiện tại
            if (cart[existingIndex].price_snapshot > price_snapshot)
                cart[existingIndex].price_snapshot = price_snapshot;
        } else {
            // Nếu chưa tồn tại, thêm mới
            cart.push({
                product_id,
                variant_id,
                quantity,
                price_snapshot,
                name,
                thumbnail_url
            });
        }

        // Lưu lại giỏ hàng vào AsyncStorage
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));

        return cart; // Trả về giỏ hàng mới
    } catch (error) {
        console.error('Lỗi khi thêm vào giỏ hàng:', error);
        throw new Error('Không thể thêm sản phẩm vào giỏ hàng');
    }
}

export async function getCart() {
    try {
        const data = await AsyncStorage.getItem(CART_KEY)

        if (!data) return [];

        const parsed = JSON.parse(data);

        const LocalCart: CartItemType[] = parsed.map((item: any) => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            name: item.name,
            thumbnail_url: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE,
            quantity: item.quantity,
            price: item.price_snapshot,
            selected: item.selected
        }));

        return LocalCart;
    } catch (error) {
        console.error("❌ Lỗi khi đọc AsyncStorage cart:", error);
        return [];
    }
}

/**
 * Giảm số lượng sản phẩm trong giỏ hàng
 * @param {number} product_id - ID sản phẩm
 * @param {number} variant_id - ID biến thể sản phẩm
 * @param {number} new_quantity - Số lượng mới
 *  
 *  @return {Promise<Object>} - Trả về giỏ hàng cập nhật
 */
export async function updateQuantity(product_id: number, variant_id: number, new_quantity: number) {
    try {
        const cartJson = await AsyncStorage.getItem(CART_KEY);
        let cart = cartJson ? JSON.parse(cartJson) : [];
        const index = cart.findIndex(
            (item: any) =>
                item.product_id == product_id &&
                ((item.variant_id == variant_id) ||
                    (item.variant_id == null && variant_id == null))
        );
        if (index !== -1) {
            cart[index].quantity = new_quantity;
            await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        }
        return cart;
    } catch (error) {
        console.error('Lỗi khi cập nhật số lượng giỏ hàng:', error);
        throw new Error('Không thể cập nhật số lượng sản phẩm trong giỏ hàng');
    }
}

export async function removeItemFromCart(product_id: number, variant_id: number) {
    try {
        const cartJson = await AsyncStorage.getItem(CART_KEY);
        let cart = cartJson ? JSON.parse(cartJson) : [];
        cart = cart.filter(
            (item: any) =>
                !(item.product_id == product_id &&
                    ((item.variant_id == variant_id) ||
                        (item.variant_id == null && variant_id == null)))
        );
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
        return cart;
    } catch (error) {
        console.error('Lỗi khi xoá sản phẩm khỏi giỏ hàng:', error);
        throw new Error('Không thể xoá sản phẩm khỏi giỏ hàng');
    }
}   