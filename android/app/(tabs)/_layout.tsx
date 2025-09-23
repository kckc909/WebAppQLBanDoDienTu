import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {

	return (
		<>
			<Tabs
				screenOptions={{
					tabBarActiveTintColor: "#ff2600ff",
					headerShown: false,
					tabBarButton: HapticTab,
					tabBarBackground: undefined,
					tabBarStyle: {
						padding: 5,
						height: 60,
					}
				}}>
				<Tabs.Screen
					name="index"
					options={{
						title: 'Home',
						tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
					}}
				/>
				<Tabs.Screen
					name="categories"
					options={{
						title: 'Categories',
						tabBarIcon: ({ color }) => <MaterialIcons name="category" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="orders"
					options={{
						title: 'Orders',
						tabBarIcon: ({ color }) => <MaterialIcons name="receipt" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="cart"
					options={{
						title: 'Cart',
						tabBarIcon: ({ color }) => <MaterialIcons name="shopping-cart" size={28} color={color} />,
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: 'Profile',
						tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />,
					}}
				/>
			</Tabs>
		</>
	);
}
