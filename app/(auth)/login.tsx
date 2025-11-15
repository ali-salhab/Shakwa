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
    outputRange: ["#39505fff", "#39505fee"],
  });

  return (
    <SafeAreaView style={[styles.maincontainer, { minHeight: "100%" }]}>
      <Animated.View style={[styles.bgContainer, { backgroundColor: bgColor }]}>
        <BlurView intensity={30} style={styles.container}>
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
    padding: 12,
    flex: 1,
    direction: "rtl",
  },
  maincontainer: {
    direction: "rtl",
    flex: 1,
    justifyContent: "center",
    // padding: 20,
    // backgroundColor: "",
    backgroundColor: "#ffffff05",

    // marginHorizontal: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    // padding: 20,
  },
  scrollContent: {
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoBg: {
    direction: "rtl",

    padding: 12,
    marginBottom: 12,

    //
    // borderRadius: 40,
    // backgroundColor: "#8b1313ff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fff9f9ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 1,
  },
  logoText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // width: 80,
    // height: 80,
    // borderRadius: 40,
    backgroundColor: "#250606ff",
    marginTop: 20,
    borderRadius: 12,
    padding: 12,

    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    direction: "rtl",

    borderWidth: 1.5,
    borderColor: "#0F4C75",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  loginBtn: {
    direction: "rtl",

    backgroundColor: "#ffffffbf",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerText: {
    textAlign: "center",
    color: "#ccc",
    marginBottom: 16,
    fontSize: 14,
  },

  registerText: {
    textAlign: "center",
    color: "#e0e0e0",
    fontSize: 14,
  },
  registerLink: {
    color: "#FF6B6B",
    fontWeight: "700",
  },
});
