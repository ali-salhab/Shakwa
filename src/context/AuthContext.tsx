// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../api";
import { initSocket, closeSocket } from "../socket";

type User = { _id: string; phone: string; fullName?: string; role?: string };

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await SecureStore.getItemAsync("token");
      const userId = await SecureStore.getItemAsync("userId");
      if (token && userId) {
        try {
          const res = await api.get("/users/me");
          setUser(res.data);
          initSocket(res.data._id);
        } catch (e) {
          console.warn("Failed to fetch user", e);
        }
      }
      setLoading(false);
    })();
  }, []);

  const login = async (phone: string, password: string) => {
    const res = await api.post("/auth/login", { phone, password });
    const { token, user } = res.data;
    await SecureStore.setItemAsync("token", token);
    await SecureStore.setItemAsync("userId", user._id);
    setUser(user);
    initSocket(user._id);
    return user;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("userId");
    setUser(null);
    closeSocket();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
