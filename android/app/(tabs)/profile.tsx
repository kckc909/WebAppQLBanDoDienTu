import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { users } from "@/constants/custom.d";
import Profile from "../Profile";

export default function tab_profile() {
    return <Profile></Profile>
}
