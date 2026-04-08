import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsScreen() {
  const { t, changeLanguage, locale } = useTranslation();
  const envVars = {
    [t('settings.name')]: process.env.EXPO_PUBLIC_APP_NAME,
    [t('settings.version')]: process.env.EXPO_PUBLIC_APP_VERSION,
    [t('settings.env')]: process.env.EXPO_PUBLIC_ENVIRONMENT,
    [t('settings.apiurl')]: process.env.EXPO_PUBLIC_API_URL,
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.environmentinfo')}</Text>
        {Object.entries(envVars).map(([key, value], index) => (
          <View key={`env-${key}-${index}`} style={styles.row}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.changeLanguage')}</Text>
        {languages.map((lang) => {
          const isActive = locale === lang.code;

          return (
            <Pressable
              key={lang.code}
              style={[styles.languageItem, isActive && styles.activeItem]}
              onPress={() => changeLanguage(lang.code)}
            >
              <Text style={styles.flag}>{lang.flag}</Text>

              <Text style={styles.languageText}>
                {lang.label}
              </Text>

              {isActive && <Text style={styles.check}>✓</Text>}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
        <Text style={styles.description}>
          {t('settings.description')}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginVertical: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  label: {
    fontSize: 16,
    color: '#3A3A3C',
  },
  value: {
    fontSize: 16,
    color: '#8E8E93',
  },
  description: {
    fontSize: 16,
    color: '#3A3A3C',
    lineHeight: 24,
  },
  check: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },

  languageText: {
    flex: 1,
    fontSize: 16,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  activeItem: {
    backgroundColor: '#E6F0FF',
  },
});