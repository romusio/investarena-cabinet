"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type LedgerItem = {
  id: string;
  type: "EARN" | "SPEND" | "ADJUST";
  amount: number;
  reason: string | null;
  createdAt: string;
  redemption?: {
    id: string;
    itemTitle: string;
    itemType: string;
    costPoints: number;
    createdAt: string;
  } | null;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<LedgerItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${API}/wallet/ledger`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      setLoading(false);
      return;
    }

    const data = await res.json();
    setHistory(data);
    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getTitle(item: LedgerItem) {
    if (item.redemption?.itemTitle) {
      return "Обмен в магазине";
    }

    if (item.type === "EARN") return "Начисление StrikeCoin";
    if (item.type === "SPEND") return "Списание StrikeCoin";
    return "Изменение баланса";
  }

  function getDescription(item: LedgerItem) {
    if (item.redemption?.itemTitle) {
      return item.redemption.itemTitle;
    }

    return item.reason || "Операция без описания";
  }

  function getIcon(item: LedgerItem) {
    if (item.redemption?.itemTitle) return "🎁";
    if (item.type === "EARN") return "🪙";
    if (item.type === "SPEND") return "💳";
    return "⚙️";
  }

  function getAmountLabel(item: LedgerItem) {
    const sign = item.type === "SPEND" ? "-" : "+";
    return `${sign}${item.amount} StrikeCoin`;
  }

  function isPositive(item: LedgerItem) {
    return item.type !== "SPEND";
  }

  const earnedCoin = history
    .filter((item) => item.type === "EARN")
    .reduce((sum, item) => sum + item.amount, 0);

  const spentCoin = history
    .filter((item) => item.type === "SPEND")
    .reduce((sum, item) => sum + item.amount, 0);

  if (loading) {
    return <div className="p-6 text-white">Загрузка истории...</div>;
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] shadow-[0_0_80px_rgba(0,255,133,0.05)] p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <div className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2">
              История
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Операции по балансу
            </h1>

            <p className="text-gray-400 max-w-2xl">
              Здесь отображаются начисления и списания StrikeCoin, включая обмен
              наград в магазине.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">
            <div className="text-sm text-gray-400 mb-2">Последняя операция</div>
            <div className="text-xl font-semibold text-white mb-2">
              {history[0] ? getTitle(history[0]) : "Нет данных"}
            </div>
            <div className="text-sm text-gray-400">
              {history[0] ? formatDate(history[0].createdAt) : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">
            Получено StrikeCoin
          </div>
          <div className="text-3xl font-bold text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.25)]">
            +{earnedCoin}
          </div>
          <div className="text-sm text-gray-500 mt-2">Всего начислено</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-gray-500 mb-2">
            Потрачено StrikeCoin
          </div>
          <div className="text-3xl font-bold text-red-400">-{spentCoin}</div>
          <div className="text-sm text-gray-500 mt-2">Всего списано</div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-sm text-gray-400 mb-2">Лента событий</div>
            <div className="text-2xl font-semibold tracking-tight text-white">
              Последние операции
            </div>
          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
            Всего записей: {history.length}
          </div>
        </div>

        <div className="space-y-4">
          {history.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-gray-400">
              История пока пуста
            </div>
          )}

          {history.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-[#00FF85]/20 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#0f172a] flex items-center justify-center text-2xl shrink-0">
                    {getIcon(item)}
                  </div>

                  <div>
                    <div className="text-lg font-semibold text-white mb-1">
                      {getTitle(item)}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {getDescription(item)}
                    </div>
                    <div className="text-xs uppercase tracking-[0.14em] text-gray-500">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                </div>

                <div
                  className={`text-lg font-semibold ${
                    isPositive(item)
                      ? "text-[#00FF85] drop-shadow-[0_0_8px_rgba(0,255,133,0.20)]"
                      : "text-red-400"
                  }`}
                >
                  {getAmountLabel(item)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}