import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useEffect } from 'react';
import { useLanguageStore } from '@/stores/languageStore';
import * as NavigationBar from 'expo-navigation-bar';


export default function RootLayout() {
  useFrameworkReady();
  const loadLocale = useLanguageStore((state) => state.loadLocale);

  useEffect(() => {
    loadLocale();
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBehaviorAsync('overlay-swipe');
  }, []);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="+not-found" /> */}
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
