import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '@/app/(tabs)/settings';

// Mock pour lucide-react-native
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  const icon = (props: any) => <View testID={props.testID} />;
  return { Info: icon };
});

// Mock pour react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: any) => <View {...props}>{children}</View>,
    SafeAreaProvider: ({ children }: any) => <>{children}</>,
  };
});

describe('SettingsScreen', () => {

    it('affiche correctement les informations de l\'environnement', () => {
        const { getByText } = render(<SettingsScreen />);

        expect(getByText('App Name')).toBeTruthy();
        expect(getByText('App Version')).toBeTruthy();
        expect(getByText('Environment')).toBeTruthy();
        expect(getByText('API URL')).toBeTruthy();
    });

    it('affiche les sections Environment Information et About', () => {
        const { getByText } = render(<SettingsScreen />);

        expect(getByText('Environment Information')).toBeTruthy();
        expect(getByText('About')).toBeTruthy();
    });

    it('affiche la description de l\'application', () => {
        const { getByText } = render(<SettingsScreen />);
        expect(
            getByText(
                'This task management app helps you stay organized and productive.\nBuilt with Expo and React Native.'
            )
        ).toBeTruthy();
    });
});
