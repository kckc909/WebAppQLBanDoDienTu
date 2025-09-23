import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import SocialButton from "@/components/ui/SocialButton";
import { IpAPI } from "@/constants/IpAPI";
import { apiLogin } from "@/api/api_Login";

export default function Login() {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (email.trim() === "" || password.trim() === "") {
            
            router.replace("/");

            return;
        }
        // TODO: gọi API login
        const response = await apiLogin(email, password);
        // kiểm tra tài khoản mật khẩu
        if (response) {
            console.log("Login successful:", response);
            router.replace("/");
        }
        else {
            console.log("Login failed");
        }

    };

    return (
        <View className="justify-center flex-1 px-6 bg-white">
            <Image
                className="w-[33vw] aspect-square self-center my-6"
                source={require("@/assets/images/minishop_logo.png")}
                resizeMode="contain"
            />
            <Text className="mb-2 text-2xl font-bold text-center">Đăng nhập</Text>

            {/* Email */}
            <TextInput
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="px-4 py-3 mb-4 border rounded-lg"
            />

            {/* Password */}
            <View className="relative">
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="px-4 py-3 pr-10 mb-2 border rounded-lg"
                />
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3"
                >
                    <Text className="text-gray-400">{showPassword ? "🙈" : "👁️"}</Text>
                </Pressable>
            </View>

            <TouchableOpacity className="mb-6">
                <Text className="text-right text-gray-500">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
                className="py-3 mb-6 bg-gray-800 rounded-lg"
                onPress={handleLogin}
            >
                <Text className="font-semibold text-center text-white">Sign In</Text>
            </TouchableOpacity>

            {/* Or sign in with */}
            <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-gray-300" />
                <Text className="mx-2 text-gray-400">Or sign in with</Text>
                <View className="flex-1 h-[1px] bg-gray-300" />
            </View>

            <View className="flex-row justify-center mb-6 space-x-6">
                <SocialButton provider="facebook" onPress={() => { }} />
                <SocialButton provider="google" onPress={() => { }} />
                <SocialButton provider="twitter" onPress={() => { }} />
            </View>

            {/* Sign Up link */}
            <Text className="text-center text-gray-500">
                Don’t have an account?{" "}
                <Text
                    className="text-blue-500"
                    onPress={() => router.push("/register")}
                >
                    Sign Up
                </Text>
            </Text>
        </View>
    );
}
