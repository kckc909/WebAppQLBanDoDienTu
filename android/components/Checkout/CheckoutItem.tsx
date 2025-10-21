// components/Checkout/CheckoutItem.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CheckoutItemProps {
    item: any;
    onQuantityChange?: (variantId: number, newQuantity: number) => void;
    onRemove?: (variantId: number) => void;
    editable?: boolean;
}

export const CheckoutItem = ({
    item,
    onQuantityChange,
    onRemove,
    editable = true
}: CheckoutItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleDecrease = () => {
        if (quantity <= 1) {
            // Confirm remove if quantity = 1
            Alert.alert(
                'Xác nhận',
                'Bạn có muốn xóa sản phẩm này khỏi đơn hàng?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => onRemove?.(item.variant_id)
                    }
                ]
            );
            return;
        }

        const newQuantity = quantity - 1;
        setQuantity(newQuantity);
        onQuantityChange?.(item.variant_id, newQuantity);
    };

    const handleIncrease = () => {
        // Check stock
        if (quantity >= item.stock) {
            Alert.alert('Thông báo', `Chỉ còn ${item.stock} sản phẩm trong kho`);
            return;
        }

        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        onQuantityChange?.(item.variant_id, newQuantity);
    };

    const subtotal = item.price * quantity;

    return (
        <View className="flex-row p-4 bg-white border-b border-gray-200">
            {/* Product Image */}
            <Image
                source={{ uri: item.thumbnail_url || item.product_thumbnail }}
                className="w-20 h-20 rounded-lg"
                resizeMode="cover"
            />

            {/* Product Info */}
            <View className="flex-1 ml-3">
                {/* Product Name */}
                <Text className="text-base font-semibold text-gray-800" numberOfLines={2}>
                    {item.product_name}
                </Text>

                {/* Variant Name */}
                <Text className="mt-1 text-sm text-gray-500">{item.variant_name}</Text>

                {/* Price & Quantity */}
                <View className="flex-row items-center justify-between mt-2">
                    {/* Price */}
                    <View>
                        <Text className="text-base font-bold text-red-600">
                            {item.price.toLocaleString('vi-VN')}₫
                        </Text>
                        {quantity > 1 && (
                            <Text className="text-xs text-gray-400 mt-0.5">
                                Tổng: {subtotal.toLocaleString('vi-VN')}₫
                            </Text>
                        )}
                    </View>

                    {/* Quantity Control */}
                    {editable ? (
                        <View className="flex-row items-center bg-gray-100 rounded-lg">
                            <TouchableOpacity
                                onPress={handleDecrease}
                                className="items-center justify-center w-8 h-8"
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={quantity === 1 ? "trash-outline" : "remove"}
                                    size={18}
                                    color={quantity === 1 ? "#EF4444" : "#374151"}
                                />
                            </TouchableOpacity>

                            <View className="px-3 min-w-[40px] items-center">
                                <Text className="text-base font-semibold text-gray-800">
                                    {quantity}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleIncrease}
                                className="items-center justify-center w-8 h-8"
                                activeOpacity={0.7}
                                disabled={quantity >= item.stock}
                            >
                                <Ionicons
                                    name="add"
                                    size={18}
                                    color={quantity >= item.stock ? "#D1D5DB" : "#374151"}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Text className="text-sm text-gray-600">
                            Số lượng: {quantity}
                        </Text>
                    )}
                </View>

                {/* Stock Warning */}
                {item.stock <= 5 && (
                    <View className="flex-row items-center mt-2">
                        <Ionicons name="alert-circle-outline" size={14} color="#F59E0B" />
                        <Text className="ml-1 text-xs text-amber-600">
                            Chỉ còn {item.stock} sản phẩm
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

// Variant: Read-only version for order confirmation
export const CheckoutItemReadOnly = ({ item }: any) => {
    return <CheckoutItem item={item} editable={false} />;
};