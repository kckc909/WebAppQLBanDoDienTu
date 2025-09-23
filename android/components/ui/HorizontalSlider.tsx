import React, { useRef, useState, useEffect } from "react";
import { View, Text, FlatList, Image, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

type Slide = {
    id: string;
    title: string;
    image: string;
};

type Props = {
    data: Slide[];
    autoScroll?: boolean;
    interval?: number;
};

const HorizontalSlider: React.FC<Props> = ({ data, autoScroll = true, interval = 3000 }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto scroll
    useEffect(() => {
        if (!autoScroll) return;

        const timer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, data.length, autoScroll, interval]);

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View className="items-center justify-center w-screen">
                        <Image
                            source={{ uri: item.image }}
                            className="w-11/12 h-52 rounded-2xl"
                            resizeMode="cover"
                        />
                        <Text className="absolute text-lg font-semibold text-white bottom-5">
                            {item.title}
                        </Text>
                    </View>
                )}
            />

            {/* Indicator */}
            <View className="flex-row justify-center mt-2">
                {data.map((_, i) => (
                    <View
                        key={i}
                        className={`w-2 h-2 rounded-full mx-1 ${i === currentIndex ? "bg-black" : "bg-gray-400"
                            }`}
                    />
                ))}
            </View>
        </View>
    );
};

export default HorizontalSlider;
