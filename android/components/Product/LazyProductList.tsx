import { api_get_product_list as api_get_product_list } from "@/api/api_Products";
import React, { useState, useEffect } from "react";
import { FlatList, ActivityIndicator, ViewStyle } from "react-native";
import ProductCard from "../Product/ProductCard";
import { products } from "@/constants/custom.d";

type Product = {
    product_id: number;
    name: string;
    price: number;
    thumbnail_url?: string;
};

type Props = {
    onProductPress?: (product: Product) => void;
    contentContainerStyle?: ViewStyle;
};

const LazyProductList: React.FC<Props> = ({ onProductPress, contentContainerStyle }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const fetchProducts = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const mockData = await api_get_product_list();

            setProducts((prev) => [...prev, ...mockData]);
            if (page >= 10) setHasMore(false); // giả sử có 5 page
            setPage(page + 1);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <FlatList
            data={products}
            keyExtractor={(item, idx) => idx.toString()}
            renderItem={({ item }) => (
                <ProductCard product={item as products} onPress={onProductPress}></ProductCard>
            )}
            numColumns={2}
            contentContainerStyle={[{ alignItems: "center" }, contentContainerStyle]}
            onEndReached={fetchProducts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                loading ? <ActivityIndicator className="my-3" /> : null
            }

        />
    );
};

export default LazyProductList;
