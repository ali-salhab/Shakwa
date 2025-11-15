import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { COLORS } from "../theme/colors";

const { width } = Dimensions.get("window");

const PAGES = [
  {
    id: 1,
    icon: "message-alert",
    title: "أبلغ عن الشكاوى",
    description: "شارك المشاكل في مجتمعك بسهولة وسرية تامة",
    gradient: ["#0a1418", "#1a2f4a"],
    iconColor: "#0A84FF",
  },
  {
    id: 2,
    icon: "track-changes",
    title: "تابع التقدم",
    description: "راقب حالة شكاويك وتحديثاتها في الوقت الفعلي",
    gradient: ["#1a2f4a", "#2a3f5a"],
    iconColor: "#32D74B",
  },
  {
    id: 3,
    icon: "handshake",
    title: "حل آمن وموثوق",
    description: "نحن هنا للاستماع والعمل على إيجاد حلول فعّالة",
    gradient: ["#2a3f5a", "#0a1418"],
    iconColor: "#FF9500",
  },
];

const OnboardingPage = ({ page, isActive }: any) => {
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const translateYAnim = useRef(new Animated.Value(isActive ? 0 : 50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: isActive ? 1 : 0.8,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: isActive ? 1 : 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: isActive ? 0 : 50,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isActive]);

  const backgroundAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgOpacity = backgroundAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.page,
        {
          opacity: opacityAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
      pointerEvents={isActive ? "auto" : "none"}
    >
      <LinearGradient
        colors={page.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pageGradient}
      >
        <View style={styles.pageContent}>
          <Animated.View
            style={[
              styles.animatedBackground,
              {
                opacity: bgOpacity,
              },
            ]}
          >
            <View style={[styles.shapeBg, styles.shape1]} />
            <View style={[styles.shapeBg, styles.shape2]} />
            <View style={[styles.shapeBg, styles.shape3]} />
          </Animated.View>

          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconBox,
                {
                  borderColor: page.iconColor,
                  backgroundColor: `${page.iconColor}20`,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={page.icon}
                size={64}
                color={page.iconColor}
              />
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.description}>{page.description}</Text>
          </View>

          <View style={styles.decorativeElements}>
            <View
              style={[styles.decorBall, { backgroundColor: page.iconColor }]}
            />
            <View
              style={[
                styles.decorBall,
                { backgroundColor: page.iconColor, marginLeft: 20 },
              ]}
            />
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default function Onboarding() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentPage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
      scrollViewRef.current?.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      });
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollViewRef.current?.scrollTo({
        x: (currentPage - 1) * width,
        animated: true,
      });
    }
  };

  const handleFinish = async () => {
    await SecureStore.setItemAsync("seenOnboarding", "1");
    router.replace("/(auth)/login");
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ["33%", "66%", "100%"],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>

      <View style={styles.pagesContainer}>
        {PAGES.map((page, index) => (
          <OnboardingPage
            key={page.id}
            page={page}
            isActive={index === currentPage}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {PAGES.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentPage
                      ? COLORS.dark.primary
                      : "rgba(255, 255, 255, 0.3)",
                  width: index === currentPage ? 32 : 10,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handlePrev}
            style={[
              styles.button,
              styles.prevButton,
              currentPage === 0 && styles.buttonDisabled,
            ]}
            disabled={currentPage === 0}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color={currentPage === 0 ? "#555" : "#fff"}
            />
          </TouchableOpacity>

          {currentPage === PAGES.length - 1 ? (
            <TouchableOpacity
              onPress={handleFinish}
              style={[styles.button, styles.nextButton]}
            >
              <Text style={styles.buttonText}>ابدأ الآن</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.button, styles.nextButton]}
            >
              <Text style={styles.buttonText}>التالي</Text>
              <MaterialCommunityIcons
                name="arrow-left"
                size={20}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1418",
    direction: "rtl",
  },
  header: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: COLORS.dark.primary,
  },
  pagesContainer: {
    flex: 1,
    flexDirection: "row",
  },
  page: {
    width,
    height: "100%",
  },
  pageGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  pageContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  animatedBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  shapeBg: {
    position: "absolute",
    borderRadius: 100,
  },
  shape1: {
    width: 200,
    height: 200,
    top: "10%",
    left: "-10%",
    backgroundColor: "rgba(10, 132, 255, 0.1)",
  },
  shape2: {
    width: 150,
    height: 150,
    bottom: "15%",
    right: "-5%",
    backgroundColor: "rgba(50, 215, 75, 0.1)",
  },
  shape3: {
    width: 100,
    height: 100,
    bottom: "30%",
    left: "10%",
    backgroundColor: "rgba(255, 149, 0, 0.1)",
  },
  iconContainer: {
    marginBottom: 40,
    zIndex: 1,
  },
  iconBox: {
    width: 120,
    height: 120,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 40,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#b0b8c1",
    textAlign: "center",
    lineHeight: 24,
  },
  decorativeElements: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    zIndex: 1,
  },
  decorBall: {
    width: 12,
    height: 12,
    borderRadius: 6,
    opacity: 0.6,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 32,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
  prevButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    width: 50,
  },
  nextButton: {
    backgroundColor: COLORS.dark.primary,
    flex: 1,
    shadowColor: COLORS.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
