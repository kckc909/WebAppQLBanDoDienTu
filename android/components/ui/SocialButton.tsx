import React from "react";
import { Pressable, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

type Props = {
    provider: "facebook" | "google" | "twitter";
    onPress?: () => void;
};

const colors = {
    facebook: "#1877F2",
    google: "#DB4437",
    twitter: "#1DA1F2",
};

const labels = {
    facebook: "Continue with Facebook",
    google: "Continue with Google",
    twitter: "Continue with Twitter",
};

const SocialButton: React.FC<Props> = ({ provider, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center justify-center w-12 h-12 p-3 m-1.5 rounded-full"
            style={{ backgroundColor: colors[provider] }}

        >
            <FontAwesome name={provider} size={20} color="white" />
        </Pressable>
    );
};

export default SocialButton;
