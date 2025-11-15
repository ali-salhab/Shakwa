import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import api from "../../src/api";
import { useRouter } from "expo-router";
import { useTheme } from "../../src/hooks/useTheme";
import { useComplaints } from "../../src/hooks/useComplaints";
import { COLORS } from "../../theme/colors";

export default function MyComplaints() {
  const { themeType } = useTheme();
  const { complaints } = useComplaints();
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/mine");
      setList(res.data && res.data.length > 0 ? res.data : complaints);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (e) {
      console.warn(e);
      setList(complaints);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setList(complaints);
  }, [complaints]);

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "clock-outline";
      case "resolved":
        return "check-circle";
      case "running":
        return "progress-clock";
      case "rejected":
        return "close-circle";
      default:
        return "help-circle";
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
    <SafeAreaView style={[styles.container, { backgroundColor: themeType === "dark" ? "#0a1418" : "#fafbfc" }]}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <View style={[styles.headerBlur, { backgroundColor: themeType === "dark" ? "rgba(26, 42, 58, 0.9)" : "#ffffff" }]}>
          <MaterialCommunityIcons
            name="file-document-multiple"
            size={28}
            color={COLORS.dark.primary}
          />
          <Text style={[styles.headerTitle, { color: themeType === "dark" ? "#fff" : "#1f1f1f" }]}>شكاويّي</Text>
        </View>
      </Animated.View>

      <FlatList
        data={list}
        keyExtractor={(i) => i._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={COLORS.dark.primary}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.complaintCard, { backgroundColor: themeType === "dark" ? "rgba(255, 255, 255, 0.08)" : "#ffffff", borderColor: themeType === "dark" ? "rgba(255, 255, 255, 0.1)" : "#e8ecf1" }]}
            onPress={() =>
              router.push({
                pathname: "/complaints/[id]",
                params: { id: item._id },
              })
            }
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={[styles.complaintTitle, { color: themeType === "dark" ? "#fff" : "#1f1f1f" }]} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: `${getStatusColor(item.status)}20` },
                ]}
              >
                <MaterialCommunityIcons
                  name={getStatusIcon(item.status)}
                  size={16}
                  color={getStatusColor(item.status)}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {getStatusLabel(item.status)}
                </Text>
              </View>
            </View>

            <Text style={[styles.complaintType, { color: themeType === "dark" ? "#b0b8c1" : "#777" }]}>{item.type}</Text>
            <Text style={[styles.complaintDate, { color: themeType === "dark" ? "#7a8892" : "#999" }]}>
              {new Date(item.createdAt).toLocaleDateString("ar-SA")}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="file-document-outline"
              size={64}
              color={themeType === "dark" ? COLORS.dark.border : "#ccc"}
            />
            <Text style={[styles.emptyText, { color: themeType === "dark" ? "#fff" : "#1f1f1f" }]}>لا توجد شكاوى</Text>
            <Text style={[styles.emptySubText, { color: themeType === "dark" ? "#7a8892" : "#aaa" }]}>ستظهر شكاويك هنا</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1418",
    direction: "rtl",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerBlur: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(26, 42, 58, 0.9)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    textAlign: "right",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  complaintCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 8,
  },
  titleContainer: {
    flex: 1,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "right",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  complaintType: {
    fontSize: 13,
    color: "#b0b8c1",
    marginBottom: 6,
    textAlign: "right",
  },
  complaintDate: {
    fontSize: 12,
    color: "#7a8892",
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 13,
    color: "#7a8892",
    marginTop: 4,
  },
});
