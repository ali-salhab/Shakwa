// app/_layout.tsx
import { Slot, SplashScreen, useGlobalSearchParams } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { registerRootComponent } from "expo";
import React from "react";
import { View } from "react-native";

export default function RootLayout() {
  // Wrap app with AuthProvider
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
