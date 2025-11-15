import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { useNotifications } from '../src/hooks/useNotifications';
import { COLORS } from '../theme/colors';

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NotificationsModal = ({ visible, onClose }: NotificationsModalProps) => {
  const { themeType } = useTheme();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const isDark = themeType === 'dark';

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 0],
  });

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'complaint':
        return COLORS.dark.primary;
      case 'update':
        return COLORS.dark.success;
      case 'alert':
        return '#ff9500';
      case 'system':
        return COLORS.dark.secondary;
      default:
        return COLORS.dark.primary;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'complaint':
        return 'file-document-outline';
      case 'update':
        return 'check-circle';
      case 'alert':
        return 'alert-circle';
      case 'system':
        return 'bell-outline';
      default:
        return 'bell-outline';
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#0a1418' : '#fafbfc',
              transform: [{ translateY }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View
              style={[
                styles.header,
                {
                  backgroundColor: isDark ? 'rgba(10, 20, 24, 0.95)' : '#ffffff',
                  borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : '#e8ecf1',
                },
              ]}
            >
              <View style={styles.headerContent}>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#1f1f1f' }]}>
                  الإخطارات
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={styles.closeButton}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={24}
                    color={isDark ? '#fff' : '#1f1f1f'}
                  />
                </TouchableOpacity>
              </View>

              {notifications.some((n) => !n.read) && (
                <TouchableOpacity
                  onPress={markAllAsRead}
                  style={styles.markAllButton}
                >
                  <Text style={styles.markAllText}>اقرأ الكل</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              style={styles.listContainer}
              showsVerticalScrollIndicator={false}
            >
              {notifications.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons
                    name="bell-off"
                    size={48}
                    color={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}
                  />
                  <Text
                    style={[
                      styles.emptyText,
                      { color: isDark ? 'rgba(255,255,255,0.5)' : '#999' },
                    ]}
                  >
                    لا توجد إخطارات
                  </Text>
                </View>
              ) : (
                notifications.map((notification) => (
                  <TouchableOpacity
                    key={notification._id}
                    onPress={() => markAsRead(notification._id)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.notificationItem,
                        {
                          backgroundColor: notification.read
                            ? isDark
                              ? 'rgba(255,255,255,0.02)'
                              : '#ffffff'
                            : isDark
                              ? 'rgba(255,255,255,0.08)'
                              : '#f5f7fb',
                          borderLeftColor: getNotificationColor(notification.type),
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: `${getNotificationColor(notification.type)}20` },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getNotificationIcon(notification.type)}
                          size={24}
                          color={getNotificationColor(notification.type)}
                        />
                      </View>

                      <View style={styles.contentContainer}>
                        <View style={styles.titleRow}>
                          <Text
                            style={[
                              styles.notificationTime,
                              { color: isDark ? 'rgba(255,255,255,0.5)' : '#888' },
                            ]}
                          >
                            {formatTime(notification.createdAt)}
                          </Text>
                          <Text
                            style={[
                              styles.notificationTitle,
                              {
                                color: isDark ? '#fff' : '#1f1f1f',
                                fontWeight: notification.read ? '600' : '700',
                              },
                            ]}
                          >
                            {notification.title}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.notificationMessage,
                            { color: isDark ? '#b0b8c1' : '#777' },
                          ]}
                          numberOfLines={2}
                        >
                          {notification.message}
                        </Text>
                      </View>

                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const formatTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;

  return date.toLocaleDateString('ar-SA');
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  container: {
    maxHeight: '85%',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    padding: 8,
  },
  markAllButton: {
    padding: 8,
  },
  markAllText: {
    color: COLORS.dark.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 8,
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    flex: 1,
  },
  notificationMessage: {
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 16,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.dark.primary,
    marginLeft: 8,
    alignSelf: 'center',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});
