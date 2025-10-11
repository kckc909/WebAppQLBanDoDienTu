import React from "react";
import { Pressable, Text, View, Image } from "react-native";
import { products as Product } from "@/constants/custom.d";

type Props = {
    product: Product;
    onPress?: (product: Product) => void;
};

const ProductCard: React.FC<Props> = ({ product, onPress }) => {
    return (
        <Pressable
            onPress={() => onPress?.(product)}
            className="bg-white rounded-xl shadow-md overflow-hidden m-2 w-40 data-[pressed]:opacity-80"
        >
            <Image
                source={{ uri: product.thumbnail_url ||"https://towadenki.vn/wp-content/plugins/elementor/assets/images/placeholder.png" }}
                className="w-full h-32"
                resizeMode="cover"
            />

            <View className="p-2">
                <Text numberOfLines={1} className="text-base font-semibold text-gray-800">
                    {product.name}
                </Text>
                {product.brand && (
                    <Text className="text-xs text-gray-500">{product.brand}</Text>
                )}

                {/* Giá */}
                <View className="flex-row items-center mt-1">
                    <Text className="font-bold text-red-500">
                        {Number(product.price).toLocaleString('vi-VN')}₫
                    </Text>
                    {product.list_price && product.list_price > product.price && (
                        <Text className="ml-2 text-xs text-gray-400 line-through">
                            {Number(product.price).toLocaleString('vi-VN')}₫
                        </Text>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

export default ProductCard;
