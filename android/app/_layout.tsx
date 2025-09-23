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
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
			<SafeAreaView className='flex-1'>
				<Stack screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				</Stack>
			</SafeAreaView>
		</ThemeProvider>
	);
}
