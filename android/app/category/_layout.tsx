import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";

export default function CategoryPayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Danh mục',
                    headerShown: true,
                }}
            />
        </Stack>
    )
}