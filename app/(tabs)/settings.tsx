import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info } from 'lucide-react-native';
import { theme } from '@/lib/colors';

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
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.environmentinfo')}</Text>
          {Object.entries(envVars).map(([key, value]) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{key}</Text>
              <Text style={styles.value} numberOfLines={1}>
                {value ?? '—'}
              </Text>
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
          <View style={styles.aboutHeader}>
            <Info size={18} color={theme.primary} />
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          </View>
          <Text style={styles.description}>
            {t('settings.description')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: '500',
  },
  section: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: theme.textSoft,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: theme.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: theme.textSoft,
    lineHeight: 21,
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
