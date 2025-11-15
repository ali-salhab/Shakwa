import React, { createContext, useState, ReactNode } from 'react';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'complaint' | 'update' | 'system' | 'alert';
  read: boolean;
  createdAt: string;
  icon?: string;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    _id: '1',
    title: 'تم تحديث شكواك',
    message: 'تم تحديث حالة شكواك بخصوص مشكلة التدفئة',
    type: 'update',
    read: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    icon: 'check-circle',
  },
  {
    _id: '2',
    title: 'شكوى جديدة تم إنشاؤها',
    message: 'تم إنشاء شكواك بنجاح ويتم مراجعتها الآن',
    type: 'complaint',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'file-document-outline',
  },
  {
    _id: '3',
    title: 'تنبيه نظام',
    message: 'يرجى تحديث بيانات ملفك الشخصي',
    type: 'system',
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: 'bell-outline',
  },
  {
    _id: '4',
    title: 'انتبه: شكوى قيد الانتظار',
    message: 'لديك 2 شكاوى قيد انتظار المراجعة',
    type: 'alert',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    icon: 'alert-circle',
  },
  {
    _id: '5',
    title: 'شكواك تم حلها',
    message: 'تم حل شكواك بخصوص تسرب المياه',
    type: 'update',
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    icon: 'check-all',
  },
];

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
