"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useNotifications } from "../../components/notifications/NotificationProvider";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type Wallet = {
  xp: number;
  level: number;
  points: number;
  email: string;
  fullName: string | null;
  createdAt?: string;
};

export default function EditProfilePage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState("");

  const { showToast, pushNotification } = useNotifications();

  async function loadWallet() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API}/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();
    setWallet(data);
    setFullName(data.fullName || "");
  }

  async function saveProfile() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Не удалось сохранить профиль");
    }

    return res.json();
  }

  useEffect(() => {
    loadWallet();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      const updatedUser = await saveProfile();

      setWallet((prev) =>
        prev
          ? {
            ...prev,
            fullName: updatedUser.fullName,
          }
          : prev
      );

      showToast("Профиль сохранён", "success");

      pushNotification({
        title: "Профиль обновлён",
        description: "Изменения профиля успешно сохранены",
        type: "success",
      });

      setMessage("Изменения профиля успешно сохранены.");
    } catch (error: any) {
      showToast(error?.message || "Ошибка сохранения профиля", "error");

      pushNotification({
        title: "Ошибка сохранения",
        description: error?.message || "Не удалось сохранить профиль",
        type: "error",
      });

      setMessage(error?.message || "Не удалось сохранить профиль.");
    }
  }

  if (!wallet) {
    return <div className="p-6 text-white">Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 shadow-[0_0_80px_rgba(0,255,133,0.05)] md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
              Профиль
            </div>
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">
              Редактирование профиля
            </h1>
            <p className="max-w-2xl text-gray-400">
              Здесь можно изменить отображаемое имя, добавить информацию о себе
              и подготовить фото профиля.
            </p>
          </div>

          <div className="min-w-[260px] rounded-2xl border border-white/10 bg-[#111827] p-5">
            <div className="mb-2 text-sm text-gray-400">Текущий аккаунт</div>
            <div className="mb-1 text-xl font-semibold text-white">
              {wallet.fullName || "Игрок Strike Arena"}
            </div>
            <div className="text-sm text-gray-400">{wallet.email}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6">
          <div className="mb-4 text-sm uppercase tracking-[0.16em] text-gray-500">
          </div>

          <div className="mb-5 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-r from-[#00FF85] to-[#00C853] text-4xl font-bold text-black shadow-[0_0_24px_rgba(0,255,133,0.25)]">
            {wallet.fullName
              ? wallet.fullName.charAt(0).toUpperCase()
              : wallet.email.charAt(0).toUpperCase()}
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="w-full rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] transition hover:scale-[1.02]"
            >
              Загрузить фото
            </button>

            <button
              type="button"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
            >
              Удалить фото
            </button>
          </div>

          <div className="mt-5 text-sm leading-relaxed text-gray-400">
            На следующем шаге подключим загрузку изображения и сохранение аватара.
          </div>
        </div>

        <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6">
          <div className="mb-4 text-sm uppercase tracking-[0.16em] text-gray-500">
            Личные данные
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Отображаемое имя
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="sa-input"
                placeholder="Введите имя"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Email</label>
              <input
                value={wallet.email}
                disabled
                className="sa-input cursor-not-allowed opacity-70"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">Телефон</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="sa-input"
                placeholder="+7 (...)"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-400">О себе</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="sa-input min-h-[140px] resize-none"
                placeholder="Краткая информация о пользователе"
              />
            </div>

            {message && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                {message}
              </div>
            )}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] transition hover:scale-[1.02]"
              >
                Сохранить изменения
              </button>

              <Link
                href="/profile"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
              >
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}