// app/CheckoutScreen.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CheckoutScreen() {
    const { items } = useLocalSearchParams();
    const selectedItems = items ? JSON.parse(items as string) : [];

    const total = selectedItems.reduce(
        (sum: any, item: any) => sum + item.price * item.quantity,
        0
    );

    return (
        <ScrollView className="flex-1 p-4 bg-white">
            <Text className="mb-4 text-lg font-bold">Xác nhận đơn hàng</Text>

            {selectedItems.map((item: any) => (
                <View key={item.id} className="p-3 mb-2 border rounded-lg">
                    <Text className="font-semibold">{item.name}</Text>
                    <Text>Số lượng: {item.quantity}</Text>
                    <Text>Giá: {item.price}₫</Text>
                </View>
            ))}

            <View className="pt-3 mt-4 border-t">
                <Text className="text-lg font-bold">Tổng tiền: {total.toLocaleString()}₫</Text>
            </View>
        </ScrollView>
    );
}
