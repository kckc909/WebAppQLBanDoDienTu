import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import "../global.css";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
	anchor: '(tabs)',
};

export default function RootLayout() {
	const colorScheme = useColorScheme();

	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack screenOptions={{
				headerShown: true,
				animation: 'fade_from_bottom'
			}}>
				<Stack.Screen
					name="(tabs)"
					options={{
						headerShown: false
					}} />
				<Stack.Screen
					name="auth"
					options={{
						headerShown: false
					}} />
				<Stack.Screen
					name="product"
					options={{
						headerShown: false
					}} />
				<Stack.Screen
					name="category"
					options={{
						headerShown: false
					}} />

			</Stack>
		</ThemeProvider>
	);
}
