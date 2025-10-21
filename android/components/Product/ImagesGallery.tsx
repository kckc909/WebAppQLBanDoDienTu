import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, TouchableOpacity, Modal, Dimensions } from "react-native";
import { SafeImage } from "../ui/SafeImage";

type Props = {
    images: string[];
    defaultImage?: string;
};

const ImageGallery: React.FC<Props> = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [fullscreen, setFullscreen] = useState(false);

    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;

    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0]);
        }
    }, [images])

    return (
        <View>
            {/* Ảnh lớn */}
            <TouchableOpacity onPress={() => setFullscreen(true)} activeOpacity={0.9}>
                <SafeImage
                    source={mainImage}
                    width={screenWidth - 5}
                    height={screenWidth - 5}
                    style={{ width: "100%", resizeMode: "contain" }}
                />
            </TouchableOpacity>

            {/* Dải ảnh nhỏ */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-2 mt-2">
                {images.map((img, idx) => (
                    <TouchableOpacity key={idx} onPress={() => setMainImage(img)}>
                        <SafeImage
                            source={img}
                            width={80}
                            height={80}
                            style={{
                                marginRight: 8,
                                borderRadius: 5,
                                borderWidth: mainImage === img ? 2 : 1,
                                borderColor: mainImage === img ? "orange" : "#ccc",
                            }}
                        />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Fullscreen Modal */}
            <Modal visible={fullscreen} transparent={true}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.9)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    onPress={() => setFullscreen(false)}
                    activeOpacity={1}
                >
                    <SafeImage
                        source={mainImage}
                        width={screenWidth}
                        height={screenHeight}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default ImageGallery;
