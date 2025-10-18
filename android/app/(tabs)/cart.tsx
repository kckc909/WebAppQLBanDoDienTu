import { CartItemType } from "@/constants/custom.d";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import CartList from "../Cart/CartList";
import { getCart, updateQuantity } from "@/scripts/LocalCart";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen() {
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItemType[]>([]);

    const fetchCartItems = async () => {
        try {
            const localCart = await getCart();
            console.log("Giỏ hàng từ AsyncStorage:", localCart);
            if (localCart && localCart.length > 0) {
                setCartItems(localCart);
            }
        } catch (e) {
            console.error("Lỗi lấy giỏ hàng:", e);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchCartItems();
        }, [])
    );

    const handleUpdateQuantity = (product_id: number, variant_id: number, quantity: number) => {
        setCartItems((prev) =>
            prev.map((item) => ((item.product_id === product_id && item.variant_id === variant_id) ? { ...item, quantity: quantity } : item))
        );
        // update lại asynnc storage 
        updateQuantity(product_id, variant_id, quantity);
    };

    const handleRemove = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.product_id !== id));
        // Xoá khỏi async storage
        updateQuantity(id, 0, 0); 
    };

    const handleCheckout = async (selected: CartItemType[]) => {
        if (selected.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
            return;
        }

        try {
            // Lưu danh sách sản phẩm được chọn vào AsyncStorage (tùy chọn, nếu trang Checkout cần truy cập)
            await AsyncStorage.setItem("selectedCartItems", JSON.stringify(selected));

            // Đồng bộ giỏ hàng với server (giả định có API)
            // await api.post('/cart/checkout', { items: selected });

            // Điều hướng sang trang Checkout và truyền danh sách sản phẩm được chọn
            router.push({
                pathname: "../Checkout",
                params: {
                    selectedItems: JSON.stringify(selected), // Truyền dữ liệu qua params
                },
            });
        } catch (error) {
            console.error("Lỗi khi xử lý thanh toán:", error);
            alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
        }
    };

    return (
        <View className="flex-1">
            <Text
                onPress={async () => {

                }}
            >
                {/* Xem giỏ hàng */}
            </Text>
            <CartList
                data={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
            />
        </View >
    );
}
