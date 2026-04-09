import { jest, describe, it, expect } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import NotFoundScreen from '@/app/+not-found';
import AppIndex from '@/app/index';
import TabLayout from '@/app/(tabs)/_layout';

jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  return {
    Stack: Object.assign(
      ({ children }: any) => <View>{children}</View>,
      { Screen: ({ options }: any) => <View><Text>{options?.title}</Text></View> }
    ),
    Tabs: Object.assign(
      ({ children }: any) => <View>{children}</View>,
      { Screen: ({ name, options }: any) => <View><Text>{options?.title}</Text></View> }
    ),
    Link: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    Redirect: ({ href }: any) => <View testID="redirect" />,
  };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const icon = (props: any) => <View />;
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
  it('renders the tab layout', () => {
    const { getByText } = render(<TabLayout />);
    expect(getByText('Tasks')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });
});
