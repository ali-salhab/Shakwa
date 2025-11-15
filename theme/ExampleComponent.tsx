import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../src/hooks/useTheme';
import { useLanguage } from '../src/hooks/useLanguage';

export default function ExampleComponent() {
  const { theme } = useTheme();
  const { t, language } = useLanguage();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    successText: {
      color: theme.colors.success,
      fontSize: 12,
      marginTop: 8,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: 8,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{t('common.ok')}</Text>
        <Text style={styles.description}>
          {language === 'en' 
            ? 'This is an example component showing theme and language integration.'
            : 'هذا مثال على مكون يوضح تكامل المظهر واللغة.'}
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{t('common.save')}</Text>
        </TouchableOpacity>
        <Text style={styles.successText}>{t('common.success')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{t('settings.language')}</Text>
        <Text style={styles.description}>
          {language === 'en'
            ? 'Current language: English'
            : 'اللغة الحالية: العربية'}
        </Text>
      </View>
    </View>
  );
}
