import { View, Text, TextInput, TouchableOpacity, Image, FlatList } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { categories, products, users } from "@/constants/custom.d";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import ProductList from "@/components/ui/ProductList";
import HorizontalSlider from "@/components/ui/HorizontalSlider";
import Category from "@/components/ui/Category";
import { api_getCategories } from "@/api/api_Categories";
import { api_get_product_list } from "@/api/api_Products";
import LazyProductList from "@/components/ui/LazyProductList";
import { Searchbar } from "react-native-paper";
import SearchBar from "../Search/SearchBar";
export default function HomeScreen() {
	const router = useRouter();

	// fake data
	const imgs = [
		"https://cdn.grabon.in/gograbon/images/web-images/uploads/1621488513434/today-electronics-offers.jpg",
		"https://img.freepik.com/free-vector/electronics-store-template-design_23-2151125624.jpg",
		"https://www.shutterstock.com/image-vector/mega-sale-advertiving-banner-3d-260nw-2000590271.jpg"
	];

	// State
	const [list_Product, setLstProduct] = useState<products[]>([]);
	const [timeLeft, setTimeLeft] = useState(8000);
	const [user, setUser] = useState<users | null>();
	const [list_categoies, setCategories] = useState<categories[]>([]);
	const [query, setQuery] = useState('');


	// effects
	useEffect(() => {
		api_get_product_list().then((data) => {
			if (data.length % 2 === 1) {
				data.pop();
			}
			setLstProduct(data);
		});

		api_getCategories().then((data) => {
			setCategories(data);
		});
	}, []);

	// đếm ngược
	useEffect(() => {
		if (timeLeft <= 0) return;
		const intervalId = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, [timeLeft]);

	const formatTime = (seconds: number) => {
		if (seconds < 0) return "00:00:00";
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		const s = seconds % 60;
		return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
	};

	const listHeaderCom = (
		<>
			{/* Header */}
			<View className="p-5 bg-gray-800 rounded-b-3xl">
				{/* Users + Notification */}
				<View className="flex-row items-center justify-between mb-3">
					{user ? (
						<View className="flex-row items-center">
							<Image
								source={{ uri: user.avatar_url || "https://via.placeholder.com/40" }}
								className="w-10 h-10 rounded-full"
							/>
							<View className="ml-3">
								<Text className="text-xs text-gray-300">Welcome back,</Text>
								{/* <Text className="font-semibold text-white">{user.fullname}</Text> */}
							</View>
						</View>
					) : (
						<TouchableOpacity
							className="flex flex-row items-center px-4 py-2 bg-white rounded-full"
							onPress={() => router.push("/auth/login")}
						>
							<MaterialIcons name="lock" size={20} color="gray" />
							<Text className="font-semibold text-gray-800">Login</Text>
						</TouchableOpacity>
					)}
					<TouchableOpacity className="p-2 bg-gray-700 rounded-full">
						<Ionicons name="notifications-outline" size={20} color="white" />
					</TouchableOpacity>
				</View>
			</View>
			<View className="p-2" ><Text onPress={
				() => {
					router.push('../Search')
				}
			}>adsnasjdnasd</Text></View>
			<View className="p-2">
				<SearchBar />
			</View>

			{/* 🔹 Special Offer Slider */}
			<Text className="px-4 mt-4 mb-2 text-lg font-bold">Khuyến mãi đặc biệt</Text>
			<HorizontalSlider
				data={imgs.map((url, index) => ({
					id: index.toString(),
					title: "Special Offer",
					image: url,
				}))}
			/>

			{/* 🔹 Category */}
			<View className="px-4 mt-6">
				<FlatList
					data={[...list_categoies, { name: "Xem thêm", icon: "more-horiz" }]}
					keyExtractor={(item, idx) => idx.toString()}
					horizontal
					showsHorizontalScrollIndicator={false}
					renderItem={({ item }) => (
						<Category
							name={
								item.name.length > 10 ? item.name.slice(0, 10) + "..." : item.name
							}
							icon={item.icon as string}
							onPress={() => {
								router.push('../category')
							}}
						/>
					)}
				/>
			</View>

			{/* 🔹 Flash Sale */}
			<View className="px-4 mt-6">
				<View className="flex-row items-center justify-between mb-3">
					<Text className="text-lg font-bold">Flash Sale</Text>
					<Text className="text-red-400">Closing in: {formatTime(timeLeft)}</Text>
				</View>

				{/* Filter Tabs */}
				<View className="flex-row">
					{["Tất cả", "Laptop", "PC", "Smartphone", "Tablet", "Phụ kiện", "Linh kiện"].map(
						(tab, idx) => (
							<TouchableOpacity
								key={idx}
								className={`px-4 py-1 rounded-full mr-2 ${idx === 1 ? "bg-black" : "bg-gray-200"}`}
								onPress={() => {

								}}
							>
								<Text
									className={`${idx === 1 ? "text-white" : "text-gray-700"
										} text-sm`}
								>
									{tab}
								</Text>
							</TouchableOpacity>
						)
					)}
				</View>
				<ProductList
					products={list_Product}
					horizontal={true}
					numColumns={1}
					onProductPress={(product) => router.push(`./product/${product.product_id}`)}
				/>
			</View>

			{/* Lazy Product List */}
			<Text className="px-4 mt-6 text-lg font-bold"> Xem thêm </Text>
		</>
	);

	return (
		<View className="flex-col flex-1 bg-gray-100">
			<FlatList
				data={list_Product}
				keyExtractor={(item, idx) => idx.toString()}
				ListHeaderComponent={listHeaderCom}
				renderItem={() => null}
				ListFooterComponent={
					<LazyProductList onProductPress={(item) => router.push(`/product/${item.product_id}`)} />
				}
				ListFooterComponentStyle={{ alignItems: "center" }}
			/>
		</View>
	);
}
