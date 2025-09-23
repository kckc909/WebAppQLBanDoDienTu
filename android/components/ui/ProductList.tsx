import React from "react";
import { FlatList, ViewStyle } from "react-native";
import ProductCard from "./ProductCard";
import { products as Product } from "@/constants/custom.d";
import { useRouter } from "expo-router";

type Props = {
	products: Product[];
	onProductPress?: (product: Product) => void;
	horizontal?: boolean;
	numColumns?: number;
	contentContainerStyle?: ViewStyle;
};

const ProductList: React.FC<Props> = ({
	products,
	onProductPress,
	horizontal = false,
	numColumns = 2,
	contentContainerStyle,
}) => {
	const router = useRouter();

	return (
		<FlatList
			data={products}
			keyExtractor={(item) => item.product_id.toString()}
			horizontal={horizontal}
			numColumns={horizontal ? 1 : numColumns}
			renderItem={({ item }) => (
				<ProductCard product={item} onPress={onProductPress || (() => {
					router.push(`/product_detail`);
				})} />
			)}
			contentContainerStyle={contentContainerStyle}
			showsHorizontalScrollIndicator={false}
		/>
	);
};

export default ProductList;
