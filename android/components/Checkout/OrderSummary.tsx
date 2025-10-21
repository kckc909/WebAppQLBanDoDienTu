// components/checkout/OrderSummary.jsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const OrderSummary = ({
    subtotal,
    shippingFee,
    discount = 0,
    voucherCode = null,
    itemCount = 0,
    showDetails = false
}: any) => {
    const total = subtotal + shippingFee - discount;
    const [expanded, setExpanded] = React.useState(showDetails);

    return (
        <View className="mb-2 bg-white rounded-lg">
            {/* Header - Collapsible */}
            <TouchableOpacity
                onPress={() => setExpanded(!expanded)}
                className="flex-row items-center justify-between p-4 border-b border-gray-100"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    <Ionicons name="receipt-outline" size={22} color="#3B82F6" />
                    <Text className="ml-2 text-lg font-semibold text-gray-800">
                        Thông tin thanh toán
                    </Text>
                </View>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6B7280"
                />
            </TouchableOpacity>

            {/* Body - Details */}
            {expanded && (
                <View className="px-4 pt-3 pb-2">
                    {/* Item count */}
                    {itemCount > 0 && (
                        <View className="flex-row items-center justify-between px-3 py-2 mb-2 rounded-lg bg-blue-50">
                            <View className="flex-row items-center">
                                <Ionicons name="cart-outline" size={18} color="#3B82F6" />
                                <Text className="ml-2 text-gray-700">Số lượng sản phẩm</Text>
                            </View>
                            <Text className="font-semibold text-gray-800">{itemCount}</Text>
                        </View>
                    )}

                    {/* Subtotal */}
                    <View className="flex-row items-center justify-between py-3">
                        <Text className="text-base text-gray-600">Tạm tính</Text>
                        <Text className="text-base font-semibold text-gray-800">
                            {subtotal.toLocaleString('vi-VN')}₫
                        </Text>
                    </View>

                    {/* Shipping Fee */}
                    <View className="flex-row items-center justify-between py-3 border-t border-gray-100">
                        <View className="flex-row items-center">
                            <Ionicons name="bicycle-outline" size={18} color="#6B7280" />
                            <Text className="ml-2 text-gray-600">Phí vận chuyển</Text>
                        </View>
                        <Text className="font-semibold text-gray-800">
                            {shippingFee === 0 ? (
                                <Text className="font-semibold text-green-600">Miễn phí</Text>
                            ) : (
                                `${shippingFee.toLocaleString('vi-VN')}₫`
                            )}
                        </Text>
                    </View>

                    {/* Discount */}
                    {discount > 0 && (
                        <View className="py-3 border-t border-gray-100">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center flex-1">
                                    <Ionicons name="pricetag" size={18} color="#10B981" />
                                    <View className="flex-1 ml-2">
                                        <Text className="text-gray-600">Giảm giá</Text>
                                        {voucherCode && (
                                            <Text className="text-xs text-gray-400 mt-0.5">
                                                Mã: {voucherCode}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <Text className="text-base font-bold text-green-600">
                                    -{discount.toLocaleString('vi-VN')}₫
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Savings Summary */}
                    {discount > 0 && (
                        <View className="p-3 mt-2 mb-3 rounded-lg bg-green-50">
                            <View className="flex-row items-center">
                                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                <Text className="ml-2 text-sm font-medium text-green-700">
                                    Bạn đã tiết kiệm được {discount.toLocaleString('vi-VN')}₫
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            )}

            {/* Total - Always Visible */}
            <View className="px-4 py-4 border-t-2 border-red-100 bg-gradient-to-r from-red-50 to-orange-50">
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="mb-1 text-sm text-gray-600">Tổng thanh toán</Text>
                        {discount > 0 && (
                            <Text className="text-xs text-gray-400 line-through">
                                {(subtotal + shippingFee).toLocaleString('vi-VN')}₫
                            </Text>
                        )}
                    </View>
                    <View className="items-end">
                        <Text className="text-2xl font-bold text-red-600">
                            {total.toLocaleString('vi-VN')}₫
                        </Text>
                        {discount > 0 && (
                            <View className="bg-red-100 px-2 py-0.5 rounded mt-1">
                                <Text className="text-xs font-semibold text-red-600">
                                    Tiết kiệm {Math.round((discount / (subtotal + shippingFee)) * 100)}%
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* Payment Info Note */}
            {expanded && (
                <View className="px-4 py-3 border-t border-blue-100 bg-blue-50">
                    <View className="flex-row items-start">
                        <Ionicons name="information-circle-outline" size={16} color="#3B82F6" />
                        <Text className="flex-1 ml-2 text-xs leading-5 text-blue-700">
                            Giá đã bao gồm VAT. Phí vận chuyển có thể thay đổi tùy theo khu vực.
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

// Variant 2: Compact version for bottom bar
export const OrderSummaryCompact = ({ total, discount = 0, itemCount = 0 }: any) => {
    return (
        <View className="flex-row items-center justify-between">
            <View>
                <Text className="text-sm text-gray-600">
                    Tổng thanh toán {itemCount > 0 && `(${itemCount} sản phẩm)`}
                </Text>
                {discount > 0 && (
                    <View className="flex-row items-center mt-1">
                        <Text className="mr-2 text-xs text-gray-400 line-through">
                            {(total + discount).toLocaleString('vi-VN')}₫
                        </Text>
                        <View className="bg-green-100 px-2 py-0.5 rounded">
                            <Text className="text-xs font-semibold text-green-600">
                                -{discount.toLocaleString('vi-VN')}₫
                            </Text>
                        </View>
                    </View>
                )}
            </View>
            <Text className="text-2xl font-bold text-red-600">
                {total.toLocaleString('vi-VN')}₫
            </Text>
        </View>
    );
};