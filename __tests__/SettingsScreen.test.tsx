import { describe, expect, it } from '@jest/globals';
import React from 'react';
import { render } from '@testing-library/react-native';
import SettingsScreen from '@/app/(tabs)/settings';

describe('SettingsScreen', () => {

    it('affiche correctement les informations de l’environnement', () => {
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

    it('affiche la description de l’application', () => {
        const { getByText } = render(<SettingsScreen />);
        expect(
            getByText(
                'This task management app helps you stay organized and productive. Built with Expo and React Native.'
            )
        ).toBeTruthy();
    });
});
