import { useTranslation } from '@/hooks/useTranslation';
import { Tabs } from 'expo-router';
import { SquareCheck as CheckSquare, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { t, changeLanguage, locale } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#007AFF',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('title.tasks'),
          tabBarIcon: ({ color, size }) => (
            <CheckSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('title.settings'),
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}