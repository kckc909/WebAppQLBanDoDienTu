import { router, Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {

	const headerLeft_BackArrow = (
		<Ionicons name="arrow-back" size={24} onPress={() => {
			router.back();
		}} style={{ marginLeft: 10 }} />
	)

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#ff2600ff",
				// headerShown: false,
				tabBarButton: HapticTab,
				tabBarStyle: {
					borderTopWidth: 0,
					padding: 5,
					height: 60,
				},
			}}>

			{/* Home */}
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					title: 'Home',
					tabBarIcon: ({ color }) => (
						<MaterialIcons size={28} name="home" color={color} />
					),
				}}
			/>

			{/* Categories */}
			<Tabs.Screen
				name="categories"
				options={{
					title: 'Danh mục',
					headerLeft: () => headerLeft_BackArrow,
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="category" size={28} color={color} />
					),
				}}
			/>

			{/* Cart - nổi bật */}
			<Tabs.Screen
				name="cart"
				options={{
					title: 'Giỏ hàng',
					tabBarIcon: ({ color, focused }) => (
						<View
							style={{
								width: 60,
								height: 60,
								borderRadius: 30,
								backgroundColor: focused ? "#ff2600" : "#1c2b38",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: 20,
							}}
						>
							<MaterialIcons
								name="shopping-cart"
								size={30}
								color={'white'}
							/>
						</View>
					),
					tabBarLabel: () => null,
					headerLeft: () => headerLeft_BackArrow,
					headerRight: () => (<>
						
					</>)
				}}
			/>

			{/* Orders */}
			<Tabs.Screen
				name="orders"
				options={{
					title: 'Orders',
					headerLeft: () => headerLeft_BackArrow,
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="receipt" size={28} color={color} />
					),
				}}
			/>

			{/* Profile */}
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerLeft: () => headerLeft_BackArrow,
					tabBarIcon: ({ color }) => (
						<MaterialIcons name="person" size={28} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
