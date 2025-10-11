import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import { Searchbar, ActivityIndicator, Text, Card, IconButton } from "react-native-paper";
import { api_product_search } from "@/api/api_Products";
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
    const navigation = useNavigation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const handleSearch = async (text: string) => {
        setLoading(true);
        try {
            const res = await api_product_search(text);
            setResults(res.data);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Thanh search */}
            <View className="p-3">
                <View className="flex-row items-center">
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        onPress={() => navigation.goBack()}
                    />
                    <View className="flex-1">
                        <Searchbar
                            placeholder="Tìm kiếm sản phẩm..."
                            value={query}
                            onChangeText={setQuery}
                            autoFocus
                            className="rounded-xl"
                        />
                    </View>
                    <IconButton
                        icon="filter-variant"
                        size={22}
                        onPress={() => setShowFilter(!showFilter)}
                    />
                </View>
            </View>

            {/* Bộ lọc mở rộng */}
            {showFilter && (
                <View className="p-4 border-t border-gray-100 bg-gray-50">
                    <Text className="text-gray-600">Tùy chọn lọc sẽ hiển thị ở đây</Text>
                </View>
            )}

            {/* Kết quả tìm kiếm */}
            {loading ? (
                <View className="items-center justify-center flex-1">
                    <ActivityIndicator animating={true} size="large" />
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                        <Text className="mt-10 text-center text-gray-400">
                            {query ? "Không tìm thấy sản phẩm." : "Nhập từ khóa để bắt đầu tìm kiếm."}
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="mx-3 mb-3"
                            activeOpacity={0.9}
                            onPress={() => console.log("Đi đến trang sản phẩm", item.id)}
                        >
                            <Card className="overflow-hidden rounded-xl">
                                <View className="flex-row items-center p-3">
                                    <Image
                                        source={{ uri: item.thumbnail }}
                                        className="w-16 h-16 rounded-lg"
                                    />
                                    <View className="flex-1 ml-3">
                                        <Text className="font-semibold text-gray-800">{item.name}</Text>
                                        <Text className="text-sm text-gray-500">{item.brand}</Text>
                                        <Text className="font-bold text-red-500">
                                            {item.price.toLocaleString()}₫
                                        </Text>
                                    </View>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
};
function debounce(handleSearch: (text: string) => Promise<void>, arg1: number): any {
    throw new Error("Function not implemented.");
}

