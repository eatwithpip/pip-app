import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Afacad_400Regular,
  Afacad_400Regular_Italic,
  Afacad_500Medium,
  Afacad_500Medium_Italic,
  Afacad_600SemiBold,
  Afacad_600SemiBold_Italic,
  Afacad_700Bold,
  Afacad_700Bold_Italic,
} from '@expo-google-fonts/afacad';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Afacad_400Regular,
    Afacad_400Regular_Italic,
    Afacad_500Medium,
    Afacad_500Medium_Italic,
    Afacad_600SemiBold,
    Afacad_600SemiBold_Italic,
    Afacad_700Bold,
    Afacad_700Bold_Italic,
  });
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      AsyncStorage.getItem('hasOnboarded').then((value) => {
        setIsFirstLaunch(value === null);
      });
    }
  }, [loaded]);

  if (!loaded || isFirstLaunch === null) {
    return null;
  }

  return <RootLayoutNav isFirstLaunch={isFirstLaunch} />;
}

function RootLayoutNav({ isFirstLaunch }: { isFirstLaunch: boolean }) {
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    if (isFirstLaunch) {
      router.replace('/onboarding/step1');
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
