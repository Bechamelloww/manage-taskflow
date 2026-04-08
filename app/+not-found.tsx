import { useTranslation } from '@/hooks/useTranslation';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const { t, changeLanguage, locale } = useTranslation();
  return (
    <>
      <Stack.Screen options={{ title: t('notf.oops') }} />
      <View style={styles.container}>
        <Text style={styles.text}>{t('notf.screen')}</Text>
        <Link href="/" style={styles.link}>
          <Text>{t('notf.link')}</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
