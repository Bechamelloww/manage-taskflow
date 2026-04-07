/** @type {import('jest').Config} */
const config = {
    verbose: true,
    preset: 'jest-expo',
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!(expo-modules-core|expo-router|react-native|expo|@react-native|@react-navigation|@react-native-community/datetimepicker)/)',
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    setupFiles: ['<rootDir>/jest.setup.js'],
    collectCoverage: true,
    collectCoverageFrom: [
        'app/**/*.{js,jsx,ts,tsx}',
    ],
    coverageReporters: ['json', 'lcov', 'text','clover', 'cobertura'], // Format des rapports de couverture (text, lcov, etc.)
    coverageDirectory: '<rootDir>/.coverage', // Dossier où les rapports de couverture seront stockés
    reporters: ["default", ["jest-junit", { outputDirectory: ".coverage", outputName: "junit.xml" }]]
};

module.exports = config;
