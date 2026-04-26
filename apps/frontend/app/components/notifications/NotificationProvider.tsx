"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastType = "success" | "error" | "info";

export type AppNotification = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  type: ToastType;
};

type NotificationContextType = {
  notifications: AppNotification[];
  pushNotification: (input: {
    title: string;
    description?: string;
    type?: ToastType;
  }) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  toastMessage: string;
  toastType: ToastType;
  showToast: (message: string, type?: ToastType) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({
                                       children,
                                     }: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("info");

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const pushNotification = useCallback(
    ({
       title,
       description,
       type = "info",
     }: {
      title: string;
      description?: string;
      type?: ToastType;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const createdAt = new Date().toISOString();

      setNotifications((prev) => [
        {
          id,
          title,
          description,
          createdAt,
          type,
        },
        ...prev,
      ].slice(0, 20));
    },
    []
  );

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    setToastMessage(message);
    setToastType(type);

    window.setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      pushNotification,
      removeNotification,
      clearNotifications,
      toastMessage,
      toastType,
      showToast,
    }),
    [
      notifications,
      pushNotification,
      removeNotification,
      clearNotifications,
      toastMessage,
      toastType,
      showToast,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error("useNotifications must be used inside NotificationProvider");
  }

  return ctx;
}