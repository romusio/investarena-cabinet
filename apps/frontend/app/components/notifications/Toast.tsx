"use client";

import { useNotifications } from "./NotificationProvider";

export default function Toast() {
  const { toastMessage, toastType } = useNotifications();

  if (!toastMessage) return null;

  const typeClasses =
    toastType === "success"
      ? "border-[#00FF85]/30 bg-[#0b1b14] text-white shadow-[0_0_25px_rgba(0,255,133,0.12)]"
      : toastType === "error"
        ? "border-red-400/30 bg-[#1a1010] text-white shadow-[0_0_25px_rgba(248,113,113,0.12)]"
        : "border-white/10 bg-[#111827] text-white shadow-[0_0_25px_rgba(255,255,255,0.05)]";

  return (
    <div className="fixed bottom-6 right-6 z-[100] max-w-sm">
      <div
        className={`rounded-2xl border px-5 py-4 backdrop-blur-xl ${typeClasses}`}
      >
        <div className="text-sm font-medium leading-relaxed">{toastMessage}</div>
      </div>
    </div>
  );
}