import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const PaymentMethod = ({ selected, onSelect }: any) => {
    const methods = [
        { id: 'COD', label: 'Thanh toán khi nhận hàng', icon: 'cash-outline' },
        { id: 'CreditCard', label: 'Thẻ tín dụng/Ghi nợ', icon: 'card-outline' },
        { id: 'BankTransfer', label: 'Chuyển khoản ngân hàng', icon: 'business-outline' },
        { id: 'E-Wallet', label: 'Ví điện tử', icon: 'wallet-outline' }
    ];

    return (
        <View className="p-4 mb-2 bg-white">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Phương thức thanh toán</Text>
            {methods.map((method: any) => (
                <TouchableOpacity
                    key={method.id}
                    onPress={() => onSelect(method.id)}
                    className={`flex-row items-center p-4 mb-2 rounded-lg border ${selected === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                >
                    <Ionicons
                        name={method.icon}
                        size={24}
                        color={selected === method.id ? '#3B82F6' : '#6B7280'}
                    />
                    <Text
                        className={`flex-1 ml-3 text-base ${selected === method.id ? 'text-blue-600 font-medium' : 'text-gray-800'
                            }`}
                    >
                        {method.label}
                    </Text>
                    {selected === method.id && (
                        <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
};