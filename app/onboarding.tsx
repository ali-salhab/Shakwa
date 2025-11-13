// app/onboarding.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();
  const done = async () => {
    await SecureStore.setItemAsync("seenOnboarding", "1");
    router.replace("/(auth)/login");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>مرحبًا في تطبيق الشكاوى</Text>
      <Text style={styles.text}>أبلغ عن المشاكل في مجتمعك بسهولة وسرية.</Text>
      <Button title="ابدأ" onPress={done} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  text: { textAlign: "center", color: "#555", marginBottom: 20 },
});
