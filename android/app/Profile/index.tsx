import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { users } from "@/constants/custom.d";

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<users | null>(null);
    // user = null => chưa login
    // user = {name: "Esther Howard", avatar: "..."} => đã login

    const handlePress = (screen: string) => {
        if (!user) {
            router.push("../auth/login"); 
        } else {
            router.push(`/${screen}` as any);
        }
    };

    const btnGoToLogin = () => (
        <TouchableOpacity>
            <Text onPress={() => router.push("../auth/login")} className="p-4 text-blue-500 border rounded-lg ">Đăng nhập</Text>
        </TouchableOpacity>
    )

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Avatar + Tên */}
            <View className="items-center mt-8 mb-6">
                <Image
                    source={user?.avatar_url ? { uri: user.avatar_url } : require("@/assets/images/avatar.png")}
                    className="w-20 h-20 rounded-full"
                />
                <Text className="mt-3 text-lg font-semibold">
                    {user ? user.fullname : btnGoToLogin()}
                </Text>
            </View>

            {/* Danh sách menu */}
            <View>
                {[
                    { label: "Your profile", screen: "profile-detail" },
                    { label: "Manage Address", screen: "address" },
                    { label: "Payment Methods", screen: "payment" },
                    { label: "My Orders", screen: "orders" },
                    { label: "My Coupons", screen: "coupons" },
                    { label: "My Wallet", screen: "wallet" },
                    { label: "Settings", screen: "settings" },
                    { label: "Help Center", screen: "help" },
                ].map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100"
                        onPress={() => handlePress(item.screen)}
                    >
                        <Text className="text-base text-gray-700">{item.label}</Text>
                        <Text className="text-xl text-gray-400">{">"}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}
