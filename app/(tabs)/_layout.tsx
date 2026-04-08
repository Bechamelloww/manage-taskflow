import { Tabs } from 'expo-router';
import { SquareCheck as CheckSquare, Settings } from 'lucide-react-native';
import { theme } from '@/lib/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.surface,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 22,
          fontWeight: '800',
          color: theme.text,
          letterSpacing: -0.4,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <CheckSquare size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
