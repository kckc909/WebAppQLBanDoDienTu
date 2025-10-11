import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CartScreen() {
    const [cart, setCart] = useState([
        {
            "id": "1",
            "name": "Canon EOS RP Kit RF24",
            "price": 28390000,
            "currency": "VND",
            "shop": "kyma.vn", "qty": 2,
            "image_url": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS3QYIksZaO_J1nsz8KYyOQ_L9hvrvbqfIMqp2pq3W0wZsTZF2Tglcld73snYFG8nDTl9KQ9QutWv-Z_U0tXS8F1kmI0YI55dvo-0kINwbisPMfUAtsLdsgJ-hBIaqZtRsE_8bFTQ&usqp=CAc"
        },
        {
            "id": "2",
            "name": "Surface Laptop 7 15",
            "price": 52990000,
            "currency": "VND",
            "shop": "Surfacecity.vn", "qty": 2,
            "image_url": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTx5AQ2cBXWqhP3kLfJsSQCrKkrDLreKjgWnYhhctE8Nv4uGj4LOMR_BuYM_ic5JqXToA8m9GiU435BWx03W9rjQttfMAvtMOA1gmIoEBR0PIHTsbmAftrlRI2egz769qxGSQt3AA&usqp=CAc"
        },
        {
            "id": '3',
            "name": "Macbook Air M2 13-inch",
            "price": 18490000,
            "currency": "VND",
            "shop": "uscom.com.vn", "qty": 2,
            "image_url": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSNSol_xXJ7DI8kbD0oi2NPqQGMtuCGo0sS8Q__jz_AD5cHRuW6JyiXwvQt8sljEVFwQMztHhwy3d37TMgUQlcvC_TmTUg6lfmyJWZV86Rq-N0Nvm5NQ2YbGMbhuK47nEfTdJ5evw&usqp=CAc"
        },
        {
            "id": '4',
            "name": "Canon EOS RP Kit RF24",
            "price": 28390000,
            "currency": "VND",
            "shop": "kyma.vn", "qty": 2,
            "image_url": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcS3QYIksZaO_J1nsz8KYyOQ_L9hvrvbqfIMqp2pq3W0wZsTZF2Tglcld73snYFG8nDTl9KQ9QutWv-Z_U0tXS8F1kmI0YI55dvo-0kINwbisPMfUAtsLdsgJ-hBIaqZtRsE_8bFTQ&usqp=CAc"
        },
        {
            "id": '5',
            "name": "Surface Laptop 7 15",
            "price": 52990000,
            "currency": "VND",
            "shop": "Surfacecity.vn", "qty": 2,
            "image_url": "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTx5AQ2cBXWqhP3kLfJsSQCrKkrDLreKjgWnYhhctE8Nv4uGj4LOMR_BuYM_ic5JqXToA8m9GiU435BWx03W9rjQttfMAvtMOA1gmIoEBR0PIHTsbmAftrlRI2egz769qxGSQt3AA&usqp=CAc"
        },
        {
            "id": '6',
            "name": "Macbook Air M2 13-inch",
            "price": 18490000,
            "currency": "VND",
            "shop": "uscom.com.vn",
            "image_url": "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSNSol_xXJ7DI8kbD0oi2NPqQGMtuCGo0sS8Q__jz_AD5cHRuW6JyiXwvQt8sljEVFwQMztHhwy3d37TMgUQlcvC_TmTUg6lfmyJWZV86Rq-N0Nvm5NQ2YbGMbhuK47nEfTdJ5evw&usqp=CAc",
            "qty": 2,
        },
    ]
    );

    const [promo, setPromo] = useState("");
    const deliveryFee = 25;
    const discount = 35;

    const updateQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id == id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            )
        );
    };

    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const subTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subTotal + deliveryFee - discount;

    const renderItem = ({ item }: any) => (
        <View className="flex-row items-center justify-between p-4 mb-2 bg-white shadow rounded-xl">
            {/* Hình sản phẩm (tạm placeholder) */}
            <Image
                source={{ uri: item.image_url }}
                className="w-16 h-16 rounded-md"
            />
            <View className="flex-1 ml-3">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.category}</Text>
                <Text className="mt-1 font-bold">${item.price.toFixed(2)}</Text>
            </View>

            {/* Nút tăng/giảm */}
            <View className="flex-row items-center">
                <TouchableOpacity
                    className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                    onPress={() => updateQty(item.id, -1)}
                >
                    <Text className="text-lg">-</Text>
                </TouchableOpacity>
                <Text className="mx-2">{item.qty}</Text>
                <TouchableOpacity
                    className="items-center justify-center w-8 h-8 bg-gray-200 rounded-full"
                    onPress={() => updateQty(item.id, 1)}
                >
                    <Text className="text-lg">+</Text>
                </TouchableOpacity>
            </View>

            {/* Nút xóa */}
            <TouchableOpacity
                className="ml-3"
                onPress={() => removeItem(item.id)}
            >
                <Text className="text-xl text-red-500">🗑</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">

            {/* Danh sách sản phẩm */}
            <FlatList
                data={cart}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
            />

            {/* Panel dưới cùng */}
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-lg rounded-t-2xl">
                {/* Promo Code */}
                <View className="flex-row mb-3">
                    <TextInput
                        placeholder="Promo Code"
                        value={promo}
                        onChangeText={setPromo}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-full"
                    />
                    <TouchableOpacity className="items-center justify-center px-4 bg-gray-800 rounded-r-full">
                        <Text className="font-semibold text-white">Apply</Text>
                    </TouchableOpacity>
                </View>

                {/* Tổng tiền */}
                <View className="mb-3 space-y-1">
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Sub-Total</Text>
                        <Text>${subTotal.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Delivery Fee</Text>
                        <Text>${deliveryFee.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Discount</Text>
                        <Text className="text-red-500">-${discount.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between pt-2 mt-2 border-t border-dashed">
                        <Text className="font-bold">Total Cost</Text>
                        <Text className="font-bold">${total.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Nút Checkout */}
                <TouchableOpacity className="items-center py-3 bg-black rounded-full">
                    <Text className="font-semibold text-white">Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
