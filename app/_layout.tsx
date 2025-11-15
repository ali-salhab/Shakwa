// app/_layout.tsx
import { Slot } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { LanguageProvider } from "../src/context/LanguageContext";
import { ComplaintsProvider } from "../src/context/ComplaintsContext";
import { NotificationsProvider } from "../src/context/NotificationsContext";
import { View } from "react-native";
import { useLanguage } from "../src/hooks/useLanguage";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import * as Font from "expo-font";
import {
  Changa_400Regular,
  Changa_500Medium,
  Changa_600SemiBold,
  Changa_700Bold,
} from "@expo-google-fonts/changa";

function RootLayoutContent() {
  const { loading, language } = useLanguage();

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          "Changa-Regular": Changa_400Regular,
          "Changa-Medium": Changa_500Medium,
          "Changa-SemiBold": Changa_600SemiBold,
          "Changa-Bold": Changa_700Bold,
        });
      } catch (error) {
        console.warn("Error loading Changa font:", error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.warn("Failed to get notification permissions");
        }
      } catch (error) {
        console.warn("Error requesting notification permissions:", error);
      }
    })();
  }, []);

  if (loading) {
    return <View style={{ flex: 1 }} />;
  }

  return <Slot key={language} />;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ComplaintsProvider>
          <NotificationsProvider>
            <AuthProvider>
              <RootLayoutContent />
            </AuthProvider>
          </NotificationsProvider>
        </ComplaintsProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
