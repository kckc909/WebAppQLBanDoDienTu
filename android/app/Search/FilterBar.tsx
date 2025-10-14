import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = { value: string; label: string };

type FilterBarProps = {
    title: string;
    options: Option[];
    mode?: "list" | "dropdown";
    selectedValue?: string | null;
    onSelect?: (value: string) => void;
};

const FilterBar: React.FC<FilterBarProps> = ({
    title,
    options,
    mode = "list",
    selectedValue,
    onSelect,
}) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    // --- Hiển thị dạng list scroll ngang ---
    if (mode === "list") {
        return (
            <View className="mb-3">
                <Text className="mb-2 font-semibold">{title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {options.map((opt) => (
                        <TouchableOpacity
                            key={opt.value}
                            onPress={() => onSelect?.(opt.value)}
                            className={`px-4 py-2 mr-2 rounded-full border ${selectedValue === opt.value
                                ? "bg-blue-500 border-blue-500"
                                : "bg-white border-gray-300"
                                }`}
                        >
                            <Text
                                className={`${selectedValue === opt.value ? "text-white" : "text-gray-800"
                                    }`}
                            >
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    // --- Hiển thị dạng dropdown ---
    return (
        <View className="mb-3">
            <Text className="mb-2 font-semibold text-gray-800">{title}</Text>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                className="flex-row items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg"
            >
                <Text className="text-gray-700">
                    {selectedValue
                        ? options.find((o) => o.value === selectedValue)?.label
                        : `Chọn ${title.toLowerCase()}`}
                </Text>
                <Ionicons name="chevron-down" size={18} color="gray" />
            </TouchableOpacity>

            <Modal visible={visible} animationType="slide">
                <View className="flex-1 p-5 bg-white">
                    <View className="flex-row items-center mb-4">
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color="gray"
                            onPress={() => setVisible(false)}
                        />
                        <Text className="ml-3 text-lg font-semibold">Chọn {title}</Text>
                    </View>

                    <TextInput
                        placeholder={`Tìm ${title.toLowerCase()}...`}
                        value={search}
                        onChangeText={setSearch}
                        className="px-3 py-2 mb-4 text-gray-700 border border-gray-300 rounded-lg"
                    />

                    <ScrollView>
                        {filteredOptions.map((opt) => (
                            <TouchableOpacity
                                key={opt.value}
                                onPress={() => {
                                    onSelect?.(opt.value);
                                    setVisible(false);
                                }}
                                className={`p-3 mb-2 rounded-lg ${selectedValue === opt.value ? "bg-blue-100" : "bg-gray-50"
                                    }`}
                            >
                                <Text className="text-gray-800">{opt.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

export default FilterBar;
