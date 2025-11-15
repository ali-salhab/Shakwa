// app/(tabs)/my-complaints.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import api from "../../src/api";
import { useRouter } from "expo-router";

export default function MyComplaints() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/complaints/mine");
      setList(res.data);
    } catch (e) {
      console.warn(e);
      // alert("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={list}
        keyExtractor={(i) => i._id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={load} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}
            onPress={() =>
              router.push({
                pathname: "/complaints/[id]",
                params: { id: item._id },
              })
            }
          >
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text style={{ color: "#666" }}>
              {item.type} • الحالة: {item.status}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text>لا توجد شكاوى</Text>
          </View>
        }
      />
    </View>
  );
}
