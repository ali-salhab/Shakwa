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
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../src/api";
import { useTheme } from "../../src/hooks/useTheme";
import { useComplaints } from "../../src/hooks/useComplaints";
import { COLORS } from "../../theme/colors";
import { FONTS } from "../../theme/fonts";

type Attachment = {
  uri: string;
  name?: string;
  mime?: string;
  isImage?: boolean;
};

const COMPLAINT_TYPES = [
  "صيانة عامة",
  "نظافة",
  "سلامة",
  "كهرباء",
  "سباكة",
  "دهان",
  "أسقف",
  "أرضيات",
  "إضاءة",
  "تهوية",
  "شبابيك",
  "أبواب",
  "آخر",
];

const PRIORITY_OPTIONS = [
  { label: "منخفضة", value: "low" },
  { label: "متوسطة", value: "medium" },
  { label: "عالية", value: "high" },
];

const POPULAR_LOCATIONS = [
  "الرياض - المركز",
  "الرياض - حي النخيل",
  "الرياض - حي العليا",
  "الرياض - حي الملز",
  "الرياض - حي النزهة",
  "الرياض - حي الصفا",
  "الرياض - حي السلي",
  "الرياض - حي الهدية",
  "الرياض - حي ظهرة لبن",
  "الرياض - حي الربيع",
];

export default function AddComplaint() {
  const { themeType } = useTheme();
  const { addComplaint } = useComplaints();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const submitScale = useRef(new Animated.Value(1)).current;
  const attachmentsFade = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

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
    const next = attachments.slice();
    next.splice(index, 1);
    setAttachments(next);
  };

  const handleSelectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setLocationModalVisible(false);
  };

  const isFormValid = title.trim() && description.trim() && type.trim();

  const onPressSubmit = async () => {
    if (!isFormValid) {
      return;
    }

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
    form.append("location", location.trim());
    form.append("priority", priority);
    form.append("phone", phone.trim());
    form.append("email", email.trim());

    attachments.forEach((a, i) => {
      form.append("attachments", {
        uri: a.uri,
        name: a.name || `file-${i}`,
        type: a.mime || "application/octet-stream",
      } as any);
    });

    setLoading(true);
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    try {
      await api.post("/complaints", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      addComplaint({
        title: title.trim(),
        description: description.trim(),
        type: type.trim(),
        location: location.trim(),
        priority: priority as 'low' | 'medium' | 'high',
        phone: phone.trim(),
        email: email.trim(),
      });
      Alert.alert("نجاح", "تم إرسال الشكوى");
      resetForm();
    } catch (err: any) {
      console.warn(err);
      addComplaint({
        title: title.trim(),
        description: description.trim(),
        type: type.trim(),
        location: location.trim(),
        priority: priority as 'low' | 'medium' | 'high',
        phone: phone.trim(),
        email: email.trim(),
      });
      Alert.alert("نجاح", "تم إضافة الشكوى محليًا");
      resetForm();
    } finally {
      setLoading(false);
      spinAnim.setValue(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setType("");
    setPriority("medium");
    setPhone("");
    setEmail("");
    setAttachments([]);
  };

  const spinRotation = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const isDark = themeType === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;
  const bgColor = isDark ? "#0a1418" : colors.background;
  const surfaceColor = isDark ? "rgba(255,255,255,0.08)" : colors.surface;
  const textColor = isDark ? "#fff" : colors.text;
  const secondaryTextColor = isDark ? "#b0b8c1" : colors.textSecondary;
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : colors.border;

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={[styles.gradient, { backgroundColor: bgColor }]}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={true}
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
                <View style={[styles.headerBlur, { backgroundColor: isDark ? "rgba(26, 42, 58, 0.9)" : colors.surface }]}>
                  <Text style={[styles.title, { color: textColor }]}>إضافة شكوى</Text>
                  <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                    أرسل شكواك مع التفاصيل والمرفقات
                  </Text>
                </View>
              </Animated.View>

              <View style={[styles.card, { backgroundColor: surfaceColor, borderColor }]}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>المعلومات الأساسية</Text>
                
                <FloatingInput
                  label="العنوان"
                  value={title}
                  onChangeText={setTitle}
                  theme={themeType}
                  icon="title"
                />
                
                <FloatingInput
                  label="الوصف التفصيلي"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  theme={themeType}
                  icon="file-document"
                />

                <View style={{ marginBottom: 12 }}>
                  <View style={[styles.inputWrap, { 
                    backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f5f7fb",
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
                  }]}>
                    <TouchableOpacity
                      onPress={() => setLocationModalVisible(true)}
                      style={styles.locationButton}
                    >
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={18}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                    <TextInput
                      value={location}
                      onChangeText={setLocation}
                      style={[
                        styles.input,
                        { color: isDark ? "#fff" : colors.text },
                      ]}
                      placeholder="الموقع / المكان"
                      placeholderTextColor={isDark ? "rgba(129, 102, 102, 0.45)" : colors.textSecondary}
                    />
                  </View>
                  <Text style={[styles.helperText, { color: secondaryTextColor }]}>
                    اضغط على الأيقونة لاختيار موقع من القائمة المقترحة
                  </Text>
                </View>

                <View style={{ marginBottom: 12 }}>
                  <Text style={[styles.label, { color: textColor }]}>نوع الشكوى</Text>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    style={styles.typesScroll}
                    contentContainerStyle={styles.typesScrollContent}
                  >
                    {COMPLAINT_TYPES.map((t) => (
                      <TouchableOpacity
                        key={t}
                        onPress={() => setType(t)}
                        style={[
                          styles.typeChip,
                          {
                            borderColor: type === t ? colors.primary : borderColor,
                            backgroundColor: type === t 
                              ? isDark ? `${colors.primary}20` : `${colors.primary}15`
                              : "transparent",
                            borderWidth: type === t ? 2 : 1,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeChipText,
                            { color: type === t ? colors.primary : secondaryTextColor },
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <Text style={[styles.sectionTitle, { color: textColor }]}>الأولوية والتفاصيل الإضافية</Text>

                <View style={styles.priorityRow}>
                  {PRIORITY_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setPriority(opt.value)}
                      style={[
                        styles.priorityButton,
                        {
                          backgroundColor: priority === opt.value
                            ? isDark ? `${colors.primary}30` : `${colors.primary}10`
                            : "transparent",
                          borderColor: priority === opt.value ? colors.primary : borderColor,
                          borderWidth: priority === opt.value ? 2 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          { color: priority === opt.value ? colors.primary : secondaryTextColor },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <FloatingInput
                  label="رقم الهاتف"
                  value={phone}
                  onChangeText={setPhone}
                  theme={themeType}
                  icon="phone"
                />

                <FloatingInput
                  label="البريد الإلكتروني"
                  value={email}
                  onChangeText={setEmail}
                  theme={themeType}
                  icon="email"
                />

                <View style={{ height: 12 }} />

                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.iconButton}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.primary, colors.secondary]}
                      style={styles.iconButtonGradient}
                    >
                      <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                    </LinearGradient>
                    <Text style={[styles.iconLabel, { color: secondaryTextColor }]}>أضف مرفق</Text>
                  </TouchableOpacity>

                  <View style={{ flex: 1 }} />

                  <Animated.View style={{ transform: [{ scale: submitScale }], opacity: isFormValid ? 1 : 0.5 }}>
                    <TouchableOpacity
                      onPress={onPressSubmit}
                      activeOpacity={0.9}
                      disabled={loading || !isFormValid}
                      style={styles.submitWrap}
                    >
                      <LinearGradient
                        colors={isFormValid ? [colors.primary, colors.secondary] : ["#c0c0c0", "#b0b0b0"]}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.submitButton}
                      >
                        {loading ? (
                          <ActivityIndicator color={textColor} />
                        ) : (
                          <Text style={[styles.submitText, { color: "#fff" }]}>{isFormValid ? "إرسال" : "أكمل الحقول"}</Text>
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
                    <View key={i} style={[styles.attachmentRow, { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0", borderColor }]}>
                      {a.isImage ? (
                        <Image source={{ uri: a.uri }} style={styles.thumb} />
                      ) : (
                        <View style={[styles.fileIcon, { backgroundColor: colors.primary }]}>
                          <MaterialCommunityIcons name="file" size={20} color="#fff" />
                        </View>
                      )}
                      <View style={{ flex: 1, marginHorizontal: 10 }}>
                        <Text numberOfLines={1} style={[styles.attachmentName, { color: textColor }]}>
                          {a.name || a.uri.split("/").pop()}
                        </Text>
                        <Text style={[styles.attachmentMeta, { color: secondaryTextColor }]}>{a.mime}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeAttachment(i)}
                        style={[styles.removeBtn, { backgroundColor: `${colors.error}20` }]}
                      >
                        <Text style={{ color: colors.error, fontWeight: "600" }}>حذف</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </Animated.View>
              </View>
            </ScrollView>

            <Modal
              transparent
              visible={locationModalVisible}
              animationType="slide"
              onRequestClose={() => setLocationModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPress={() => setLocationModalVisible(false)}
              >
                <View style={[styles.modalSheet, { backgroundColor: isDark ? "rgba(10, 20, 24, 0.95)" : "rgba(255, 255, 255, 0.95)" }]}>
                  <Text style={[styles.sheetTitle, { color: textColor }]}>اختر موقعاً</Text>
                  <ScrollView style={styles.locationList}>
                    {POPULAR_LOCATIONS.map((loc, idx) => (
                      <TouchableOpacity 
                        key={idx}
                        style={[styles.locationOption, { borderColor }]}
                        onPress={() => handleSelectLocation(loc)}
                      >
                        <MaterialCommunityIcons name="map-marker" size={20} color={colors.primary} />
                        <Text style={[styles.locationOptionText, { color: textColor }]}>{loc}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.sheetBtn, { opacity: 0.8, borderColor }]}
                    onPress={() => setLocationModalVisible(false)}
                  >
                    <Text style={[styles.sheetBtnText, { color: textColor }]}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>

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
                <View style={[styles.modalSheet, { backgroundColor: isDark ? "rgba(10, 20, 24, 0.95)" : "rgba(255, 255, 255, 0.95)" }]}>
                  <Text style={[styles.sheetTitle, { color: textColor }]}>أضف مرفق</Text>
                  <TouchableOpacity style={[styles.sheetBtn, { borderColor }]} onPress={pickImage}>
                    <MaterialCommunityIcons name="image" size={20} color={colors.primary} />
                    <Text style={[styles.sheetBtnText, { color: textColor }]}>اختيار صورة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sheetBtn, { borderColor }]} onPress={pickFile}>
                    <MaterialCommunityIcons name="file" size={20} color={colors.primary} />
                    <Text style={[styles.sheetBtnText, { color: textColor }]}>اختيار ملف</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sheetBtn, { opacity: 0.8, borderColor }]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={[styles.sheetBtnText, { color: textColor }]}>إلغاء</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal visible={loading} transparent animationType="fade">
        <BlurView intensity={90} style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <Animated.View style={{ transform: [{ rotate: spinRotation }] }}>
              <MaterialCommunityIcons
                name="loading"
                size={60}
                color={colors.primary}
              />
            </Animated.View>
            <Text style={[styles.loadingText, { color: textColor }]}>جارٍ إرسال الشكوى...</Text>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

function FloatingInput({
  label,
  value,
  onChangeText,
  multiline = false,
  numberOfLines = 1,
  theme = "dark",
  icon,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  numberOfLines?: number;
  theme?: string;
  icon?: string;
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

  const isDark = theme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;
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
      <View style={[styles.inputWrap, { 
        backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "#f5f7fb",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
      }]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={isDark ? "rgba(255,255,255,0.4)" : colors.textSecondary}
            style={styles.inputIcon}
          />
        )}
        <Animated.Text style={[styles.inputLabel, labelStyle, { color: isDark ? "rgba(255,255,255,0.7)" : colors.textSecondary }]}>
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          style={[
            styles.input,
            { color: isDark ? "#fff" : colors.text },
            multiline && { height: Math.max(80, 24 * numberOfLines) },
            !value && !focus && { textAlign: "center" },
          ]}
          placeholder={focus ? "" : undefined}
          placeholderTextColor={isDark ? "rgba(129, 102, 102, 0.45)" : colors.textSecondary}
          multiline={multiline}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    direction: "rtl",
  },
  gradient: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: {
    marginBottom: 12,
    borderRadius: 14,
    padding: 16,
    overflow: "hidden",
  },
  headerBlur: {
    borderRadius: 14,
    padding: 16,
    overflow: "hidden",
  },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 6, textAlign: "right", fontFamily: FONTS.bold },
  subtitle: { fontSize: 13, textAlign: "right", fontFamily: FONTS.regular },

  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
    textAlign: "right",
    fontFamily: FONTS.bold,
  },

  inputWrap: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 8,
    position: "relative",
    flexDirection: "row-reverse",
    alignItems: "center",
    minHeight: 48,
  },
  inputIcon: {
    marginLeft: 8,
  },
  inputLabel: {
    position: "absolute",
    right: 40,
    top: 14,
    fontSize: 13,
    fontWeight: "600",
    zIndex: 10,
    fontFamily: FONTS.semiBold,
  },
  input: {
    flex: 1,
    padding: 0,
    marginTop: 0,
    marginRight: 12,
    fontSize: 15,
    textAlign: "right",
    height: 40,
    fontFamily: FONTS.regular,
  },
  locationButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  helperText: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "right",
    fontStyle: "italic",
  },

  label: {
    marginBottom: 8,
    fontWeight: "700",
    textAlign: "right",
    fontSize: 13,
  },
  typesScroll: {
    marginBottom: 8,
  },
  typesScrollContent: {
    paddingHorizontal: 0,
    gap: 8,
    flexDirection: "row-reverse",
  },
  typeChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  typeChipText: {
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },

  priorityRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginBottom: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityText: {
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center",
  },

  actionsRow: { flexDirection: "row-reverse", alignItems: "center", marginTop: 8, justifyContent: "space-between" },
  iconButton: { alignItems: "center", width: 86 },
  iconButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLabel: { marginTop: 6, fontSize: 12 },

  submitWrap: { borderRadius: 14, overflow: "hidden" },
  submitButton: {
    marginLeft: 20,
    paddingVertical: 12,
    borderRadius: 13,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontWeight: "900", fontSize: 15 },

  attachmentsContainer: { marginTop: 12 },
  attachmentRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  thumb: { width: 52, height: 52, borderRadius: 8, marginLeft: 10 },
  fileIcon: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  attachmentName: { fontWeight: "600", textAlign: "right" },
  attachmentMeta: { fontSize: 12, textAlign: "right", marginTop: 2 },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    padding: 18,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
  },
  sheetTitle: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "700",
    textAlign: "right",
  },
  sheetBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    flexDirection: "row-reverse",
    gap: 8,
    borderWidth: 1,
    justifyContent: "center",
  },
  sheetBtnText: { fontWeight: "700", textAlign: "center" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  locationList: {
    maxHeight: 300,
    marginBottom: 12,
  },
  locationOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    gap: 12,
  },
  locationOptionText: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "right",
    flex: 1,
  },
});
