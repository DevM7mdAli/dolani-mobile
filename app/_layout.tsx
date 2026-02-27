import { Stack } from 'expo-router';
import { useEffect } from 'react';

import '@/global.css';
import '@/lib/i18n';
import { queryClient } from '@/lib/query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useBeaconPositioning } from '@/hooks/useBeaconPositioning';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

/** Inner component that can use hooks requiring QueryClientProvider. */
function AppInner() {
  // Start BLE positioning app-wide — keeps `useNavigationStore.currentLocationId` up to date
  useBeaconPositioning(true);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(emergency)" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({});

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AppInner />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
