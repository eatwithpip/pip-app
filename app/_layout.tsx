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
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { asyncStoragePersister, queryClient } from '@/lib/queryClient';

export { ErrorBoundary } from 'expo-router';

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
    Ionicons: require('@react-native-vector-icons/ionicons/fonts/Ionicons.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
    >
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </PersistQueryClientProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const { session, loading: authLoading } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();

  // Wait for auth to resolve; if authenticated, also wait for profile check
  const isLoading = authLoading || (!!session && profileLoading);

  useEffect(() => {
    if (isLoading) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    if (!session) {
      if (!inAuth) router.replace('/(auth)/sign-in');
    } else if (!profile) {
      if (!inOnboarding) router.replace('/onboarding/step1');
    } else {
      if (inAuth || inOnboarding) router.replace('/(tabs)/today');
    }
  }, [session, profile, isLoading, segments]);

  if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
