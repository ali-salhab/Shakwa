import React, { useContext, useState, useRef, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { COLORS } from "../../theme/colors";

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const animatedValue = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo entrance
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    // Animate background color
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

  const doLogin = async () => {
    try {
      console.log("log in function");
      router.replace("/(tabs)/my-complaints");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "فشل تسجيل الدخول");
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
            {/* Logo with Animation */}
            <Animated.View style={[styles.logoContainer, logoStyle]}>
              <View style={styles.logoBg}>
                <Text style={styles.logoText}>Shakwa</Text>
              </View>
            </Animated.View>

            <Text style={styles.title}>تسجيل الدخول</Text>
            <Text style={styles.subtitle}>مرحبا بك في شكوى</Text>

            {/* Input Fields */}
            <Animated.View style={inputStyle}>
              <TextInput
                placeholder="رقم الهاتف"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                onFocus={animateInput}
                placeholderTextColor="#999"
              />
            </Animated.View>

            <Animated.View style={inputStyle}>
              <TextInput
                placeholder="كلمة المرور"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
                onFocus={animateInput}
                placeholderTextColor="#999"
              />
            </Animated.View>

            <TouchableOpacity style={styles.loginBtn} onPress={doLogin}>
              <Text style={styles.loginBtnText}>تسجيل الدخول</Text>
            </TouchableOpacity>

            {/* Social Login */}
            <Text style={styles.dividerText}>أو تسجيل دخول باستخدام</Text>

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerText}>
                ليس لديك حساب؟{" "}
                <Text style={styles.registerLink}>إنشاء حساب جديد</Text>
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
  loginBtn: {
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
  loginBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  dividerText: {
    textAlign: "center",
    color: "#7a8892",
    marginBottom: 16,
    fontSize: 14,
  },
  registerText: {
    textAlign: "center",
    color: "#b0b8c1",
    fontSize: 14,
  },
  registerLink: {
    color: COLORS.dark.primary,
    fontWeight: "700",
  },
});
