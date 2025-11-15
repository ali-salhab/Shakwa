import { Tabs, useRouter, useSegments } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { TopBar } from "../../components/TopBar";
import { NotificationsModal } from "../../components/NotificationsModal";
import { CustomBottomBar } from "../../components/CustomBottomBar";

export default function TabsLayout() {
  const { height } = useWindowDimensions();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] || "my-complaints";

  const tabItems = [
    { name: "my-complaints", icon: "file-document-multiple", label: "شكاويّي", route: "my-complaints" },
    { name: "add-complaints", icon: "plus-circle", label: "شكوى", route: "add-complaints" },
    { name: "profile", icon: "account-circle", label: "الملف", route: "profile" },
  ];

  const handleTabPress = (route: string) => {
    if (route === "my-complaints") router.push("/(tabs)/my-complaints");
    else if (route === "add-complaints") router.push("/(tabs)/add-complaints");
    else if (route === "profile") router.push("/(tabs)/profile");
  };

  return (
    <SafeAreaView style={[styles.container, { minHeight: height }]}>
      <TopBar onNotificationPress={() => setNotificationsVisible(true)} />
      <NotificationsModal
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
      <View style={styles.tabsContainer}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
            sceneStyle: {
              backgroundColor: "#0a1418",
            },
          }}
        >
          <Tabs.Screen name="my-complaints" options={{ title: "شكاويّي" }} />
          <Tabs.Screen name="add-complaints" options={{ title: "شكوى" }} />
          <Tabs.Screen name="profile" options={{ title: "الملف" }} />
        </Tabs>
      </View>
      <CustomBottomBar
        activeRoute={currentRoute}
        onPress={handleTabPress}
        tabs={tabItems}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#0a1418",
  },
  tabsContainer: {
    flex: 1,
  },
});
