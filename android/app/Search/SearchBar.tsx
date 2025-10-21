// components/SearchBar.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Image, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import { useRouter } from "expo-router";
import { api_product_search } from "@/api/api_Products"; 
import debounce from "lodash.debounce";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/default";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Hàm gọi API
    const fetchResults = async (keyword: string) => {
        if (!keyword.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        const data = await api_product_search(keyword);
        
        setResults(data);
        setLoading(false);
    };

    // Debounce để tránh gọi API liên tục
    const debouncedSearch = useCallback(debounce(fetchResults,250), []);

    // Mỗi khi query thay đổi → kích hoạt debounce
    useEffect(() => {
        debouncedSearch(query);
    }, [query]);

    return (
        <View className="relative z-50 w-full">
            {/* Thanh tìm kiếm */}
            <Searchbar
                placeholder="Tìm kiếm sản phẩm..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => {
                    if (query.trim()) router.push(`../Search`);
                }}
                loading={loading}
                style={{
                    borderRadius: 30,
                    backgroundColor: "white",
                    elevation: 2,
                }}
                inputStyle={{ fontSize: 15 }}
                iconColor="gray"
            />

            {/* Danh sách kết quả gợi ý */}
            {results.length > 0 && (
                <View className="absolute left-0 right-0 bg-white border border-gray-200 shadow-lg top-14 rounded-2xl max-h-96">
                    <FlatList
                        data={results}
                        keyExtractor={(item) => item.product_id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        className="flex-1"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex-row items-center p-3 border-b border-gray-100"
                                activeOpacity={0.7}
                                onPress={() => router.push(`/product/${item.product_id}`)}
                            >
                                {/* Ảnh sản phẩm */}
                                <Image
                                    source={{
                                        uri: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE,
                                    }}
                                    className="w-12 h-12 bg-gray-100 rounded-lg"
                                    resizeMode="cover"
                                />
                                {/* Thông tin sản phẩm */}
                                <View className="flex-1 ml-3">
                                    <Text className="font-medium text-gray-900" numberOfLines={1}>
                                        {item.name}
                                    </Text>
                                    <Text className="text-xs text-gray-500">{item.brand}</Text>
                                    <Text className="mt-1 text-sm font-semibold text-gray-700">
                                        {item.min_price}₫ - {item.max_price}₫
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}
