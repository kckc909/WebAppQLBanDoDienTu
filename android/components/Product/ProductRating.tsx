import React from "react";
import { View } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Hoặc 'react-native-vector-icons/FontAwesome'

type Props = {
    rating: number; // ví dụ 3.5
    size?: number;  // kích thước icon
};

const StarRating: React.FC<Props> = ({ rating, size = 20 }) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            // Sao đầy
            stars.push(<FontAwesome key={i} name="star" size={size} color="gold" />);
        } else if (rating >= i - 0.5) {
            // Nửa sao
            stars.push(<FontAwesome key={i} name="star-half-full" size={size} color="gold" />);
        } else {
            // Sao rỗng
            stars.push(<FontAwesome key={i} name="star-o" size={size} color="gold" />);
        }
    }

    return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default StarRating;
