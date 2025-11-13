// app/index.tsx
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { View, Text } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const seen = await SecureStore.getItemAsync("seenOnboarding");
      const token = await SecureStore.getItemAsync("token");
      const userId = await SecureStore.getItemAsync("userId");
      if (!seen) router.replace("/onboarding");
      else if (!token || !userId) router.replace("/(auth)/login");
      else router.replace("/(tabs)/my-complaints");
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>جارٍ التهيئة...</Text>
    </View>
  );
}
