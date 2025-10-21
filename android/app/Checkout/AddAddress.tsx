import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { IpAPI } from '@/constants/IpAPI';

export default function AddAddressScreen() {
    const [formData, setFormData] = useState({
        receiver_name: '',
        phone: '',
        province: '',
        ward: '',
        address_text: '',
        is_default: false
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Validation
        if (!formData.receiver_name || !formData.phone || !formData.province || !formData.address_text) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Validate phone
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(formData.phone)) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${IpAPI}/api/checkout/add-address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    is_default: formData.is_default ? 1 : 0,
                }),
            });

            if (!response.ok) {
                throw new Error("Lỗi khi thêm địa chỉ");
            }

            const data = await response.json();
            console.log("Thêm địa chỉ thành công:", data);

            if (data.data.success) {
                Alert.alert('Thành công', 'Đã thêm địa chỉ mới', [
                    {
                        text: 'OK',
                        onPress: () => router.back()
                    }
                ]);
            }
        } catch (error) {
            console.error('Add address error:', error);
            Alert.alert('Lỗi', 'Không thể thêm địa chỉ. Vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-gray-50"
        >
            <ScrollView className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-800">Thêm địa chỉ mới</Text>
                </View>

                <View className="p-4">
                    {/* Thông tin người nhận */}
                    <View className="p-4 mb-3 bg-white rounded-lg">
                        <Text className="mb-4 text-base font-semibold text-gray-800">
                            Thông tin người nhận
                        </Text>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm text-gray-700">
                                Họ và tên <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.receiver_name}
                                onChangeText={(text) => setFormData({ ...formData, receiver_name: text })}
                                placeholder="Nhập họ và tên"
                                placeholderTextColor="#9CA3AF"
                                className="p-3 text-gray-800 border border-gray-300 rounded-lg"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm text-gray-700">
                                Số điện thoại <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                placeholder="Nhập số điện thoại"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="phone-pad"
                                className="p-3 text-gray-800 border border-gray-300 rounded-lg"
                            />
                        </View>
                    </View>

                    {/* Địa chỉ */}
                    <View className="p-4 mb-3 bg-white rounded-lg">
                        <Text className="mb-4 text-base font-semibold text-gray-800">Địa chỉ</Text>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm text-gray-700">
                                Tỉnh/Thành phố <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.province}
                                onChangeText={(text) => setFormData({ ...formData, province: text })}
                                placeholder="Nhập tỉnh/thành phố"
                                placeholderTextColor="#9CA3AF"
                                className="p-3 text-gray-800 border border-gray-300 rounded-lg"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm text-gray-700">Phường/Xã</Text>
                            <TextInput
                                value={formData.ward}
                                onChangeText={(text) => setFormData({ ...formData, ward: text })}
                                placeholder="Nhập phường/xã (nếu có)"
                                placeholderTextColor="#9CA3AF"
                                className="p-3 text-gray-800 border border-gray-300 rounded-lg"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-sm text-gray-700">
                                Địa chỉ cụ thể <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                value={formData.address_text}
                                onChangeText={(text) => setFormData({ ...formData, address_text: text })}
                                placeholder="Số nhà, tên đường..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                className="p-3 text-gray-800 border border-gray-300 rounded-lg"
                            />
                        </View>
                    </View>

                    {/* Đặt làm mặc định */}
                    <TouchableOpacity
                        onPress={() => setFormData({ ...formData, is_default: !formData.is_default })}
                        className="flex-row items-center justify-between p-4 bg-white rounded-lg"
                    >
                        <View className="flex-row items-center">
                            <Ionicons name="star-outline" size={20} color="#6B7280" />
                            <Text className="ml-2 text-gray-800">Đặt làm địa chỉ mặc định</Text>
                        </View>
                        <View
                            className={`w-6 h-6 rounded border-2 items-center justify-center ${formData.is_default ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                }`}
                        >
                            {formData.is_default && <Ionicons name="checkmark" size={18} color="white" />}
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View className="px-4 py-3 bg-white border-t border-gray-200">
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    className={`rounded-lg py-4 items-center ${loading ? 'bg-gray-300' : 'bg-blue-600'
                        }`}
                >
                    <Text className="text-base font-semibold text-white">
                        {loading ? 'Đang xử lý...' : 'Lưu địa chỉ'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

