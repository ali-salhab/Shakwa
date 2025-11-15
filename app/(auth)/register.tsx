import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import api from "../../src/api";
import { useRouter } from "expo-router";
import { COLORS } from "../../theme/colors";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const animatedValue = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bgColorAnim, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: false,
        }),
        Animated.timing(bgColorAnim, {
          toValue: 0,
          duration: 5000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const doRegister = async () => {
    if (!phone || !password || !confirmPassword) {
      setError("جميع الحقول مطلوبة");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.post("/auth/register", { phone, password });
      alert("تم التسجيل، سجّل الدخول الآن");
      router.replace("/(auth)/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "فشل التسجيل");
    } finally {
      setLoading(false);
    }
  };

  const animateInput = () => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const inputStyle = {
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const logoStyle = {
    transform: [{ scale: logoScale }],
  };

  const bgColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1a2a3aff", "#162238ee"],
  });

  return (
    <SafeAreaView style={[styles.maincontainer, { minHeight: "100%" }]}>
      <Animated.View style={[styles.bgContainer, { backgroundColor: bgColor }]}>
        <BlurView intensity={40} style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <View style={styles.logoBg}>
                <Text style={styles.logoText}>Shakwa</Text>
              </View>
            </Animated.View>

            <Text style={styles.title}>إنشاء حساب جديد</Text>
            <Text style={styles.subtitle}>انضم إلى مجتمع شكوى</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Animated.View style={inputStyle}>
              <TextInput
                placeholder="رقم الهاتف"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setError("");
                }}
                style={styles.input}
                keyboardType="phone-pad"
                onFocus={animateInput}
                placeholderTextColor="#7a8892"
                editable={!loading}
              />
            </Animated.View>

            <Animated.View style={inputStyle}>
              <TextInput
                placeholder="كلمة المرور"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                style={styles.input}
                secureTextEntry
                onFocus={animateInput}
                placeholderTextColor="#7a8892"
                editable={!loading}
              />
            </Animated.View>

            <Animated.View style={inputStyle}>
              <TextInput
                placeholder="تأكيد كلمة المرور"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError("");
                }}
                style={styles.input}
                secureTextEntry
                onFocus={animateInput}
                placeholderTextColor="#7a8892"
                editable={!loading}
              />
            </Animated.View>

            <TouchableOpacity
              style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
              onPress={doRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.registerBtnText}>إنشاء حساب</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginText}>
                لديك حساب بالفعل؟{" "}
                <Text style={styles.loginLink}>تسجيل الدخول</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    padding: 16,
    flex: 1,
    direction: "rtl",
  },
  maincontainer: {
    direction: "rtl",
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0a1418",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scrollContent: {
    justifyContent: "center",
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoBg: {
    direction: "rtl",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    backgroundColor: COLORS.dark.primary,
    borderRadius: 16,
    padding: 16,
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 10,
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: 15,
    color: "#b0b8c1",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    direction: "rtl",
    borderWidth: 1.5,
    borderColor: COLORS.dark.border,
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    fontSize: 16,
    color: "#fff",
  },
  registerBtn: {
    direction: "rtl",
    backgroundColor: COLORS.dark.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 32,
    shadowColor: COLORS.dark.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  registerBtnDisabled: {
    opacity: 0.7,
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  errorText: {
    color: COLORS.dark.error,
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: "600",
  },
  loginText: {
    textAlign: "center",
    color: "#b0b8c1",
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.dark.primary,
    fontWeight: "700",
  },
});
