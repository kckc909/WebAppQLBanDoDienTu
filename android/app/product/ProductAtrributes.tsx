import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ATTRIBUTE_DISPLAY_NAMES } from "@/constants/AttriName";

export default function ProductAttributes({ attributes }: { attributes: Record<string, any> }) {
    const [expanded, setExpanded] = useState(false);
    const entries = Object.entries(attributes);
    const previewCount = 5; // Hiện 5 dòng đầu tiên

    const visibleEntries = expanded ? entries : entries.slice(0, previewCount);

    if (entries.length === 0) return null;

    return (
        <View className="px-4 py-3 mt-2 bg-white rounded-xl">
            <Text className="mb-2 font-semibold">Thông số kỹ thuật</Text>

            {visibleEntries.map(([key, value]) => (
                <View key={key} className="flex-row justify-between py-1">
                    <Text className="flex-1 text-gray-600">
                        {ATTRIBUTE_DISPLAY_NAMES[key] || key}
                    </Text>
                    <Text className="flex-1 font-medium text-right">
                        {typeof value === "boolean" ? (value ? "Có" : "Không") : value}
                    </Text>
                </View>
            ))}

            {/* Nút xem thêm */}
            {entries.length > previewCount && (
                <TouchableOpacity
                    onPress={() => setExpanded(!expanded)}
                    className="mt-2"
                    activeOpacity={0.7}
                >
                    <Text className="font-semibold text-center text-blue-500">
                        {expanded ? "Thu gọn ▲" : "Xem thêm ▼"}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
