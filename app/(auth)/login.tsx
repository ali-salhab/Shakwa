import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../src/context/AuthContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { registerForPushNotificationsAsync } from "../../src/services/notifications";
import { BlurView } from "expo-blur"; // Make sure to install expo-blur

export default function Login() {
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const doLogin = async () => {
    try {
      console.log("log in function");
      router.replace("/(tabs)/my-complaints");
    } catch (err: any) {
      alert(err?.response?.data?.message || err.message || "فشل تسجيل الدخول");
    }
  };

  const handleImageUpload = async () => {
    // Implement image upload logic here
    // For demonstration, let's assume we set a static image
    setImage("https://example.com/your-image.jpg");
  };

  return (
    <BlurView intensity={50} style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
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
      <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
        <Text style={styles.uploadButtonText}>Upload Image</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
      <Button title="log in" onPress={doLogin} />
      <Text
        style={styles.registerText}
        onPress={() => router.push("/(auth)/register")}
      >
        إنشاء حساب جديد
      </Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  uploadButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 12,
  },
  registerText: {
    marginTop: 12,
    color: "#fff",
    textAlign: "center",
  },
});
