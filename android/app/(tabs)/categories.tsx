import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api_getCategories } from "@/api/api_Categories";
import Category from "@/components/ui/Category";
import LazyProductList from "@/components/ui/LazyProductList";

type CategoryType = {
    category_id: number;
    name: string;
    slug: string;
    icon?: string;
};

const CategoriesScreen: React.FC = () => {
    const navigation = useNavigation();
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        api_getCategories().then((data) => {
            setCategories(data);
        });
    }, []);

    // 🔹 Nếu chưa expanded -> chỉ lấy 12 item đầu (3 hàng × 4 cột)
    const visibleCategories = expanded ? categories : categories.slice(0, 12);

    return (
        <View className="flex-1 bg-gray-50">
            {/* Danh mục */}
            <View className="p-3 bg-white">
                <Text className="mb-3 text-lg font-semibold">
                    Danh mục
                </Text>

                <FlatList
                    data={visibleCategories}
                    keyExtractor={(item) => item.category_id.toString()}
                    numColumns={4}
                    renderItem={({ item }) => (
                        <View className="items-center flex-1 mb-4">
                            <Category
                                name={
                                    item.name.length > 10
                                        ? item.name.slice(0, 10) + "..."
                                        : item.name
                                }
                                icon={item.icon as string}
                                onPress={() =>
                                    console.log("\n")
                                }
                            />
                        </View>
                    )}
                    scrollEnabled={false} // tránh xung đột với ScrollView ngoài
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                />

                {/* Nút xem thêm / thu gọn */}
                {categories.length > 12 && (
                    <TouchableOpacity
                        onPress={() => setExpanded(!expanded)}
                        className="self-center m-2"
                    >
                        <Text className="font-medium text-blue-600">
                            {expanded ? "Thu gọn" : "Xem thêm"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {/* Sản phẩm */}
            <LazyProductList
                contentContainerStyle={{ marginTop: 10 }}
                onProductPress={(product) =>
                    console.log(product.thumbnail_url)
                }
            ></LazyProductList>
        </View>
    );
};

export default CategoriesScreen;
