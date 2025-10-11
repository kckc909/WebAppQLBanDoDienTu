import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { router } from "expo-router";

export default function ProductLayout() {
    return (
        <Stack
            screenOptions={{
                title: "Sản phẩm",
                headerShown: true,
                headerTitleAlign: "center",
            }}
        >

        </Stack>
    );
}
