// components/checkout/VoucherSelector.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const VoucherSelector = ({ vouchers, selected, onSelect }: any) => {
    const [modalVisible, setModalVisible] = useState(false);

    const selectedVoucher = vouchers.find((v: any) => v.ownership_id === selected);

    return (
        <View className="p-4 mb-2 bg-white">
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="flex-row items-center justify-between"
            >
                <View className="flex-row items-center flex-1">
                    <Ionicons name="pricetag-outline" size={24} color="#EF4444" />
                    <View className="flex-1 ml-3">
                        <Text className="text-base font-semibold text-gray-800">Mã giảm giá</Text>
                        {selectedVoucher ? (
                            <Text className="mt-1 text-sm text-blue-600">
                                {selectedVoucher.code} - Giảm {selectedVoucher.discount_value}
                                {selectedVoucher.discount_type === 'percent' ? '%' : '₫'}
                            </Text>
                        ) : (
                            <Text className="mt-1 text-sm text-gray-500">
                                {vouchers.length > 0 ? 'Chọn mã giảm giá' : 'Chưa có voucher khả dụng'}
                            </Text>
                        )}
                    </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Modal chọn voucher */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="justify-end flex-1 bg-black/50">
                    <View className="bg-white rounded-t-3xl max-h-[70%]">
                        {/* Header */}
                        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                            <Text className="text-lg font-semibold text-gray-800">Chọn mã giảm giá</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="p-4">
                            {vouchers.length === 0 ? (
                                // Trạng thái không có voucher
                                <View className="items-center py-12">
                                    <Ionicons name="pricetag-outline" size={64} color="#D1D5DB" />
                                    <Text className="mt-4 text-base text-gray-500">Bạn chưa có voucher nào</Text>
                                    <Text className="px-8 mt-2 text-sm text-center text-gray-400">
                                        Voucher sẽ xuất hiện tại đây khi bạn nhận được từ các chương trình khuyến mãi
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    {/* Option không sử dụng voucher */}
                                    <TouchableOpacity
                                        onPress={() => {
                                            onSelect(null);
                                            setModalVisible(false);
                                        }}
                                        className={`p-4 mb-3 rounded-lg border-2 ${selected === null
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 bg-white'
                                            }`}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name="close-circle-outline"
                                                    size={24}
                                                    color={selected === null ? '#3B82F6' : '#6B7280'}
                                                />
                                                <Text className={`ml-3 text-base ${selected === null ? 'text-blue-600 font-semibold' : 'text-gray-600'
                                                    }`}>
                                                    Không sử dụng mã giảm giá
                                                </Text>
                                            </View>
                                            {selected === null && (
                                                <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                                            )}
                                        </View>
                                    </TouchableOpacity>

                                    {/* Danh sách voucher */}
                                    {vouchers.map((voucher: any) => (
                                        <TouchableOpacity
                                            key={voucher.ownership_id}
                                            onPress={() => {
                                                onSelect(voucher.ownership_id);
                                                setModalVisible(false);
                                            }}
                                            className={`mb-3 rounded-lg border-2 overflow-hidden ${selected === voucher.ownership_id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 bg-white'
                                                }`}
                                        >
                                            {/* Voucher Header */}
                                            <View className="p-3 bg-gradient-to-r from-red-500 to-pink-500">
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-row items-center">
                                                        <View className="px-3 py-1 bg-white rounded-md">
                                                            <Text className="text-sm font-bold text-red-600">
                                                                {voucher.code}
                                                            </Text>
                                                        </View>
                                                        {voucher.is_used === 1 && (
                                                            <View className="px-2 py-1 ml-2 rounded bg-white/80">
                                                                <Text className="text-xs font-medium text-gray-700">Đã dùng</Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                    <Ionicons name="pricetag" size={24} color="white" />
                                                </View>
                                            </View>

                                            {/* Voucher Body */}
                                            <View className="p-4">
                                                {/* Giá trị giảm */}
                                                <View className="flex-row items-center mb-2">
                                                    <Text className="text-2xl font-bold text-red-600">
                                                        {voucher.discount_type === 'percent'
                                                            ? `${voucher.discount_value}%`
                                                            : `${voucher.discount_value.toLocaleString('vi-VN')}₫`
                                                        }
                                                    </Text>
                                                    {voucher.max_discount_amount && voucher.discount_type === 'percent' && (
                                                        <Text className="ml-2 text-sm text-gray-600">
                                                            Giảm tối đa {voucher.max_discount_amount.toLocaleString('vi-VN')}₫
                                                        </Text>
                                                    )}
                                                </View>

                                                {/* Mô tả */}
                                                <Text className="mb-3 text-sm text-gray-700" numberOfLines={2}>
                                                    {voucher.description}
                                                </Text>

                                                {/* Điều kiện */}
                                                <View className="p-3 rounded-lg bg-gray-50">
                                                    <View className="flex-row items-center mb-1">
                                                        <Ionicons name="information-circle-outline" size={16} color="#6B7280" />
                                                        <Text className="ml-1 text-xs font-medium text-gray-600">
                                                            Điều kiện áp dụng:
                                                        </Text>
                                                    </View>
                                                    <Text className="ml-5 text-xs text-gray-500">
                                                        • Đơn hàng tối thiểu: {voucher.min_order_amount.toLocaleString('vi-VN')}₫
                                                    </Text>
                                                    <Text className="ml-5 text-xs text-gray-500">
                                                        • HSD: {new Date(voucher.end_date).toLocaleDateString('vi-VN')}
                                                    </Text>
                                                </View>

                                                {/* Checkmark nếu được chọn */}
                                                {selected === voucher.ownership_id && (
                                                    <View className="absolute top-2 right-2">
                                                        <View className="p-1 bg-blue-500 rounded-full">
                                                            <Ionicons name="checkmark" size={16} color="white" />
                                                        </View>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Voucher đã hết hạn hoặc không đủ điều kiện */}
                                            {new Date(voucher.end_date) < new Date() && (
                                                <View className="absolute inset-0 items-center justify-center bg-black/30">
                                                    <View className="px-4 py-2 bg-red-500 rounded-lg">
                                                        <Text className="font-bold text-white">Đã hết hạn</Text>
                                                    </View>
                                                </View>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};