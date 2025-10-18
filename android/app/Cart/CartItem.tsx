import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import { Checkbox, IconButton, Dialog, Portal, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { CartItemType } from "@/constants/custom.d";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants/default";

type Props = {
    item: CartItemType;
    onSelect: (id: number) => void;
    onUpdateQuantity: (product_id: number, variant_id: number, quantity: number) => void;
    onRemove: (id: number) => void;
};

const CartItem: React.FC<Props> = ({
    item,
    onSelect,
    onUpdateQuantity,
    onRemove,
}) => {

    const [showDialog, setShowDialog] = useState(false);

    const handleDecrease = () => {
        if (item.quantity <= 1) {
            setShowDialog(true);
        } else {
            onUpdateQuantity(item.product_id, item.variant_id, item.quantity - 1);
        }
    };

    const handleIncrease = () => {
        onUpdateQuantity(item.product_id, item.variant_id, item.quantity + 1);
    };

    return (
        <View className="flex-row items-center p-3 bg-white border-b border-gray-200">
            {/* Checkbox chọn sản phẩm */}
            <Checkbox
                status={item.selected ? "checked" : "unchecked"}
                onPress={() => onSelect(item.product_id)}
            />

            {/* Ảnh sản phẩm */}
            <TouchableOpacity
                onPress={() =>
                    router.push(`/product/${item.product_id}`)
                }
            >
                <Image
                    source={{ uri: item.thumbnail_url || DEFAULT_PRODUCT_IMAGE }}
                    className="w-16 h-16 mx-2 rounded-lg"
                />
            </TouchableOpacity>

            {/* Thông tin sản phẩm */}
            <View className="flex-1">
                <TouchableOpacity onPress={() => {
                    router.push(`/product/${item.product_id}`)
                }}>
                    <Text className="text-base font-medium" numberOfLines={2}>
                        {item.name}
                    </Text>
                </TouchableOpacity>
                <Text className="mt-1 font-semibold text-red-500">
                    {item.price.toLocaleString()}₫
                </Text>

                {/* Nút tăng giảm */}
                <View className="flex-row items-center mt-2">
                    <TouchableOpacity
                        onPress={handleDecrease}
                        className="px-2 py-1 border border-gray-300 rounded"
                    >
                        <Text className="text-lg">−</Text>
                    </TouchableOpacity>

                    <Text className="mx-3 text-base">{item.quantity}</Text>

                    <TouchableOpacity
                        onPress={handleIncrease}
                        className="px-2 py-1 border border-gray-300 rounded"
                    >
                        <Text className="text-lg">+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nút xóa */}
            <IconButton icon="delete" onPress={() => setShowDialog(true)} />

            {/* Dialog xác nhận xóa */}
            <Portal>
                <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                    <Dialog.Title>Xóa sản phẩm</Dialog.Title>
                    <Dialog.Content>
                        <Text>Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?</Text>
                    </Dialog.Content>
                    <Dialog.Actions className="gap-5">
                        <Button onPress={() => setShowDialog(false)}>Hủy</Button>
                        <Button
                            onPress={() => {
                                onRemove(item.product_id);
                                setShowDialog(false);
                            }}
                        >
                            Xóa
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default CartItem;