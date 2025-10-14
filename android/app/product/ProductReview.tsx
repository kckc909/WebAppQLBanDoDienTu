import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { get_review_by_product, post_review } from "@/api/api_Review";
import { reviews } from "@/constants/custom.d";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/default";

type Props = {
    productId: string | number;
    user?: any;
};

const ProductReviewSection: React.FC<Props> = ({ productId, user }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const data = await get_review_by_product(productId as number);
            setReviews(data || []);
        } catch (e) {
            console.error("Error fetching reviews", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!user) return alert("Bạn cần đăng nhập để đánh giá");
        if (!rating) return alert("Vui lòng chọn số sao");

        try {
            const review = {
                product_id: productId,
                user_id: user.id,
                rating,
                comment,
            } as reviews;
            await post_review(review);
            setComment("");
            setRating(0);
            fetchReviews();
        } catch (e) {
            console.error("Error posting review", e);
        }
    };

    const renderStar = (index: number) => (
        <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
            <Ionicons
                name={index < rating ? "star" : "star-outline"}
                size={24}
                color="#fbbf24"
            />
        </TouchableOpacity>
    );

    if (loading)
        return (
            <View className="items-center py-4">
                <ActivityIndicator animating />
            </View>
        );

    return (
        <View className="p-4 mt-5 bg-white shadow rounded-2xl">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Đánh giá sản phẩm</Text>

            {/* ⭐ Form đánh giá */}
            <View className="pb-4 mb-4 border-b border-gray-200">
                <Text className="mb-1 text-gray-700">Chọn số sao của bạn:</Text>
                <View className="flex-row mb-3">{[...Array(5)].map((_, i) => renderStar(i))}</View>

                <TextInput
                    placeholder="Viết lời bình..."
                    value={comment}
                    onChangeText={setComment}
                    className="p-2 text-gray-700 border border-gray-300 rounded-lg"
                    multiline
                />

                {/* Placeholder cho ảnh / video */}
                <View className="flex-row mt-3 space-x-2">
                    <TouchableOpacity
                        className="flex-row items-center p-3 space-x-1 border border-gray-300 rounded-lg opacity-60"
                        onPress={() => alert("Tính năng đang phát triển")}
                    >
                        <Ionicons name="image-outline" size={18} color="gray" />
                        <Text className="text-sm text-gray-500">Thêm ảnh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex-row items-center p-3 space-x-1 border border-gray-300 rounded-lg opacity-60"
                        onPress={() => alert("Tính năng đang phát triển")}
                    >
                        <Ionicons name="videocam-outline" size={18} color="gray" />
                        <Text className="text-sm text-gray-500">Thêm video</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleSubmitReview}
                    className="py-2 mt-4 bg-blue-600 rounded-lg"
                >
                    <Text className="font-semibold text-center text-white">Gửi đánh giá</Text>
                </TouchableOpacity>
            </View>

            {/* 💬 Danh sách đánh giá */}
            {reviews.length === 0 ? (
                <Text className="italic text-center text-gray-500">Chưa có đánh giá nào</Text>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.review_id.toString()}
                    renderItem={({ item }) => (
                        <View className="pb-3 mb-4 border-b border-gray-200">
                            <View className="flex-row items-center mb-1">
                                <Image
                                    source={{ uri: item.user_avatar || DEFAULT_PRODUCT_IMAGE }}
                                    className="w-8 h-8 mr-2 rounded-full"
                                />
                                <Text className="font-semibold text-gray-800">{item.user_name}</Text>
                            </View>
                            <View className="flex-row mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Ionicons
                                        key={i}
                                        name={i < item.rating ? "star" : "star-outline"}
                                        size={16}
                                        color="#facc15"
                                    />
                                ))}
                            </View>
                            <Text className="text-gray-700">{item.comment}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

export default ProductReviewSection;
