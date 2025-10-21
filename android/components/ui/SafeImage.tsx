// src/components/SafeImage.tsx
import React, { useState, useEffect } from "react";
import { Image, View } from "react-native";
import { styled } from "nativewind";
import { BASE_URL, DEFAULT_PRODUCT_IMAGE } from "@/constants/default";

const StyledImage = styled(Image);

interface SafeImageProps {
    source?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
    defaultImage?: any;
    resizeMode?: "cover" | "contain" | "stretch" | "center";
    style?: any
}

export const SafeImage: React.FC<SafeImageProps> = ({
    source,
    alt = "Ảnh sản phẩm",
    width = 100,
    height = 100,
    className = "",
    defaultImage = DEFAULT_PRODUCT_IMAGE,
    resizeMode = "cover",
    style
}) => {
    const [imgSource, setImgSource] = useState<any>(defaultImage);

    useEffect(() => {
        if (!source) {
            setImgSource(defaultImage);
            return;
        }

        const trimmed = source.trim();

        // ✅ Blob URI (ảnh preview upload)
        if (trimmed.startsWith("blob:")) {
            setImgSource({ uri: trimmed });
        }
        // ✅ Đường dẫn tuyệt đối (http, https)
        else if (trimmed.startsWith("http")) {
            setImgSource({ uri: trimmed });
        }
        // ✅ Đường dẫn tương đối trong thư mục public hoặc uploads
        else if (trimmed.startsWith("/")) {
            setImgSource({ uri: `${BASE_URL}${trimmed}` });
        }
        // ✅ Tên file uploads (ví dụ: "uploads/abc.jpg")
        else {
            setImgSource({ uri: `${BASE_URL}/${trimmed.replace(/^\//, "")}` });
        }
    }, [source]);

    return (
        <View
            className={`overflow-hidden border border-gray-300 rounded-xl bg-gray-50 ${className}`}
            style={{ width, height }}
        >
            <StyledImage
                source={imgSource}
                accessibilityLabel={alt}
                className="w-full h-full"
                resizeMode={resizeMode}
                onError={() => setImgSource(defaultImage)}
                style={style}
            />
        </View>
    );
};
