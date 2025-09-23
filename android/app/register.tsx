import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function Register() {
    const router = useRouter();
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recheckpassword, setrecheckPassword] = useState("");

    const handleRegister = () => {
        // TODO: gọi API register
        console.log("Register:", fullname, email, password);
        router.replace("/(tabs)/profile"); // sau khi đăng ký thì quay về Profile
    };

    return (
        <View className="justify-center flex-1 px-6 bg-white">
            <View>
                <Image
                    className="w-[33vw] aspect-square self-center my-6"
                    source={require("@/assets/images/minishop_logo.png")}
                    resizeMode="contain"
                />
                <Text className="mb-2 text-2xl font-bold text-center">Sign Up</Text>
            </View>

            {/* Full Name */}
            <TextInput
                placeholder="Full Name"
                value={fullname}
                onChangeText={setFullname}
                className="px-4 py-3 mb-4 border rounded-lg"
            />

            {/* Email */}
            <TextInput
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                className="px-4 py-3 mb-4 border rounded-lg"
            />

            {/* Password */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="px-4 py-3 mb-6 border rounded-lg"
            />

            {/* ReCheck Password */}
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setrecheckPassword}
                secureTextEntry
                className="px-4 py-3 mb-6 border rounded-lg"
            />

            {/* Sign Up Button */}
            <TouchableOpacity
                className="py-3 mb-6 bg-gray-800 rounded-lg"
                onPress={handleRegister}
            >
                <Text className="font-semibold text-center text-white">Sign Up</Text>
            </TouchableOpacity>

            {/* Sign In link */}
            <Text className="text-center text-gray-500">
                Already have an account?{" "}
                <Text
                    className="text-blue-500"
                    onPress={() => router.push("/login")}
                >
                    Sign In
                </Text>
            </Text>
        </View>
    );
}
