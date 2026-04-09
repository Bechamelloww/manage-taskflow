process.env.EXPO_PUBLIC_APP_NAME = 'Test App';
process.env.EXPO_PUBLIC_APP_VERSION = '1.0.0';
process.env.EXPO_PUBLIC_ENVIRONMENT = 'development';
process.env.EXPO_PUBLIC_API_URL = 'https://api.test.com';

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
  },
}));
