"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type Wallet = {
    xp: number;
    level: number;
    points: number;
    email: string;
    fullName: string | null;
    createdAt?: string;
};

export default function ProfilePage() {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [claimedTaskKeys, setClaimedTaskKeys] = useState<string[]>([]);

    async function loadTaskClaims(): Promise<void> {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API}/wallet/task-claims`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) return;

        const data = await res.json();

        const keys = data.map((item: string | { taskKey: string }) => {
            if (typeof item === "string") return item;
            return item.taskKey;
        });

        setClaimedTaskKeys(keys);
    }
    async function loadWallet() {
        const token = localStorage.getItem("accessToken");

        try {
            const res = await fetch(`${API}/wallet`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                setWallet(null);
                setLoading(false);
                return;
            }

            const data = await res.json();
            setWallet(data);
        } catch {
            setWallet(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWallet();
        loadTaskClaims();
    }, []);

    if (loading) {
        return <div className="p-6 text-white">Загрузка...</div>;
    }

    if (!wallet) {
        return <div className="p-6 text-white">Не удалось загрузить профиль</div>;
    }

    const currentLevelXp = wallet.xp % 100;
    const nextLevelLeft = 100 - currentLevelXp;
    const progressPercent = currentLevelXp;

    const playerStatus =
      wallet.level < 3
        ? "Новичок"
        : wallet.level < 7
          ? "Активный игрок"
          : wallet.level < 15
            ? "PRO"
            : "VIP";

    const createdLabel = wallet.createdAt
      ? new Date(wallet.createdAt).toLocaleDateString("ru-RU")
      : "—";

    const dailyTaskIds = [
        "daily-login",
        "daily-profile",
        "daily-store",
    ];

    const completedDailyTasks = dailyTaskIds.filter((taskId) =>
      claimedTaskKeys.includes(taskId)
    ).length;

    const totalDailyTasks = dailyTaskIds.length;

    return (
      <div className="min-h-screen p-6 text-white">
          <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 shadow-[0_0_80px_rgba(0,255,133,0.06)] md:p-8">
              <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                  <div className="xl:col-span-2 flex items-start gap-5">
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#00FF85] to-[#00C853] text-3xl font-bold text-black shadow-[0_0_20px_rgba(0,255,133,0.25)]">
                          {wallet.fullName
                            ? wallet.fullName.charAt(0).toUpperCase()
                            : wallet.email
                              ? wallet.email.charAt(0).toUpperCase()
                              : "U"}
                      </div>

                      <div className="flex-1">
                          <div className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
                              Профиль игрока
                          </div>

                          <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                              {wallet.fullName || "Игрок Strike Arena"}
                          </h1>

                          <div className="mb-4 text-gray-400">{wallet.email}</div>

                          <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white">
                              Level {wallet.level}
                          </div>

                          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                                      Статус
                                  </div>
                                  <div className="text-lg font-semibold text-white">
                                      {playerStatus}
                                  </div>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                                      Дата регистрации
                                  </div>
                                  <div className="text-lg font-semibold text-white">
                                      {createdLabel}
                                  </div>
                              </div>

                              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                                      Последняя активность
                                  </div>
                                  <div className="text-lg font-semibold text-white">
                                  Сегодня
                              </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111827] p-6">
                      <div>
                          <div className="mb-2 text-sm text-gray-400">Баланс</div>
                          <div className="flex items-center gap-3">
                              <Image
                                src="/images/ui/coin.png"
                                alt="StrikeCoin"
                                width={40}
                                height={40}
                                className="rounded-full object-contain"
                              />
                              <div className="text-4xl font-bold text-[#00FF85] drop-shadow-[0_0_10px_rgba(0,255,133,0.35)]">
                                  {wallet.points}
                              </div>
                          </div>

                          <div className="mt-2 text-gray-400">StrikeCoin</div>
                      </div>

                      <div className="mt-8">
                          <div className="rounded-2xl border border-white/10 bg-[#0f172a]/70 p-4">
                              <div className="mb-2 text-sm text-gray-400">Статус аккаунта</div>
                              <div className="text-lg font-semibold text-white">
                                  {playerStatus}
                              </div>
                              <div className="mt-2 text-sm text-gray-400">
                                  Последняя активность: сегодня
                              </div>
                              <div className="text-sm text-gray-400">
                                  Баланс: {wallet.points} StrikeCoin
                              </div>
                          </div>
                      </div>

                      <div className="mt-4">
                          <Link
                            href="/profile/edit"
                            className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
                          >
                              Редактировать профиль
                          </Link>
                      </div>
                  </div>
              </div>
          </div>

          <div className="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6 shadow-[0_0_40px_rgba(0,255,133,0.04)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                      <div className="mb-2 text-sm text-gray-400">Активность аккаунта</div>
                      <div className="text-2xl font-semibold tracking-tight text-white">
                          Прогресс и состояние профиля
                      </div>
                  </div>

                  <div className="text-sm text-gray-400">
                      Последняя операция: <span className="font-medium text-white">+10 XP</span>
                  </div>
              </div>

              <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                          Уровень
                      </div>
                      <div className="text-2xl font-semibold text-white">
                          {wallet.level}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                          Текущий уровень игрока
                      </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                          Общий XP
                      </div>
                      <div className="text-2xl font-semibold text-white">
                          {wallet.xp}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                          Накопленный опыт аккаунта
                      </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                          До следующего уровня
                      </div>
                      <div className="text-2xl font-semibold text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.25)]">
                          {nextLevelLeft} XP
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                      Осталось до повышения уровня
                  </div>
                  </div>
              </div>

              <div>
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                      <span>Прогресс текущего уровня</span>
                      <span>{progressPercent}%</span>
                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#00C853] shadow-[0_0_18px_rgba(0,255,133,0.25)] transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                  </div>
              </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Link
                href="/achievements"
                className="group flex min-h-[170px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6 transition hover:-translate-y-1 hover:border-[#00FF85]/40 hover:shadow-[0_0_40px_rgba(0,255,133,0.18)]"
              >
                  <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                          Достижения
                      </div>
                      <div className="mb-2 text-2xl font-bold text-white">Достижения</div>
                      <div className="text-sm text-gray-400">Открыто достижений</div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                      <div className="text-3xl font-bold text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.3)]">
                          12 / 40
                      </div>
                      <div className="text-sm text-white/70 transition group-hover:text-[#00FF85]">
                          Открыть →
                      </div>
                  </div>
              </Link>

              <Link
                href="/tasks"
                className="group flex min-h-[170px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6 transition hover:-translate-y-1 hover:border-[#00FF85]/40 hover:shadow-[0_0_40px_rgba(0,255,133,0.18)]"
              >
                  <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                          Задания
                      </div>
                      <div className="mb-2 text-2xl font-bold text-white">Задания</div>
                      <div className="text-sm text-gray-400">Выполнено за сегодня</div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                      <div className="text-3xl font-bold text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.3)]">
                          {completedDailyTasks} / {totalDailyTasks}
                      </div>
                      <div className="text-sm text-white/70 transition group-hover:text-[#00FF85]">
                          Открыть →
                      </div>
                  </div>
              </Link>

              <Link
                href="/store"
                className="group flex min-h-[170px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6 transition hover:-translate-y-1 hover:border-[#00FF85]/40 hover:shadow-[0_0_40px_rgba(0,255,133,0.18)]"
              >
                  <div>
                      <div className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-500">
                          Магазин
                      </div>
                      <div className="mb-2 text-2xl font-bold text-white">Магазин</div>
                      <div className="text-sm text-gray-400">Текущий баланс</div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                      <div className="text-3xl font-bold text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.3)]">
                          {wallet.points}
                      </div>
                      <div className="text-sm text-white/70 transition group-hover:text-[#00FF85]">
                          Открыть →
                      </div>
                  </div>
              </Link>
          </div>
      </div>
    );
}