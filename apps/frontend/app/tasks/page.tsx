"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useNotifications } from "../components/notifications/NotificationProvider";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type TaskType = "daily" | "longterm";

type Task = {
    id: string;
    title: string;
    description: string;
    type: TaskType;
    progress: number;
    target: number;
    rewardPoints: number;
    rewardXp: number;
    claimed: boolean;
};

export default function TasksPage() {
    const { showToast, pushNotification } = useNotifications();

    useEffect(() => {
        loadTaskClaims();
    }, []);

    const [dailyTasks, setDailyTasks] = useState<Task[]>([
        {
            id: "daily-login",
            title: "Ежедневный вход",
            description: "Войдите в личный кабинет сегодня.",
            type: "daily",
            progress: 1,
            target: 1,
            rewardPoints: 5,
            rewardXp: 10,
            claimed: false,
        },
        {
            id: "daily-profile",
            title: "Заполнить профиль",
            description: "Обновите отображаемое имя в профиле.",
            type: "daily",
            progress: 0,
            target: 1,
            rewardPoints: 8,
            rewardXp: 15,
            claimed: false,
        },
        {
            id: "daily-store",
            title: "Посетить магазин",
            description: "Откройте страницу магазина наград.",
            type: "daily",
            progress: 1,
            target: 1,
            rewardPoints: 4,
            rewardXp: 8,
            claimed: false,
        },
    ]);

    const [longTermTasks, setLongTermTasks] = useState<Task[]>([
        {
            id: "long-3-tasks",
            title: "Выполнить 3 задания",
            description: "Получите награды за три задания.",
            type: "longterm",
            progress: 1,
            target: 3,
            rewardPoints: 20,
            rewardXp: 30,
            claimed: false,
        },
        {
            id: "long-first-reward",
            title: "Первая награда",
            description: "Заберите первую награду в системе.",
            type: "longterm",
            progress: 0,
            target: 1,
            rewardPoints: 15,
            rewardXp: 20,
            claimed: false,
        },
        {
            id: "long-loyal",
            title: "Лояльный пользователь",
            description: "Регулярно взаимодействуйте с кабинетом.",
            type: "longterm",
            progress: 2,
            target: 7,
            rewardPoints: 30,
            rewardXp: 50,
            claimed: false,
        },
    ]);

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
    }    async function claimTaskReward(points: number, xp: number, taskKey: string) {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${API}/wallet/reward`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ points, xp, taskKey }),
        });

        if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.message || "Не удалось получить награду");
        }

        return res.json();
    }

    async function handleClaim(task: Task) {
        if (task.claimed) return;
        if (task.progress < task.target) {
            showToast("Задание еще не выполнено", "error");
            pushNotification({
                title: "Задание не завершено",
                description: "Сначала выполните условия задания",
                type: "error",
            });
            return;
        }

        try {
            await claimTaskReward(task.rewardPoints, task.rewardXp, task.id);

            setClaimedTaskKeys((prev) => {
                if (prev.includes(task.id)) return prev;
                return [...prev, task.id];
            });

            await loadTaskClaims();

            if (task.type === "daily") {
                setDailyTasks((prev) =>
                  prev.map((item) =>
                    item.id === task.id ? { ...item, claimed: true } : item
                  )
                );
            } else {
                setLongTermTasks((prev) =>
                  prev.map((item) =>
                    item.id === task.id ? { ...item, claimed: true } : item
                  )
                );
            }

            showToast(
              `Награда получена: +${task.rewardPoints} StrikeCoin, +${task.rewardXp} XP`,
              "success"
        );

            pushNotification({
                title: "Награда получена",
                description: `${task.title}: +${task.rewardPoints} StrikeCoin, +${task.rewardXp} XP`,
              type: "success",
        });
        } catch (error: any) {
            showToast(error?.message || "Ошибка получения награды", "error");
            pushNotification({
                title: "Ошибка получения награды",
                description: error?.message || "Не удалось получить награду",
               type: "error",
        });
        }
    }

    function renderTaskCard(task: Task) {
        const isReady = task.progress >= task.target;
        const isClaimed = claimedTaskKeys.includes(task.id);
        const isComplete = isReady || isClaimed;

        const progressPercent = Math.min(
          100,
          Math.round((task.progress / task.target) * 100)
        );

        return (
          <div
            key={task.id}
            className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-5"
          >
              <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                      <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                          {task.type === "daily" ? ("Ежедневное задание") : (<>Долгосрочная<br />цель</>)}

                      </div>
                      <div className="text-2xl font-bold leading-tight text-white">
                          {task.title}
                      </div>
                  </div>

                  <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                      +{task.rewardPoints} SC / +{task.rewardXp} XP
                  </div>
              </div>

              <div className="mb-4 text-sm leading-relaxed text-gray-400">
                  {task.description}
              </div>

              <div className="mb-3 flex items-center justify-between text-sm text-gray-400">
          <span>
            Прогресс: {task.progress}/{task.target}
          </span>
                  <span>{progressPercent}%</span>
              </div>

              <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00FF85] to-[#00C853] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
              </div>

              <div className="mb-5 text-sm">
                  <span className="text-gray-400">Статус: </span>
                  {isClaimed ? (
                    <span className="text-gray-400">Награда получена</span>
                  ) : isReady ? (
                    <span className="text-[#00FF85]">Готово к получению</span>
                  ) : (
                    <span className="text-yellow-400">В процессе</span>
                  )}
              </div>

              {isClaimed ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-400"
                >
                    Награда уже получена
                </button>
              ) : isReady ? (
                <button
                  type="button"
                  onClick={() => handleClaim(task)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] hover:scale-[1.02] transition"
                >
                    Забрать награду
                </button>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-400"
                >
                    Задание не выполнено
                </button>
              )}
          </div>
        );
    }

    return (
      <div className="min-h-screen p-6 text-white">
          <div className="mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 shadow-[0_0_80px_rgba(0,255,133,0.05)] md:p-8">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                      <div className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
                          Геймификация
                      </div>
                      <h1 className="mb-3 text-3xl font-bold md:text-4xl">Задания</h1>
                      <p className="max-w-2xl text-gray-400">
                          Выполняйте ежедневные и долгосрочные задания, чтобы получать XP и
                          StrikeCoin.
                      </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#111827] p-5">
                      <div className="mb-2 text-sm text-gray-400">Раздел кабинета</div>
                      <div className="text-xl font-semibold text-white">
                          Активности пользователя
                      </div>
                  </div>
              </div>
          </div>

          <div className="mb-8">
              <div className="mb-4 text-sm uppercase tracking-[0.16em] text-gray-500">
              Ежедневные задания
          </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  {dailyTasks.map(renderTaskCard)}
              </div>
          </div>

          <div className="mb-10">
              <div className="mb-4 text-sm uppercase tracking-[0.16em] text-gray-500">
                  Долгосрочные цели
              </div>
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                  {longTermTasks.map(renderTaskCard)}
              </div>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
          >
              ← Вернуться в профиль
          </Link>
      </div>
    );
}