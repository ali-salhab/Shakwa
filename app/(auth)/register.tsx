// app/(auth)/register.tsx
import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import api from "../../src/api";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const doRegister = async () => {
    try {
      await api.post("/auth/register", { phone, password });
      alert("تم التسجيل، سجّل الدخول الآن");
      router.replace("/(auth)/login");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="رقم الهاتف"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="تسجيل" onPress={doRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
