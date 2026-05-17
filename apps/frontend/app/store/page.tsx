"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useNotifications } from "../components/notifications/NotificationProvider";
import { unlock } from 'next/dist/next-devtools/dev-overlay/components/overlay/body-locker';

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

type RewardItem = {
  id: string;
  title: string;
  type: "CASHBACK" | "GAME_HOURS" | "MERCH";
  costPoints: number;
  value: number | null;
  stock: number | null;
  isActive: boolean;
};

type Wallet = {
  xp: number;
  level: number;
  points: number;
  email: string;
  fullName: string | null;
};

const extraItems: RewardItem[] = [
  {
    id: "mock-cap",
    title: "Мерч: кепка",
    type: "MERCH",
    costPoints: 600,
    value: null,
    stock: 8,
    isActive: true,
  },
  {
    id: "mock-mousepad",
    title: "Мерч: коврик",
    type: "MERCH",
    costPoints: 700,
    value: null,
    stock: 6,
    isActive: true,
  },
  {
    id: "mock-notebook",
    title: "Мерч: блокнот",
    type: "MERCH",
    costPoints: 400,
    value: null,
    stock: 12,
    isActive: true,
  },
  {
    id: "mock-jacket",
    title: "Мерч: куртка",
    type: "MERCH",
    costPoints: 2000,
    value: null,
    stock: 3,
    isActive: true,
  },
  {
    id: "mock-socks",
    title: "Мерч: носки",
    type: "MERCH",
    costPoints: 300,
    value: null,
    stock: 10,
    isActive: true,
  },
];
export default function StorePage() {
  const [items, setItems] = useState<RewardItem[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "MERCH" | "GAME_HOURS" | "CASHBACK">("ALL");

  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const [activeImages, setActiveImages] = useState<Record<string, number>>({});
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const { showToast, pushNotification } = useNotifications();

  async function loadData() {
    const token = localStorage.getItem("accessToken");

    const [itemsRes, walletRes] = await Promise.all([
      fetch(`${API}/rewards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch(`${API}/wallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (itemsRes.ok) {
      const itemsData = await itemsRes.json();

      const merged = [...itemsData];

      for (const extra of extraItems) {
        const exists = merged.some(
          (item) => item.title.toLowerCase() === extra.title.toLowerCase()
        );

        if (!exists) {
          merged.push(extra);
        }
      }

      setItems(merged);
    }
    if (walletRes.ok) {
      const walletData = await walletRes.json();
      setWallet(walletData);
    }

    setLoading(false);
  }

  async function unlockOpenStoreAchievement() {
    const token = localStorage.getItem("accessToken");

    await fetch(`${API}/achievements/unlock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ key: "open_store" }),
    }).catch(() => null);
  }

  useEffect(() => {
    loadData();
    unlockOpenStoreAchievement()
  }, []);

  function rewardTypeLabel(type: RewardItem["type"]) {
    if (type === "CASHBACK") return "Цифровая награда";
    if (type === "GAME_HOURS") return "Игровое время";
    return "Мерч";
  }

  function rewardTypeBadge(type: RewardItem["type"]) {
    if (type === "CASHBACK") return "StrikeCoin Bonus";
    if (type === "GAME_HOURS") return "Gaming Reward";
    return "Merch Drop";
  }

  function rewardImages(item: RewardItem) {
    const title = item.title.toLowerCase();

    if (title.includes("коврик")) {
      return ["/images/store/mousepad.jpg", "/images/store/mousepad2.jpg"];
    }

    if (title.includes("блокнот")) {
      return ["/images/store/notebook.png", "/images/store/notebook2.png"];
    }

    if (title.includes("носки")) {
      return ["/images/store/socks.png",
              "/images/store/socks-white.png",
              "/images/store/socks-black.png",];
    }

    if (title.includes("кепка")) {
      return ["/images/store/cap.png", "/images/store/cap2.png"];
    }

    if (title.includes("футболка")) {
      return ["/images/store/t-shirt-front.png", "/images/store/t-shirt-back.png"];
    }

    if (title.includes("худи") || title.includes("свитшот")) {
      return ["/images/store/hoodie.png", "/images/store/hoodie2.png"];
    }

    if (title.includes("куртка")) {
      return ["/images/store/jacket.png", "/images/store/jacket2.png"];
    }

    if (item.type === "CASHBACK") {
      return ["/images/ui/coin.png"];
    }

    if (item.type === "GAME_HOURS") {
      return ["/images/ui/coin.png"];
    }

    return ["/images/store/mousepad.jpg"];
  }

  function rewardDescription(item: RewardItem) {
    const title = item.title.toLowerCase();

    if (title.includes("коврик")) {
      return "Большой игровой коврик Strike Arena для рабочего места и игровой станции.";
    }

    if (title.includes("блокнот")) {
      return "Фирменный блокнот Strike Arena с игровым оформлением и минималистичным дизайном.";
    }

    if (title.includes("носки")) {
      return "Фирменные носки Strike Arena для повседневного мерча.";
    }

    if (title.includes("кепка")) {
      return "Кепка Strike Arena в фирменной стилистике бренда.";
    }

    if (title.includes("футболка")) {
      return "Футболка Strike Arena с фирменным принтом и стильной игровой подачей.";
    }

    if (title.includes("худи") || title.includes("свитшот")) {
      return "Теплый верх Strike Arena для мерча, команды и лояльных пользователей.";
    }

    if (title.includes("куртка")) {
      return "Премиальная куртка Strike Arena в фирменной стилистике бренда.";
    }

    if (item.type === "CASHBACK") {
      return "Цифровая награда, которую можно обменять за StrikeCoin.";
    }

    if (item.type === "GAME_HOURS") {
      return "Игровые часы для использования внутри системы наград.";
    }

    return "Награда из магазина Strike Arena.";
  }

  function rewardValueLabel(item: RewardItem) {
    if (item.type === "GAME_HOURS") return "Часы";
    if (item.type === "CASHBACK") return "Бонус";
    return "Предмет";
  }

  function getActiveImage(itemId: string) {
    return activeImages[itemId] ?? 0;
  }

  function nextImage(itemId: string, total: number) {
    setActiveImages((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] ?? 0) + 1) % total,
    }));
  }

  function prevImage(itemId: string, total: number) {
    setActiveImages((prev) => ({
      ...prev,
      [itemId]: ((prev[itemId] ?? 0) - 1 + total) % total,
    }));
  }

  function setImage(itemId: string, index: number) {
    setActiveImages((prev) => ({
      ...prev,
      [itemId]: index,
    }));
  }

  function openRedeemModal(item: RewardItem) {
    setSelectedItem(item);
    setModalImageIndex(0);
  }

  function closeRedeemModal() {
    if (redeeming) return;
    setSelectedItem(null);
    setModalImageIndex(0);
  }

  function nextModalImage(total: number) {
    setModalImageIndex((prev) => (prev + 1) % total);
  }

  function prevModalImage(total: number) {
    setModalImageIndex((prev) => (prev - 1 + total) % total);
  }

  async function confirmRedeem() {
    if (!selectedItem) return;

    const token = localStorage.getItem("accessToken");
    setRedeeming(true);

    try {
      const res = await fetch(`${API}/rewards/redeem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rewardId: selectedItem.id }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        showToast(data?.message || "Ошибка обмена", "error");
        pushNotification({
          title: "Ошибка обмена",
          description: data?.message || "Не удалось купить товар",
          type: "error",
        });
        setRedeeming(false);
        return;
      }

      showToast(`Товар "${selectedItem.title}" успешно куплен`, "success");
      pushNotification({
        title: "Покупка успешно завершена",
        description: `Вы приобрели: "${selectedItem.title}"`,
      type: "success",
    });

      setSelectedItem(null);
      setModalImageIndex(0);
      await loadData();
    } catch {
      showToast("Не удалось выполнить обмен", "error");
      pushNotification({
        title: "Ошибка обмена",
        description: "Не удалось выполнить обмен",
        type: "error",
      });
    } finally {
      setRedeeming(false);
    }
  }

  const projectedBalance = useMemo(() => {
    if (!selectedItem || !wallet) return null;
    return wallet.points - selectedItem.costPoints;
  }, [selectedItem, wallet]);

  const merchCount = items.filter((item) => item.type === "MERCH").length;
  const digitalCount = items.filter((item) => item.type !== "MERCH").length;
  const filteredItems = items.filter((item) => {
    if (filter === "ALL") return true;
    return item.type === filter;
  });

  if (loading) {
    return <div className="p-6 text-white">Загрузка магазина...</div>;
  }

  return (
    <div className="min-h-screen p-6 text-white">
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f172a] to-[#020617] p-6 shadow-[0_0_80px_rgba(0,255,133,0.05)] md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          //style={{ backgroundImage: "url('/images/bg/bg-main.jpeg')" }}
        />
      </div>

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="mb-2 text-sm uppercase tracking-[0.2em] text-gray-400">
            Магазин наград
          </div>
          <h1 className="mb-3 text-3xl font-bold md:text-4xl">
            Обмен StrikeCoin
          </h1>
          <p className="max-w-2xl text-gray-400">
            Используйте накопленные StrikeCoin для обмена на игровые бонусы,
            кэшбэк и фирменный мерч Strike Arena.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Мерч: {merchCount}
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
              Цифровые награды: {digitalCount}
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { label: "Все", value: "ALL" },
                { label: "Мерч", value: "MERCH" },
                { label: "Игровое", value: "GAME_HOURS" },
                { label: "Кэшбэк", value: "CASHBACK" },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value as any)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    filter === btn.value
                      ? "bg-[#00FF85] text-black border-[#00FF85]"
                      : "bg-white/5 text-gray-300 border-white/10 hover:border-[#00FF85]/40 hover:text-white"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-w-[280px] rounded-2xl border border-white/10 bg-[#111827]/90 p-5 backdrop-blur">
          <div className="mb-2 text-sm text-gray-400">Ваш баланс</div>

          <div className="flex items-center gap-3">
            <Image
              src="/images/ui/coin.png"
              alt="StrikeCoin"
              width={42}
              height={42}
              className="rounded-full object-contain"
            />
            <div className="text-4xl font-bold text-[#00FF85] drop-shadow-[0_0_10px_rgba(0,255,133,0.35)]">
              {wallet?.points ?? 0}
            </div>
          </div>

          <div className="mt-2 text-gray-400">StrikeCoin</div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-1 text-xs uppercase tracking-[0.14em] text-gray-500">
                Уровень
              </div>
              <div className="text-lg font-semibold">{wallet?.level ?? 1}</div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="mb-1 text-xs uppercase tracking-[0.14em] text-gray-500">
                XP
              </div>
              <div className="text-lg font-semibold">{wallet?.xp ?? 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const canBuy = (wallet?.points ?? 0) >= item.costPoints;
          const outOfStock = item.stock !== null && item.stock <= 0;

          const images = rewardImages(item);
          const currentIndex = getActiveImage(item.id);
          const currentImage = images[currentIndex];

          return (
            <div
              key={item.id}
              className={`group overflow-hidden rounded-3xl border p-5 transition ${
                outOfStock
                  ? "border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] opacity-70"
                  : "border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] hover:-translate-y-1 hover:border-[#00FF85]/30 hover:shadow-[0_0_35px_rgba(0,255,133,0.10)]"
              }`}
            >
              <div className="relative mb-5 h-60 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]">
                <Image
                  src={currentImage}
                  alt={item.title}
                  fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => prevImage(item.id, images.length)}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg text-white transition hover:bg-black/70"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      onClick={() => nextImage(item.id, images.length)}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg text-white transition hover:bg-black/70"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setImage(item.id, index)}
                          className={`h-2.5 w-2.5 rounded-full transition ${
                            index === currentIndex ? "bg-[#00FF85]" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.16em] text-gray-500">
                    {rewardTypeBadge(item.type)}
                  </div>
                  <div className="text-2xl font-bold leading-tight text-white">
                    {item.title}
                  </div>
                </div>

                <div className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                  {item.costPoints} SC
                </div>
              </div>

              <div className="mb-5 text-sm leading-relaxed text-gray-400">
                {rewardDescription(item)}
              </div>

              <div className="mb-6 space-y-2 text-sm text-gray-400">
                <div>
                  Тип:{" "}
                  <span className="text-white/90">{rewardTypeLabel(item.type)}</span>
                </div>

                <div>
                  Статус:{" "}
                  <span className={outOfStock ? "text-red-400" : "text-[#00FF85]"}>
                    {outOfStock ? "Нет в наличии" : "Доступно"}
                  </span>
                </div>

                {item.value !== null && (
                  <div>
                    {rewardValueLabel(item)}:{" "}
                    <span className="text-white/90">{item.value}</span>
                  </div>
                )}

                {item.stock !== null && (
                  <div>
                    Остаток: <span className="text-white/90">{item.stock}</span>
                  </div>
                )}
              </div>

              {outOfStock ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-500"
                >
                  Нет в наличии
                </button>
              ) : canBuy ? (
                <button
                  onClick={() => openRedeemModal(item)}
                  className="w-full rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-4 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] transition hover:scale-[1.02]"
                >
                  Обменять
                </button>
              ) : (
                <button
                 disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-gray-400"
                >
                Недостаточно StrikeCoin
                </button>
                )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <Link
          href="/profile"
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
        >
          ← Вернуться в профиль
        </Link>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#111827] to-[#0b1020] shadow-[0_0_50px_rgba(0,0,0,0.45)]">
            <div className="grid grid-cols-1 xl:grid-cols-2">
              <div className="relative min-h-[360px] bg-[#0f172a]">
                {(() => {
                  const modalImages = rewardImages(selectedItem);
                  const modalCurrent = modalImages[modalImageIndex];

                  return (
                    <>
                      <Image
                        src={modalCurrent}
                        alt={selectedItem.title}
                        fill
                        sizes="(max-width: 1280px) 100vw, 50vw"
                        className="object-cover"
                      />

                      {modalImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => prevModalImage(modalImages.length)}
                            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg text-white transition hover:bg-black/70"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            onClick={() => nextModalImage(modalImages.length)}
                            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg text-white transition hover:bg-black/70"
                          >
                            ›
                          </button>

                          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                            {modalImages.map((_, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => setModalImageIndex(index)}
                                className={`h-2.5 w-2.5 rounded-full transition ${
                                  index === modalImageIndex ? "bg-[#00FF85]" : "bg-white/40"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              <div className="p-6 md:p-8">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-2 text-sm uppercase tracking-[0.16em] text-gray-500">
                      Подтверждение обмена
                    </div>
                    <div className="text-3xl font-bold leading-tight text-white">
                      {selectedItem.title}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeRedeemModal}
                    disabled={redeeming}
                   className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:border-white/20"
                  >
                  ✕
                </button>
              </div>

              <div className="mb-5 text-sm leading-relaxed text-gray-400">
                {rewardDescription(selectedItem)}
              </div>

              <div className="mb-6 space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                    <span>Тип награды</span>
                    <span className="text-white">
                        {rewardTypeLabel(selectedItem.type)}
                      </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                    <span>Стоимость</span>
                    <span className="font-semibold text-[#00FF85]">
                        {selectedItem.costPoints} StrikeCoin
                      </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
                    <span>Баланс сейчас</span>
                    <span className="font-semibold text-white">
                        {wallet?.points ?? 0}
                      </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>После обмена</span>
                    <span className="font-semibold text-white">
                        {projectedBalance ?? 0}
                      </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
                  После подтверждения стоимость награды будет списана с вашего
                  баланса StrikeCoin.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={confirmRedeem}
                  disabled={redeeming}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#00FF85] via-[#00FF85] to-[#00C853] px-5 py-3 text-sm font-semibold text-black shadow-[0_0_25px_rgba(0,255,133,0.30)] transition hover:scale-[1.02] disabled:opacity-70"
                >
                  {redeeming ? "Обрабатываем..." : "Подтвердить обмен"}
                </button>

                <button
                  type="button"
                  onClick={closeRedeemModal}
                  disabled={redeeming}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-[#00FF85]/30 hover:text-[#00FF85]"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
</div>
);
}