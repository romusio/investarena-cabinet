"use client";

import { useMemo, useState } from "react";
import { useNotifications } from "./NotificationProvider";

function formatDate(date: string) {
  return new Date(date).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, clearNotifications } = useNotifications();

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-[#00FF85]/30 hover:text-[#00FF85] transition"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#00FF85] px-1 text-[10px] font-bold text-black">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-[90] w-[360px] rounded-2xl border border-white/10 bg-[#0f172a]/95 p-4 shadow-[0_0_35px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Уведомления</div>
              <div className="text-lg font-semibold text-white">
                Последние события
              </div>
            </div>

            <button
              type="button"
              onClick={clearNotifications}
              className="text-xs text-gray-400 hover:text-[#00FF85] transition"
            >
              Очистить
            </button>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {notifications.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                Уведомлений пока нет
              </div>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-sm font-medium text-white mb-1">
                  {item.title}
                </div>

                {item.description && (
                  <div className="text-sm text-gray-400 mb-2">
                    {item.description}
                  </div>
                )}

                <div className="text-xs uppercase tracking-[0.12em] text-gray-500">
                  {formatDate(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}