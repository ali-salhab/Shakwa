// app/complaints/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import api from "../../src/api";

export default function ComplaintDetails() {
  const { id } = useLocalSearchParams();
  const [c, setC] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/complaints/${id}`);
        setC(res.data);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [id]);

  if (!c)
    return (
      <View>
        <Text>جارٍ التحميل...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>{c.title}</Text>
      <Text style={{ color: "#666" }}>
        {c.type} • الحالة: {c.status}
      </Text>
      <Text style={{ marginTop: 8 }}>{c.description}</Text>

      <Text style={{ marginTop: 12, fontWeight: "700" }}>المرفقات:</Text>
      <FlatList
        data={c.attachments || []}
        keyExtractor={(i) => i.url}
        renderItem={({ item }) => (
          <Button
            title={item.name || item.url}
            onPress={() =>
              Linking.openURL(
                `${api.defaults.baseURL?.replace("/api", "")}${item.url}`
              )
            }
          />
        )}
      />
    </View>
  );
}
