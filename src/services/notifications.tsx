// src/services/notifications.ts
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import api from "../api";

export async function registerForPushNotificationsAsync() {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    await SecureStore.setItemAsync("pushToken", token);
    // send to backend (endpoint should save token to user)
    await api.post("/users/me/fcm", { token }).catch((e) => {
      console.warn(
        "Failed to send token to server",
        e?.response?.data || e.message
      );
    });
    return token;
  } catch (err) {
    console.warn("registerForPushNotificationsAsync error", err);
    return null;
  }
}
