
// components/checkout/AddressSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const AddressSelector = ({ addresses, selectedAddress, onSelectAddress, onAddNew }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

    const defaultAddress = addresses.find((addr: any) => addr.is_default) || addresses[0];
    const displayAddress = selectedAddress || defaultAddress;

    return (
        <View className="p-4 mb-2 bg-white">
            <View className="flex-row items-center justify-between mb-3">
                <Text className="text-lg font-semibold text-gray-800">Địa chỉ nhận hàng</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text className="font-medium text-blue-600">Thay đổi</Text>
                </TouchableOpacity>
            </View>

            {displayAddress ? (
                <View>
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="location-outline" size={20} color="#6B7280" />
                        <Text className="ml-2 text-base font-semibold text-gray-800">
                            {displayAddress.receiver_name}
                        </Text>
                        <Text className="ml-2 text-gray-600">| {displayAddress.phone}</Text>
                    </View>
                    <Text className="text-gray-600 ml-7">
                        {displayAddress.address_text}, {displayAddress.ward}, {displayAddress.province}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={onAddNew}
                    className="items-center p-4 border-2 border-gray-300 border-dashed rounded-lg"
                >
                    <Ionicons name="add-circle-outline" size={32} color="#3B82F6" />
                    <Text className="mt-2 font-medium text-blue-600">Thêm địa chỉ mới</Text>
                </TouchableOpacity>
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="justify-end flex-1 bg-black/50">
                    <View className="bg-white rounded-t-3xl max-h-[80%]">
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <Text className="text-lg font-semibold">Chọn địa chỉ</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-4">
                            {addresses.map((address: any) => (
                                <TouchableOpacity
                                    key={address.address_id}
                                    onPress={() => {
                                        onSelectAddress(address);
                                        setModalVisible(false);
                                    }}
                                    className={`p-4 mb-3 rounded-lg border ${displayAddress?.address_id === address.address_id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200'
                                        }`}
                                >
                                    <View className="flex-row items-start justify-between">
                                        <View className="flex-1">
                                            <Text className="font-semibold text-gray-800">
                                                {address.receiver_name} | {address.phone}
                                            </Text>
                                            <Text className="mt-1 text-gray-600">
                                                {address.address_text}, {address.ward}, {address.province}
                                            </Text>
                                        </View>
                                        {address.is_default === 1 && (
                                            <View className="px-2 py-1 bg-red-100 rounded">
                                                <Text className="text-xs font-medium text-red-600">Mặc định</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}

                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    onAddNew();
                                }}
                                className="items-center p-4 border-2 border-blue-400 border-dashed rounded-lg"
                            >
                                <Ionicons name="add-circle-outline" size={28} color="#3B82F6" />
                                <Text className="mt-1 font-medium text-blue-600">Thêm địa chỉ mới</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};