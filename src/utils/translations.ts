export type Language = 'en' | 'ar';

export const translations = {
  en: {
    common: {
      ok: 'OK',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
    },
    navigation: {
      myComplaints: 'My Complaints',
      addComplaint: 'Add Complaint',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
    },
    settings: {
      theme: 'Theme',
      language: 'Language',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      english: 'English',
      arabic: 'العربية',
    },
  },
  ar: {
    common: {
      ok: 'حسناً',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      close: 'إغلاق',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
    },
    navigation: {
      myComplaints: 'شكاويّي',
      addComplaint: 'شكوى جديدة',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      logout: 'تسجيل الخروج',
    },
    settings: {
      theme: 'المظهر',
      language: 'اللغة',
      lightMode: 'الوضع الفاتح',
      darkMode: 'الوضع الداكن',
      english: 'English',
      arabic: 'العربية',
    },
  },
};

export const getTranslation = (key: string, language: Language): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};
