import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { useNotifications } from '../src/hooks/useNotifications';
import { COLORS } from '../theme/colors';

interface TopBarProps {
  onNotificationPress?: () => void;
}

export const TopBar = ({ onNotificationPress }: TopBarProps) => {
  const { themeType } = useTheme();
  const { unreadCount } = useNotifications();

  const isDark = themeType === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(10, 20, 24, 0.95)' : '#ffffff',
          borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#e8ecf1',
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <MaterialCommunityIcons
            name="message-alert"
            size={28}
            color={COLORS.dark.primary}
          />
          <Text style={[styles.appName, { color: isDark ? '#fff' : '#1f1f1f' }]}>
            شكوى
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.notificationButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="bell"
            size={26}
            color={isDark ? '#fff' : '#1f1f1f'}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
