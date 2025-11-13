// app/(tabs)/profile.tsx
import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import api from "../../src/api";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [me, setMe] = useState<any>(user);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/users/me");
        setMe(res.data);
      } catch (e) {}
    })();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>
        {me?.fullName || me?.phone}
      </Text>
      <Text>الهاتف: {me?.phone}</Text>
      <Text>الدور: {me?.role}</Text>
      <View style={{ marginTop: 20 }}>
        <Button
          title="تسجيل خروج"
          color="#d33"
          onPress={async () => {
            await logout();
            router.replace("/(auth)/login");
          }}
        />
      </View>
    </View>
  );
}
