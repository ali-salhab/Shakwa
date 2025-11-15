import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Animated } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { useTheme } from "../../src/hooks/useTheme";
import { useLanguage } from "../../src/hooks/useLanguage";
import api from "../../src/api";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../../theme/colors";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const { themeType, setThemeType } = useTheme();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const [me, setMe] = useState<any>(user);

  const headerScale = React.useRef(new Animated.Value(0.8)).current;
  const headerOpacity = React.useRef(new Animated.Value(0)).current;
  const cardAnim1 = React.useRef(new Animated.Value(0)).current;
  const cardAnim2 = React.useRef(new Animated.Value(0)).current;
  const cardAnim3 = React.useRef(new Animated.Value(0)).current;
  const logoutAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me");
        setMe(res.data);
      } catch {
        //
      }
    })();

    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(headerScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(cardAnim1, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim2, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(cardAnim3, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(logoutAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDark = themeType === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;
  const bgColor = isDark ? "#0a1418" : colors.background;
  const surfaceColor = isDark ? "rgba(255,255,255,0.08)" : colors.surface;
  const textColor = isDark ? "#fff" : colors.text;
  const secondaryTextColor = isDark ? "#b0b8c1" : colors.textSecondary;
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : colors.border;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.header,
            {
              transform: [{ scale: headerScale }],
              opacity: headerOpacity,
            },
          ]}
        >
          <BlurView intensity={60} style={[styles.headerBlur, { backgroundColor: surfaceColor }]}>
            <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
              <MaterialCommunityIcons
                name="account-circle"
                size={90}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.nameText, { color: textColor }]}>
              {me?.fullName || "المستخدم"}
            </Text>
            <Text style={[styles.roleText, { color: secondaryTextColor }]}>
              {me?.role || "مستخدم عام"}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: colors.success }]}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>نشط الآن</Text>
            </View>
          </BlurView>
        </Animated.View>

        <AnimatedCard
          anim={cardAnim1}
          style={[styles.section, { backgroundColor: surfaceColor, borderColor }]}
        >
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>المظهر</Text>
          </View>

          <View style={styles.themeContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeType === "dark"
                      ? isDark
                        ? colors.primary
                        : `${colors.primary}20`
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e0e0e0",
                  borderColor:
                    themeType === "dark" ? colors.primary : borderColor,
                },
              ]}
              onPress={async () => await setThemeType("dark")}
            >
              <MaterialCommunityIcons
                name="moon-waning-crescent"
                size={28}
                color={
                  themeType === "dark" ? "#fff" : secondaryTextColor
                }
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      themeType === "dark" ? "#fff" : secondaryTextColor,
                    fontWeight: themeType === "dark" ? "700" : "500",
                  },
                ]}
              >
                مظلم
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeButton,
                {
                  backgroundColor:
                    themeType === "light"
                      ? isDark
                        ? colors.primary
                        : `${colors.primary}20`
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e0e0e0",
                  borderColor:
                    themeType === "light" ? colors.primary : borderColor,
                },
              ]}
              onPress={async () => await setThemeType("light")}
            >
              <MaterialCommunityIcons
                name="white-balance-sunny"
                size={28}
                color={
                  themeType === "light" ? "#fff" : secondaryTextColor
                }
              />
              <Text
                style={[
                  styles.themeButtonText,
                  {
                    color:
                      themeType === "light" ? "#fff" : secondaryTextColor,
                    fontWeight: themeType === "light" ? "700" : "500",
                  },
                ]}
              >
                فاتح
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <AnimatedCard
          anim={cardAnim2}
          style={[styles.section, { backgroundColor: surfaceColor, borderColor }]}
        >
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="translate" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>اللغة</Text>
          </View>

          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor:
                    language === "ar"
                      ? isDark
                        ? colors.primary
                        : `${colors.primary}20`
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e0e0e0",
                  borderColor:
                    language === "ar" ? colors.primary : borderColor,
                },
              ]}
              onPress={async () => await setLanguage("ar")}
            >
              <Text
                style={[
                  styles.languageCode,
                  {
                    color:
                      language === "ar" ? "#fff" : colors.primary,
                    fontWeight: language === "ar" ? "800" : "600",
                  },
                ]}
              >
                ع
              </Text>
              <Text
                style={[
                  styles.languageLabel,
                  {
                    color:
                      language === "ar" ? "#fff" : secondaryTextColor,
                    fontWeight: language === "ar" ? "700" : "500",
                  },
                ]}
              >
                العربية
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.languageButton,
                {
                  backgroundColor:
                    language === "en"
                      ? isDark
                        ? colors.primary
                        : `${colors.primary}20`
                      : isDark
                      ? "rgba(255,255,255,0.1)"
                      : "#e0e0e0",
                  borderColor:
                    language === "en" ? colors.primary : borderColor,
                },
              ]}
              onPress={async () => await setLanguage("en")}
            >
              <Text
                style={[
                  styles.languageCode,
                  {
                    color:
                      language === "en" ? "#fff" : colors.primary,
                    fontWeight: language === "en" ? "800" : "600",
                  },
                ]}
              >
                A
              </Text>
              <Text
                style={[
                  styles.languageLabel,
                  {
                    color:
                      language === "en" ? "#fff" : secondaryTextColor,
                    fontWeight: language === "en" ? "700" : "500",
                  },
                ]}
              >
                English
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <AnimatedCard
          anim={cardAnim3}
          style={[
            styles.section,
            styles.aboutCard,
            {
              backgroundColor: isDark
                ? `${colors.primary}15`
                : `${colors.primary}08`,
              borderColor: colors.primary,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>عن التطبيق</Text>
          </View>

          <Text style={[styles.versionText, { color: secondaryTextColor }]}>
            الإصدار 1.0.0
          </Text>
          <Text style={[styles.descriptionText, { color: secondaryTextColor }]}>
            تطبيق شكوى لإبلاغ عن الشكاوى والمشاكل بسهولة
          </Text>
        </AnimatedCard>

        <Animated.View
          style={[
            styles.logoutButtonContainer,
            {
              opacity: logoutAnim,
              transform: [
                {
                  translateY: logoutAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={async () => {
              await logout();
              router.replace("/(auth)/login");
            }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="logout" size={22} color="#fff" />
            <Text style={styles.logoutText}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function AnimatedCard({
  anim,
  style,
  children,
}: {
  anim: Animated.Value;
  style: any;
  children: React.ReactNode;
}) {
  return (
    <Animated.View
      style={[
        style,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 28,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  headerBlur: {
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  nameText: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
    textAlign: "center",
  },
  roleText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  section: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  themeContainer: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  themeButtonText: {
    fontSize: 13,
  },

  languageContainer: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: "center",
    gap: 6,
  },
  languageCode: {
    fontSize: 24,
    fontWeight: "700",
  },
  languageLabel: {
    fontSize: 12,
  },

  aboutCard: {
    alignItems: "flex-end",
  },
  versionText: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    textAlign: "right",
  },

  logoutButtonContainer: {
    marginTop: 12,
    marginBottom: 20,
  },
  logoutButton: {
    borderRadius: 14,
    padding: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
