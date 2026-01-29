"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/SocketProvider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */
interface Notification {
  type: string;
  message: string;
  link?: string;
  time?: string;
  read?: boolean;
}

const STORAGE_KEY = "public_notifications";

/* ================= COMPONENT ================= */
export function PublicNotificationBell() {
  const { socket } = useSocket();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  /* ================= LOAD FROM LOCAL STORAGE ================= */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  /* ================= SOCKET LISTENER ================= */
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (data: Notification) => {
      console.log("📡 public_notification received:", data);

      const newNotification: Notification = {
        message: data.message,
        type: data.type,
        link: data.link,
        time: data.time || new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("public_notification", handleNotification);

    return () => {
      socket.off("public_notification", handleNotification);
    };
  }, [socket]);

  /* ================= UNREAD COUNT ================= */
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ================= HANDLE CLICK ================= */
  const handleClick = (index: number, link?: string) => {
    if (link) router.push(link);

    const updated = notifications.map((n, i) =>
      i === index ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-9 w-9 hover:bg-primary/10"
        >
          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[340px] max-h-[420px] overflow-y-auto rounded-2xl p-2"
      >
        {notifications.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">
            No notifications
          </p>
        ) : (
          notifications.map((n, i) => (
            <div
              key={i}
              onClick={() => handleClick(i, n.link)}
              className={`rounded-xl p-3 mb-2 border cursor-pointer transition
                ${n.read ? "opacity-60" : "ring-1 ring-blue-400"}
                ${statusColorMap[n.type || "NOTICE_CREATED"]}`}
            >
              <p className="text-sm font-semibold">{n.message}</p>
              {n.time && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  {new Date(n.time).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ================= STATUS COLORS ================= */
const statusColorMap: Record<string, string> = {
  NOTICE_CREATED: "border-blue-500/30 bg-blue-500/10",
  INFO: "border-green-500/30 bg-green-500/10",
  WARNING: "border-yellow-500/30 bg-yellow-500/10",
  ERROR: "border-red-500/30 bg-red-500/10",
};
