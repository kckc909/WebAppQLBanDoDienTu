import React, { useState, useMemo } from "react";
import { View, FlatList, Text } from "react-native";
import { Button } from "react-native-paper";
import CartItem from "./CartItem";
import { CartItemType } from "@/constants/custom.d";

type Props = {
    data: CartItemType[];
    onUpdateQuantity: (product_id: number, variant_id: number, quantity: number) => void;
    onRemove: (id: number) => void;
    onCheckout: (selected: CartItemType[]) => void;
};

const CartList: React.FC<Props> = ({
    data,
    onUpdateQuantity,
    onRemove,
    onCheckout,
}) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const totalPrice = useMemo(() => {
        return data
            .filter((item) => selectedIds.includes(item.product_id))
            .reduce((sum, i) => sum + i.price * i.quantity, 0);
    }, [selectedIds, data]);

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={data}
                keyExtractor={(item) => item.product_id.toString()}
                renderItem={({ item }) => (
                    <CartItem
                        item={{ ...item, selected: selectedIds.includes(item.product_id) }}
                        onSelect={toggleSelect}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemove={onRemove}
                    />
                )}
                ListEmptyComponent={
                    <Text className="mt-10 text-center text-gray-400">
                        Giỏ hàng trống
                    </Text>
                }
            />

            {/* Footer */}
            <View className="p-4 bg-white border-t border-gray-200">
                <View className="flex-row justify-between mb-2">
                    <Text className="font-medium text-gray-700">Tổng cộng:</Text>
                    <Text className="font-bold text-red-500">
                        {totalPrice.toLocaleString()}₫
                    </Text>
                </View>

                <Button
                    mode="contained"
                    disabled={selectedIds.length === 0}
                    onPress={() =>
                        onCheckout(data.filter((i) => selectedIds.includes(i.product_id)))
                    }
                >
                    Thanh toán ({selectedIds.length})
                </Button>
            </View>
        </View>
    );
};

export default CartList;