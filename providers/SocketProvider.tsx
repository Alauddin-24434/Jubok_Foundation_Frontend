"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { selectCurrentToken, selectCurrentUser } from "@/redux/features/auth/authSlice";

//====================== TYPES ===============================
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emitEvent: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emitEvent: () => {},
});

export const useSocket = () => useContext(SocketContext);

//====================== PROVIDER ===============================
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    // ================= SOCKET.IO INIT =================
    const socketInstance = io(process.env.NEXT_PUBLIC_API_BASE_URL!, {
      transports: ["websocket", "polling"], // 🔥 fallback for Vercel / serverless
      reconnectionAttempts: 5,
      auth: { token },
    });

    // ================= SOCKET EVENTS =================
    socketInstance.on("connect", () => {
      console.log("🟢 Socket connected:", socketInstance.id);
      setIsConnected(true);

      // Admin auto-join
      if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
        socketInstance.emit("join_user_room", "admin");
      }
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("⚠️ Socket connect error:", err.message);
    });

    socketInstance.on("welcome", (data) => {
      console.log("👋", data.message);
    });

    // ================= NOTIFICATIONS =================
    socketInstance.on("public_notification", (data) => {
      toast.info(data.message || "Public notification", {
        description: data.type || undefined,
      });
    });

    socketInstance.on("admin_notification", (data) => {
      toast.info(data.message || "Admin notification", {
        description: data.type || undefined,
      });
    });

    socketInstance.on("user_notification", (data) => {
      toast.info(data.message || "Private notification");
    });

    socketInstance.on("receive_notification", (data) => {
      toast.info(data.message || "New activity");
    });

    // ================= DEBUG (catch all events) =================
    socketInstance.onAny((event, data) => {
      console.log("📡 SOCKET EVENT:", event, data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user, token]);

  // ================= EMIT FUNCTION =================
  const emitEvent = (event: string, data: any) => {
    if (socket?.connected) {
      socket.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
