// src/socket.ts
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/constants";

let socket: Socket | null = null;

export const initSocket = (userId?: string) => {
  if (socket) return socket;
  socket = io(SOCKET_URL, { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("Socket connected", socket!.id);
    if (userId) socket!.emit("identify", userId);
  });

  socket.on("disconnect", () => console.log("Socket disconnected"));
  return socket;
};

export const getSocket = () => socket;
export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
