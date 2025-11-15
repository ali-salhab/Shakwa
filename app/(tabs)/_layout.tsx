// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Animated, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";

export default function TabsLayout() {
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const { height } = useWindowDimensions();

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const animatedStyle = React.useMemo(
    () => ({
      opacity: animatedValue,
      transform: [
        {
          scale: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.1],
          }),
        },
      ],
    }),
    [animatedValue]
  );

  return (
    <SafeAreaView style={[styles.container, { minHeight: height }]}>
      <Animated.View
        style={[styles.animatedContainer, animatedStyle]}
      ></Animated.View>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="my-complaints"
          options={{
            title: "شكاويّي",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="add-complaint"
          options={{
            title: " شكوى",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "الملف",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  animatedContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
