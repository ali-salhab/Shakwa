// app/(tabs)/add-complaints.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
// @ts-ignore: expo-linear-gradient types may be missing in some setups
import { LinearGradient } from "expo-linear-gradient";
// @ts-ignore: expo-blur types may be missing in some setups
import { BlurView } from "expo-blur";
// @ts-ignore: missing type declarations for expo-image-picker in this project
import * as ImagePicker from "expo-image-picker";
// @ts-ignore: missing type declarations for expo-document-picker in this project
import * as DocumentPicker from "expo-document-picker";
import api from "../../src/api";

type Attachment = {
  uri: string;
  name?: string;
  mime?: string;
  isImage?: boolean;
};

export default function AddComplaint() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // animated values for UI polish
  const headerAnim = useRef(new Animated.Value(0)).current; // 0 -> collapsed, 1 -> expanded
  const submitScale = useRef(new Animated.Value(1)).current;
  const attachmentsFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    Animated.timing(attachmentsFade, {
      toValue: attachments.length > 0 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [attachments.length]);

  const pickImage = async () => {
    setModalVisible(false);
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        const name = asset.fileName ?? asset.uri.split("/").pop();
        setAttachments((prev) => [
          ...prev,
          { uri: asset.uri, name, mime: "image/jpeg", isImage: true },
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const pickFile = async () => {
    setModalVisible(false);
    try {
      const res = await DocumentPicker.getDocumentAsync({});
      if ("uri" in res && res.uri) {
        const name: string =
          "name" in res && res.name
            ? (res.name as string)
            : (res.uri as string).split("/").pop() || "file";
        const mime = (res as any).mimeType || "application/octet-stream";
        setAttachments((prev) => [
          ...prev,
          {
            uri: res.uri as string,
            name,
            mime,
            isImage: mime.startsWith("image/"),
          },
        ]);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const removeAttachment = (index: number) => {
    // simple animation on remove
    const next = attachments.slice();
    next.splice(index, 1);
    setAttachments(next);
  };

  const onPressSubmit = async () => {
    if (!title.trim() || !type.trim()) {
      return Alert.alert("خطأ", "الرجاء إدخال العنوان والنوع");
    }
    // press feedback
    Animated.sequence([
      Animated.timing(submitScale, {
        toValue: 0.95,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(submitScale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();

    const form = new FormData();
    form.append("title", title.trim());
    form.append("description", description.trim());
    form.append("type", type.trim());

    attachments.forEach((a, i) => {
      form.append("attachments", {
        uri: a.uri,
        name: a.name || `file-${i}`,
        type: a.mime || "application/octet-stream",
      } as any);
    });

    try {
      setLoading(true);
      await api.post("/complaints", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("نجاح", "تم إرسال الشكوى");
      setTitle("");
      setDescription("");
      setType("");
      setAttachments([]);
    } catch (err: any) {
      console.warn(err);
      Alert.alert("فشل", err?.response?.data?.message || "فشل الإرسال");
    } finally {
      setLoading(false);
    }
  };

  // small reusable chip options for types to improve UX
  const commonTypes = ["خدمات", "نظافة", "سلامة", "آخر"];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <LinearGradient
        colors={["#0f172a", "#0b3a7a", "#2a5298"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.header,
              {
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                  {
                    scale: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.98, 1],
                    }),
                  },
                ],
                opacity: headerAnim,
              },
            ]}
          >
            <BlurView intensity={60} tint="dark" style={styles.headerBlur}>
              <Text style={styles.title}>إضافة شكوى</Text>
              <Text style={styles.subtitle}>
                أرسل شكواك مع مرفقات — سهل وسريع
              </Text>
            </BlurView>
          </Animated.View>

          <View style={styles.card}>
            <FloatingInput
              label="العنوان"
              value={title}
              onChangeText={setTitle}
            />
            <FloatingInput
              label="الوصف"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text style={styles.label}>نوع الشكوى</Text>
            <View style={styles.chipsRow}>
              {commonTypes.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.chip,
                    type === t && { backgroundColor: "rgba(255,255,255,0.12)" },
                  ]}
                >
                  <Text
                    style={[styles.chipText, type === t && { color: "#fff" }]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <FloatingInput
              label="أو اكتب نوع آخر"
              value={type}
              onChangeText={setType}
            />

            <View style={{ height: 12 }} />

            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={styles.iconButton}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#8ec5ff", "#7ee8fa"]}
                  style={styles.iconButtonGradient}
                >
                  <Text style={styles.iconButtonText}>+</Text>
                </LinearGradient>
                <Text style={styles.iconLabel}>أضف مرفق</Text>
              </TouchableOpacity>

              <View style={{ flex: 1 }} />

              <Animated.View style={{ transform: [{ scale: submitScale }] }}>
                <TouchableOpacity
                  onPress={onPressSubmit}
                  activeOpacity={0.9}
                  disabled={loading}
                  style={styles.submitWrap}
                >
                  <LinearGradient
                    colors={["#ffd166", "#06d6a0"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.submitButton}
                  >
                    {loading ? (
                      <ActivityIndicator color="#0b0b0b" />
                    ) : (
                      <Text style={styles.submitText}>إرسال</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.attachmentsContainer,
                { opacity: attachmentsFade },
              ]}
            >
              {attachments.map((a, i) => (
                <View key={i} style={styles.attachmentRow}>
                  {a.isImage ? (
                    <Image source={{ uri: a.uri }} style={styles.thumb} />
                  ) : (
                    <View style={styles.fileIcon}>
                      <Text style={{ color: "#fff", fontSize: 12 }}>FILE</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <Text numberOfLines={1} style={styles.attachmentName}>
                      {a.name || a.uri.split("/").pop()}
                    </Text>
                    <Text style={styles.attachmentMeta}>{a.mime}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeAttachment(i)}
                    style={styles.removeBtn}
                  >
                    <Text style={{ color: "#fff" }}>حذف</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </Animated.View>
          </View>
        </ScrollView>

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalSheet}>
              <Text style={styles.sheetTitle}>أضف مرفق</Text>
              <TouchableOpacity style={styles.sheetBtn} onPress={pickImage}>
                <Text style={styles.sheetBtnText}>اختيار صورة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sheetBtn} onPress={pickFile}>
                <Text style={styles.sheetBtnText}>اختيار ملف</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtn, { opacity: 0.8 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.sheetBtnText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

/* FloatingInput component: animated label that shrinks when there's value or focus */
function FloatingInput({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
}) {
  const focus = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(focus, {
      toValue: value ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const onFocus = () =>
    Animated.timing(focus, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  const onBlur = () => {
    if (!value) {
      Animated.timing(focus, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const labelStyle = {
    transform: [
      {
        translateY: focus.interpolate({
          inputRange: [0, 1],
          outputRange: [10, -18],
        }),
      },
      {
        scale: focus.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.85],
        }),
      },
    ],
    opacity: focus.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }),
  } as const;

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={styles.inputWrap}>
        <Animated.Text style={[styles.inputLabel, labelStyle]}>
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[
            styles.input,
            multiline && { height: Math.max(80, 24 * numberOfLines) },
          ]}
          placeholder={focus ? "" : undefined}
          placeholderTextColor="rgba(255,255,255,0.45)"
          multiline={multiline}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16 },
  headerBlur: {
    borderRadius: 14,
    padding: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: "rgba(255,255,255,0.75)", fontSize: 13 },

  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },

  inputWrap: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 8,
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  inputLabel: {
    position: "absolute",
    left: 14,
    top: 14,
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
    zIndex: 10,
  },
  input: {
    color: "#fff",
    padding: 0,
    marginTop: 8,
    fontSize: 15,
  },

  label: {
    color: "rgba(255,255,255,0.8)",
    marginVertical: 8,
    fontWeight: "700",
  },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: { color: "rgba(255,255,255,0.9)" },

  actionsRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  iconButton: { alignItems: "center", width: 86 },
  iconButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: { fontSize: 28, color: "#03314b", fontWeight: "900" },
  iconLabel: { color: "rgba(255,255,255,0.85)", marginTop: 6, fontSize: 12 },

  submitWrap: { borderRadius: 14, overflow: "hidden" },
  submitButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 120,
    alignItems: "center",
  },
  submitText: { color: "#072227", fontWeight: "900" },

  attachmentsContainer: { marginTop: 12 },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  thumb: { width: 52, height: 52, borderRadius: 8 },
  fileIcon: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  attachmentName: { color: "#fff", fontWeight: "600" },
  attachmentMeta: { color: "rgba(255,255,255,0.45)", fontSize: 12 },
  removeBtn: {
    backgroundColor: "rgba(255,0,60,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#021428",
    padding: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sheetTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "700",
  },
  sheetBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    marginBottom: 10,
    alignItems: "center",
  },
  sheetBtnText: { color: "#fff", fontWeight: "700" },
});
