import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { use, useEffect, useState } from "react";
import { api_getProductDetail } from "@/api/api_Products";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/default";
import ProductRating from "@/components/ui/ProductRating";
import ImagesGallery from "@/components/ui/ImagesGallery";
import { ATTRIBUTE_DISPLAY_NAMES } from "@/constants/AttriName";
import ProductAttributes from "./ProductAtrributes";

export default function ProductDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [showAll, setShowAll] = useState(false);
    const [loading, setLoading] = useState(true);
    const [productData, setProductData] = useState<any>(null);
    const [variants, setVariants] = useState<any[]>([]);
    const [currentVariant, setCurrentVariant] = useState<any>(null);
    const [attributes, setAttributes] = useState<Record<string, any>>({});
    const [images, setImages] = useState<any[]>([]);
    const [imgs, setImgs] = useState<string[]>([]);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        api_getProductDetail(id)
            .then((data) => {
                if (!data) return;
                setProductData(data);
                setImages(data.images || []);
                setVariants(data.variants || []);
                setAttributes(data.attributes || {});
                setCurrentVariant(data.variants?.[0] || null);
            })
            .catch((err) => console.error("Error:", err))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (images.length > 0) {
            setImgs(images.map((img) => img.url || DEFAULT_PRODUCT_IMAGE));
        }
    }, [images]);

    // 🌀 Hiển thị màn hình loading
    if (loading) {
        return (
            <View className="items-center justify-center flex-1 bg-gray-50">
                <ActivityIndicator size="large" color="#ef4444" />
                <Text className="mt-2 text-gray-500">Đang tải sản phẩm...</Text>
            </View>
        );
    }
    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView>
                <ImagesGallery images={imgs}></ImagesGallery>

                {/* Thông tin cơ bản */}
                <View className="px-4 py-3 mt-2 bg-white">
                    <Text className="text-xl font-bold">{productData?.name || "..."}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={16} color="orange" />
                        <ProductRating rating={productData?.rating || 0} />
                    </View>
                    <View>
                        <View className="flex-row items-baseline mt-2 space-x-3">
                            <Text className="mt-2 text-sm font-bold text-gray-400 line-through">
                                {(currentVariant?.list_price).toLocaleString("vi-VN") || ""} VNĐ
                            </Text>
                            <Text className="mt-1 text-xl font-bold text-red-500">
                                {currentVariant?.price.toLocaleString("vi-VN")} VNĐ
                            </Text>
                        </View>

                    </View>
                </View>

                {/* Phiên bản khác */}
                {variants.length > 1 && (
                    <View className="px-4 py-3 mt-2 bg-white rounded-2xl">
                        <Text className="mb-2 text-lg font-semibold text-gray-900">
                            Phiên bản khác
                        </Text>

                        {(showAll ? variants : variants.slice(0, 3)).map((v) => (
                            <TouchableOpacity
                                key={v.id}
                                className="py-2 border-b border-gray-200"
                                onPress={() => setCurrentVariant(v)}
                            >
                                <Text className="text-gray-700">{v.name}</Text>
                                <Text className="font-bold text-red-500">
                                    {v.price.toLocaleString("vi-VN")} ₫
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {/* Nếu có hơn 3 phiên bản thì hiển thị nút xem thêm */}
                        {variants.length > 3 && (
                            <TouchableOpacity
                                onPress={() => setShowAll(!showAll)}
                                className="mt-2"
                            >
                                <Text className="font-medium text-blue-500">
                                    {showAll ? "Thu gọn" : "Xem thêm"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}

                {/* Thông số kỹ thuật */}
                {Object.keys(attributes).length > 0 && (
                    <ProductAttributes attributes={attributes} />
                )}
            </ScrollView>

            {/* Thanh hành động */}
            <View className="flex-row items-center justify-between px-4 py-3 bg-white border-t">
                <Text className="text-lg font-bold text-red-500">{currentVariant?.price.toLocaleString() || 0} VNĐ</Text>
                <View>
                    <TouchableOpacity className="flex-row items-center px-6 py-3 bg-blue-500 rounded-full"
                        onPress={() => {
                            if (!productData) return;

                            // Thêm sản phẩm vào giỏ hàng

                        }}
                    >
                        <Ionicons name="cart-outline" size={20} color="white" />
                        <Text className="ml-2 font-semibold text-white">Thêm vào giỏ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-row items-center px-6 py-3 mt-3 bg-red-500 rounded-full"
                        onPress={() => {
                            if (!productData) return;

                            // Thanh toán

                        }}
                    >
                        <Ionicons name="cart-outline" size={20} color="white" />
                        <Text className="ml-2 font-semibold text-white">Mua ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
