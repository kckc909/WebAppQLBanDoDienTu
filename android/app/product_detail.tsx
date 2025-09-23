import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function ProductDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const product = {
        id: 1,
        name: "Surface Laptop 7 15 inch Snapdragon X Elite/32GB/1TB (Chính hãng)",
        price: "30.000.000",
        rating: 4.5,
        category: "Laptop",
        images: [
            "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTx5AQ2cBXWqhP3kLfJsSQCrKkrDLreKjgWnYhhctE8Nv4uGj4LOMR_BuYM_ic5JqXToA8m9GiU435BWx03W9rjQttfMAvtMOA1gmIoEBR0PIHTsbmAftrlRI2egz769qxGSQt3AA&usqp=CAc",
            "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSNSol_xXJ7DI8kbD0oi2NPqQGMtuCGo0sS8Q__jz_AD5cHRuW6JyiXwvQt8sljEVFwQMztHhwy3d37TMgUQlcvC_TmTUg6lfmyJWZV86Rq-N0Nvm5NQ2YbGMbhuK47nEfTdJ5evw&usqp=CAc",
        ],
        variants: [
            { id: 2, name: "Surface Laptop 7 13 inch 16GB/512GB", price: "25.000.000" },
            { id: 3, name: "Surface Laptop 7 15 inch 16GB/1TB", price: "28.000.000" },
        ],
        attributes: {
            "Màn hình": "15 inch PixelSense",
            "CPU": "Snapdragon X Elite",
            "RAM": "32GB",
            "Ổ cứng": "1TB SSD",
            "Hệ điều hành": "Windows 11",
        },
    };

    const relatedProducts = [
        { id: 101, name: "Macbook Air M3", price: "27.000.000", image: product.images[0] },
        { id: 102, name: "Dell XPS 13", price: "29.000.000", image: product.images[1] },
    ];

    const [selectedImage, setSelectedImage] = useState(product.images[0]);

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white">
                <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
                <Text className="text-lg font-semibold">Chi tiết sản phẩm : {id}</Text>
                <Ionicons name="heart-outline" size={24} />
            </View>

            <ScrollView>
                {/* Ảnh chính */}
                <View className="items-center bg-white">
                    <Image source={{ uri: selectedImage }} className="w-80 h-80" resizeMode="contain" />
                </View>

                {/* Slide ảnh nhỏ */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 py-2 bg-white">
                    {product.images.map((img, i) => (
                        <TouchableOpacity key={i} onPress={() => setSelectedImage(img)}>
                            <Image
                                source={{ uri: img }}
                                className={`w-20 h-20 mr-3 border rounded-lg ${selectedImage === img ? "border-red-500" : "border-gray-300"}`}
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Thông tin cơ bản */}
                <View className="px-4 py-3 mt-2 bg-white">
                    <Text className="text-xl font-bold">{product.name}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={16} color="orange" />
                        <Text className="ml-1">{product.rating}</Text>
                    </View>
                    <Text className="mt-2 text-lg font-bold text-red-500">{product.price} VNĐ</Text>
                </View>

                {/* Phiên bản khác */}
                {product.variants?.length > 0 && (
                    <View className="px-4 py-3 mt-2 bg-white">
                        <Text className="mb-2 font-semibold">Phiên bản khác</Text>
                        {product.variants.map((v) => (
                            <TouchableOpacity key={v.id} className="py-2 border-b border-gray-200">
                                <Text className="text-gray-700">{v.name}</Text>
                                <Text className="font-bold text-red-500">{v.price} VNĐ</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Thông số kỹ thuật */}
                <View className="px-4 py-3 mt-2 bg-white">
                    <Text className="mb-2 font-semibold">Thông số kỹ thuật</Text>
                    {Object.entries(product.attributes).map(([key, value]) => (
                        <View key={key} className="flex-row justify-between py-1">
                            <Text className="text-gray-600">{key}</Text>
                            <Text className="font-medium">{value}</Text>
                        </View>
                    ))}
                </View>

                {/* Đánh giá */}
                <View className="px-4 py-3 mt-2 bg-white">
                    <Text className="mb-2 font-semibold">Đánh giá sản phẩm</Text>
                    <Text className="text-gray-500">Chưa có đánh giá nào</Text>
                </View>

                {/* Sản phẩm liên quan */}
                <View className="px-4 py-3 mt-2 bg-white">
                    <Text className="mb-2 font-semibold">Sản phẩm liên quan</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {relatedProducts.map((p) => (
                            <View key={p.id} className="mr-4 w-36">
                                <Image source={{ uri: p.image }} className="rounded-lg w-36 h-36" resizeMode="cover" />
                                <Text className="mt-2 text-sm font-semibold">{p.name}</Text>
                                <Text className="font-bold text-red-500">{p.price} VNĐ</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* LazyProductList (gợi ý thêm) */}
                {/* <LazyProductList apiUrl="/products?limit=10" /> */}
            </ScrollView>

            {/* Thanh hành động */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-t">
                <Text className="text-lg font-bold">{product.price} VNĐ</Text>
                <TouchableOpacity className="flex-row items-center px-6 py-3 bg-red-500 rounded-full">
                    <Ionicons name="cart-outline" size={20} color="white" />
                    <Text className="ml-2 font-semibold text-white">Thêm vào giỏ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
