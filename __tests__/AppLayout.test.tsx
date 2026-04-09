import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotFoundScreen from '@/app/+not-found';
import AppIndex from '@/app/index';
import TabLayout from '@/app/(tabs)/_layout';
import RootLayout from '@/app/_layout';

jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  return {
    Stack: Object.assign(
      ({ children }: any) => <View>{children}</View>,
      { Screen: ({ options }: any) => <View><Text>{options?.title}</Text></View> }
    ),
    Tabs: Object.assign(
      ({ children }: any) => <View>{children}</View>,
      {
        Screen: ({ options }: any) => {
          const { View, Text } = require('react-native');
          const icon = options?.tabBarIcon?.({ color: '#000', size: 24 });
          return <View><Text>{options?.title}</Text>{icon}</View>;
        },
      }
    ),
    Link: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    Redirect: ({ href }: any) => <View testID="redirect" />,
  };
});

jest.mock('expo-status-bar', () => {
  const { View } = require('react-native');
  return { StatusBar: (props: any) => <View testID="status-bar" /> };
});

jest.mock('expo-navigation-bar', () => ({
  setVisibilityAsync: jest.fn(),
  setBehaviorAsync: jest.fn(),
}));

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const icon = (props: any) => <View testID="icon" />;
  return {
    SquareCheck: icon,
    CheckSquare: icon,
    Settings: icon,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
  };
});

describe('NotFoundScreen', () => {
  it('renders the not found screen', () => {
    const { getByText } = render(<NotFoundScreen />);
    expect(getByText("This screen doesn't exist.")).toBeTruthy();
    expect(getByText('Go to home screen!')).toBeTruthy();
  });
});

describe('AppIndex', () => {
  it('renders a redirect', () => {
    const { getByTestId } = render(<AppIndex />);
    expect(getByTestId('redirect')).toBeTruthy();
  });
});

describe('TabLayout', () => {
  it('renders the tab layout with icons', () => {
    const { getByText, getAllByTestId } = render(<TabLayout />);
    expect(getByText('Tasks')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
    expect(getAllByTestId('icon').length).toBe(2);
  });
});

describe('RootLayout', () => {
  it('renders the root layout', () => {
    const { getByTestId } = render(<RootLayout />);
    expect(getByTestId('status-bar')).toBeTruthy();
  });
});
