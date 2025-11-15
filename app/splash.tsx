import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { COLORS } from "../theme/colors";

export default function Splash() {
  const router = useRouter();
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  const rotateAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        const seen = await SecureStore.getItemAsync("seenOnboarding");
        const token = await SecureStore.getItemAsync("token");
        const userId = await SecureStore.getItemAsync("userId");

        setTimeout(() => {
          if (!seen) router.replace("/onboarding");
          else if (!token || !userId) router.replace("/(auth)/login");
          else router.replace("/(tabs)/my-complaints");
        }, 100);
      } catch (error) {
        console.error("Error reading secure storage:", error);
        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 100);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <LinearGradient
      colors={["#0a1418", "#162238", "#1a2a3a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: scaleAnim }, { rotate: rotation }],
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name="message-alert"
            size={80}
            color={COLORS.dark.primary}
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <Text style={styles.title}>شكوى</Text>
        <Text style={styles.subtitle}>منصة الشكاوى الموثوقة</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.dotsContainer,
          {
            opacity: opacityAnim,
          },
        ]}
      >
        <View style={styles.dot} />
        <View style={[styles.dot, { backgroundColor: COLORS.dark.primary }]} />
        <View style={styles.dot} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.dark.primary,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b8c1",
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 12,
    position: "absolute",
    bottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
