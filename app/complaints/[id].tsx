import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Linking,
  StyleSheet,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../src/api";
import { useTheme } from "../../src/hooks/useTheme";
import { COLORS } from "../../theme/colors";

const DUMMY_COMPLAINTS = [
  {
    _id: "1",
    title: "مشكلة في نظام التدفئة",
    type: "صيانة",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    description: "التدفئة لا تعمل بشكل صحيح في الطابق الأول. يرجى إرسال فني للفحص والإصلاح في أقرب وقت.",
  },
  {
    _id: "2",
    title: "تسرب المياه في الحمام",
    type: "إصلاح",
    status: "running",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    description: "يوجد تسرب بسيط في أنابيب الحمام. الفريق الفني جاري العمل على إصلاحه.",
  },
  {
    _id: "3",
    title: "دهان الجدران التالفة",
    type: "دهان",
    status: "resolved",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    description: "تم إعادة دهان الجدران التالفة بنجاح. تم استخدام مواد عالية الجودة.",
  },
  {
    _id: "4",
    title: "إصلاح الأبواب المعطلة",
    type: "صيانة",
    status: "pending",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    description: "أبواب الشقة تحتاج إلى إصلاح وتعديل المفصلات.",
  },
  {
    _id: "5",
    title: "تنظيف السلالم العامة",
    type: "تنظيف",
    status: "running",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    description: "تنظيف شامل للسلالم والممرات. جاري استخدام مواد التنظيف المتخصصة.",
  },
];

export default function ComplaintDetails() {
  const { themeType } = useTheme();
  const { id } = useLocalSearchParams();
  const dummyComplaint = DUMMY_COMPLAINTS.find(item => item._id === id);
  const [c, setC] = useState<any>(dummyComplaint || DUMMY_COMPLAINTS[0]);
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    (async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        if (res.data) {
          setC(res.data);
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return COLORS.dark.warning;
      case "resolved":
        return COLORS.dark.success;
      case "running":
        return COLORS.dark.primary;
      case "rejected":
        return COLORS.dark.error;
      default:
        return COLORS.dark.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "قيد الانتظار";
      case "resolved":
        return "مكتمل";
      case "running":
        return "قيد التنفيذ";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeType === "dark" ? "#0a1418" : "#f5f5f5" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORS.dark.primary}
            />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>تفاصيل الشكوى</Text>
          <View style={{ width: 24 }} />
        </View>

        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <BlurView intensity={40} style={styles.cardBlur}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{c.title}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(c.status)}20` },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(c.status) },
                  ]}
                >
                  {getStatusLabel(c.status)}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>النوع:</Text>
              <Text style={styles.metaValue}>{c.type}</Text>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>التاريخ:</Text>
              <Text style={styles.metaValue}>
                {new Date(c.createdAt).toLocaleDateString("ar-SA")}
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        <View style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>مراحل المعالجة</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineCircle,
                  (c.status === "pending" ||
                    c.status === "running" ||
                    c.status === "resolved") && styles.timelineCircleActive,
                  c.status === "pending" && styles.timelineCircleCurrent,
                ]}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color={
                    c.status === "pending" ||
                    c.status === "running" ||
                    c.status === "resolved"
                      ? "#fff"
                      : "#7a8892"
                  }
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>قيد الانتظار</Text>
                <Text style={styles.timelineSubtitle}>بدء المعالجة</Text>
              </View>
            </View>

            <View
              style={[
                styles.timelineLine,
                (c.status === "running" || c.status === "resolved") &&
                  styles.timelineLineActive,
              ]}
            />

            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineCircle,
                  (c.status === "running" || c.status === "resolved") &&
                    styles.timelineCircleActive,
                  c.status === "running" && styles.timelineCircleCurrent,
                ]}
              >
                <MaterialCommunityIcons
                  name="progress-clock"
                  size={20}
                  color={
                    c.status === "running" || c.status === "resolved"
                      ? "#fff"
                      : "#7a8892"
                  }
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>قيد التنفيذ</Text>
                <Text style={styles.timelineSubtitle}>جاري العمل</Text>
              </View>
            </View>

            <View
              style={[
                styles.timelineLine,
                c.status === "resolved" && styles.timelineLineActive,
              ]}
            />

            <View style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineCircle,
                  c.status === "resolved" && styles.timelineCircleActive,
                  c.status === "resolved" && styles.timelineCircleCurrent,
                ]}
              >
                <MaterialCommunityIcons
                  name={c.status === "resolved" ? "check-circle" : "circle-outline"}
                  size={20}
                  color={c.status === "resolved" ? "#fff" : "#7a8892"}
                />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>مكتمل</Text>
                <Text style={styles.timelineSubtitle}>تم الانتهاء</Text>
              </View>
            </View>
          </View>
        </View>

        {c.description && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>الوصف</Text>
            <Text style={styles.descriptionText}>{c.description}</Text>
          </View>
        )}

        {c.attachments && c.attachments.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>المرفقات</Text>
            <FlatList
              data={c.attachments}
              keyExtractor={(i, idx) => `${i.url}-${idx}`}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.attachmentItem,
                    index !== c.attachments.length - 1 &&
                      styles.attachmentItemBorder,
                  ]}
                  onPress={() =>
                    Linking.openURL(
                      `${api.defaults.baseURL?.replace("/api", "")}${item.url}`
                    )
                  }
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="file-document"
                    size={20}
                    color={COLORS.dark.primary}
                  />
                  <Text style={styles.attachmentName} numberOfLines={1}>
                    {item.name || item.url.split("/").pop()}
                  </Text>
                  <MaterialCommunityIcons
                    name="download"
                    size={18}
                    color={COLORS.dark.primary}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1418",
    direction: "rtl",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 12,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    overflow: "hidden",
  },
  cardBlur: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 8,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#b0b8c1",
  },
  metaValue: {
    fontSize: 13,
    color: "#fff",
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 14,
    color: "#b0b8c1",
    lineHeight: 20,
    textAlign: "right",
  },
  attachmentItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  attachmentItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  attachmentName: {
    flex: 1,
    fontSize: 13,
    color: "#fff",
    textAlign: "right",
  },
  timelineCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
    padding: 16,
  },
  timeline: {
    flexDirection: "column",
    gap: 16,
  },
  timelineItem: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 2,
    borderColor: "#7a8892",
    justifyContent: "center",
    alignItems: "center",
  },
  timelineCircleActive: {
    backgroundColor: COLORS.dark.primary,
    borderColor: COLORS.dark.primary,
  },
  timelineCircleCurrent: {
    borderWidth: 3,
    shadowColor: COLORS.dark.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
  },
  timelineSubtitle: {
    fontSize: 12,
    color: "#b0b8c1",
    marginTop: 4,
    textAlign: "right",
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: "#7a8892",
    marginLeft: 21,
  },
  timelineLineActive: {
    backgroundColor: COLORS.dark.primary,
  },
});
