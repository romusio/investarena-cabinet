"use client";

import { useState } from "react";
import { useNotifications } from "../components/notifications/NotificationProvider";

type Achievement = {
    id: number;
    title: string;
    description: string;
    category: "Активность" | "Задания" | "Магазин" | "Прогресс";
    done: boolean;
    progress?: number;
    total?: number;
    icon: string;
};

export default function AchievementsPage() {
    const { showToast, pushNotification } = useNotifications();

    const [achievements, setAchievements] = useState<Achievement[]>([
        {
            id: 1,
            title: "Первый вход",
            description: "Впервые войдите в личный кабинет.",
            category: "Активность",
            done: true,
            icon: "⚡",
        },
        {
            id: 2,
            title: "Первое действие",
            description: "Совершите первое действие в кабинете.",
            category: "Активность",
            done: true,
            icon: "🎯",
        },
        {
            id: 3,
            title: "5 действий",
            description: "Выполните 5 действий в системе.",
            category: "Активность",
            done: true,
            progress: 5,
            total: 5,
            icon: "🔥",
        },
        {
            id: 4,
            title: "10 действий",
            description: "Выполните 10 действий в системе.",
            category: "Активность",
            done: false,
            progress: 6,
            total: 10,
            icon: "🚀",
        },
        {
            id: 5,
            title: "Первое задание",
            description: "Завершите любое ежедневное задание.",
            category: "Задания",
            done: true,
            icon: "✅",
        },
        {
            id: 6,
            title: "3 задания за день",
            description: "Выполните 3 задания за один день.",
            category: "Задания",
            done: false,
            progress: 1,
            total: 3,
            icon: "📘",
        },
        {
            id: 7,
            title: "Первая покупка",
            description: "Обменяйте StrikeCoin в магазине.",
            category: "Магазин",
            done: false,
            icon: "🛒",
        },
        {
            id: 8,
            title: "Игровые часы",
            description: "Получите награду категории игровые часы.",
            category: "Магазин",
            done: false,
            icon: "🎮",
        },
        {
            id: 9,
            title: "Уровень 3",
            description: "Достигните 3 уровня аккаунта.",
            category: "Прогресс",
            done: false,
            progress: 1,
            total: 3,
            icon: "⭐",
        },
        {
            id: 10,
            title: "100 XP",
            description: "Накопите суммарно 100 XP.",
            category: "Прогресс",
            done: false,
            progress: 40,
            total: 100,
            icon: "💎",
        },
        {
            id: 11,
            title: "250 StrikeCoin",
            description: "Накопите 250 StrikeCoin.",
            category: "Прогресс",
            done: false,
            progress: 80,
            total: 250,
            icon: "🪙",
        },
        {
            id: 12,
            title: "Открыть магазин",
            description: "Посетите страницу магазина наград.",
            category: "Магазин",
            done: true,
            icon: "🎁",
        },
    ]);

    function unlockAchievement(id: number) {
        const target = achievements.find((item) => item.id === id);
        if (!target || target.done) return;

        setAchievements((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, done: true, progress: item.total ?? item.progress } : item
          )
        );

        showToast(`Открыто достижение "${target.title}"`, "success");

        pushNotification({
            title: "Открыто новое достижение",
            description: target.title,
            type: "success",
        });
    }

    const doneCount = achievements.filter((item) => item.done).length;
    const progressPercent = Math.round((doneCount / achievements.length) * 100);

    return (
      <div className="min-h-screen p-6 text-white">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_80px_rgba(0,255,133,0.05)] p-6 md:p-8 mb-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  <div className="xl:col-span-2">
                      <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">
                          Достижения
                      </div>

                      <h1 className="text-3xl md:text-4xl font-bold mb-3">
                          Прогресс игрока
                      </h1>
                      <p className="text-gray-400 max-w-2xl">
                      Выполняйте действия, проходите задания и используйте магазин,
                      чтобы открывать новые достижения и увеличивать общий прогресс аккаунта.
                  </p>

                      <div className="mt-6">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                              <span>Общий прогресс достижений</span>
                              <span>
                  {doneCount} / {achievements.length}
                </span>
                          </div>

                          <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/10">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#00C853] shadow-[0_0_18px_rgba(0,255,133,0.25)] transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              />
                          </div>
                      </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 flex flex-col justify-between">
                      <div>
                          <div className="text-sm text-gray-400 mb-2">Открыто</div>
                          <div className="text-4xl font-bold text-[#00FF85] drop-shadow-[0_0_10px_rgba(0,255,133,0.35)]">
                              {doneCount}
                          </div>
                          <div className="text-gray-400 mt-1">достижений</div>
                      </div>

                      <div className="mt-8 space-y-3">
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <div className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-1">
                                  Последнее
                              </div>
                              <div className="text-white font-medium">Первый вход</div>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                              <div className="text-xs uppercase tracking-[0.14em] text-gray-500 mb-1">
                                  Следующая цель
                              </div>
                              <div className="text-white font-medium">10 действий</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
              <div className="rounded-full border border-[#00FF85]/30 bg-white/5 px-4 py-2 text-sm font-medium text-white shadow-[0_0_12px_rgba(0,255,133,0.16)]">
                  Все
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                  Активность
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                  Задания
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                  Магазин
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
                  Прогресс
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {achievements.map((item) => {
                  const hasProgress =
                    typeof item.progress === "number" && typeof item.total === "number";

                  const itemProgress = hasProgress
                    ? Math.round((item.progress! / item.total!) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-6 min-h-[270px] flex flex-col justify-between transition ${
                        item.done
                          ? "border-[#00FF85]/30 bg-gradient-to-br from-[#102218] to-[#0b1020] shadow-[0_0_25px_rgba(0,255,133,0.08)]"
                          : "border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020]"
                      }`}
                    >
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-5">
                                <div className="text-4xl">{item.icon}</div>

                                <div
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                                    item.done
                                      ? "bg-[#00FF85]/15 text-[#00FF85]"
                                  : "bg-white/5 text-gray-400"
                                  }`}
                                >
                                    {item.done ? "Выполнено" : "Не выполнено"}
                                </div>
                            </div>

                            <div className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-3">
                                {item.category}
                            </div>

                            <div className="text-2xl font-bold text-white leading-tight mb-3">
                                {item.title}
                            </div>

                            <div className="text-sm text-gray-400 leading-relaxed">
                                {item.description}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                                <span>Прогресс</span>
                                <span>
                    {item.done
                      ? "100%"
                      : hasProgress
                        ? `${item.progress} / ${item.total}`
                        : "0%"}
                  </span>
                            </div>

                            <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/10 mb-4">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#00C853] shadow-[0_0_12px_rgba(0,255,133,0.25)] transition-all duration-300"
                                  style={{
                                      width: item.done
                                        ? "100%"
                                        : hasProgress
                                          ? `${itemProgress}%`
                                      : "0%",
                                  }}
                                />
                            </div>

                            {!item.done && (
                              <button
                                onClick={() => unlockAchievement(item.id)}
                                className="w-full rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] hover:scale-[1.02] transition"
                              >
                                  Открыть достижение
                              </button>
                            )}
                        </div>
                    </div>
                  );
              })}
          </div>
      </div>
    );
}