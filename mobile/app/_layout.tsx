import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SafeScreen } from '@/components';
import { useAuthStore } from '@/store/auth-store';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { checkAuth, user, token } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const inAuthScreen = segments[0] === '(auth)';
    const isSignedIn = user && token;

    if (!isSignedIn && !inAuthScreen) {
      router.replace('/(auth)');
    } else if (isSignedIn && inAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [user, token, segments, router]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
