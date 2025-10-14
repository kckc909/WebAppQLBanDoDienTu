import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Image } from "react-native";
import FilterBar from "./FilterBar";


const SearchScreen = () => {

    const [query, setQuery] = useState("");

    return (
        <View className="flex-1 bg-white">

            <FilterBar
                title="Hãng"
                mode="list"
                options={[
                    { value: "apple", label: "Apple" },
                    { value: "samsung", label: "Samsung" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                    { value: "xiaomi", label: "Xiaomi" },
                ]}
                selectedValue={query}
                onSelect={(val) => setQuery(val)}
            />

        </View>
    );
};

export default SearchScreen;
