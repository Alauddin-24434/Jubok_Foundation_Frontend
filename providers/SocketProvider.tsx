"use client";

//==================================================================================
//                               SOCKET PROVIDER (FRONTEND)
//==================================================================================
// Description: Manages the Socket.io client connection and provides it via context.
// Features: Auto-reconnect, custom event hooks, and global state integration.
//==================================================================================

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

//======================   TYPE DEFINITIONS   ===============================
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

//======================   PROVIDER COMPONENT   ===============================
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Replace with your backend URL (usually environment variable)
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket"], // Force websocket for better performance
    });

    //======================   EVENT LISTENERS   ===============================
    socketInstance.on("connect", () => {
      console.log("🟢 Connected to Real-time Server:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("🔴 Disconnected from Real-time Server");
      setIsConnected(false);
    });

    socketInstance.on("welcome", (data) => {
      console.log("👋 Welcome Message:", data.message);
    });

    // Handle global notifications from backend
    socketInstance.on("receive_notification", (data) => {
      toast.info(data.message || "New activity recorded in foundation", {
        description: data.description || "",
      });
    });

    setSocket(socketInstance);

    // CLEANUP ON UNMOUNT
    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  // Helper to emit events safely
  const emitEvent = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn("⚠️ Socket not connected. Event not sent:", event);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
};
