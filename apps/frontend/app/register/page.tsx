"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);

        try {
            const res = await fetch(`${API}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Ошибка регистрации");

            localStorage.setItem("accessToken", data.accessToken);
            router.push("/profile");
        } catch (e: any) {
            setErr(e.message || "Ошибка");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="pt-16">
            <div className="w-full max-w-md  mx-auto sa-card">
                <div className="flex items-center justify-between gap-3">
                    <div className="sa-badge">INVESTARENA • кабинет клиента</div>
                    <a className="text-white/60 text-sm hover:text-white" href="/login">
                        Вход
                    </a>
                </div>

                <h1 className="sa-title mt-5">Регистрация</h1>
                <p className="sa-subtitle">Создай аккаунт и начни получать опыт за действия.</p>

                <form className="mt-6 space-y-4" onSubmit={onSubmit}>
                    <div>
                        <div className="text-white/70 text-sm mb-2">ФИО</div>
                        <input
                            className="sa-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Иванов Иван Иванович"
                        />
                    </div>

                    <div>
                        <div className="text-white/70 text-sm mb-2">Email</div>
                        <input
                            className="sa-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <div className="text-white/70 text-sm mb-2">Пароль</div>
                        <input
                            className="sa-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Минимум 6 символов"
                            autoComplete="new-password"
                        />
                    </div>

                    {err && (
                        <div className="rounded-[18px] border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
                            {err}
                        </div>
                    )}

                    <button className="sa-btn sa-btn-primary w-full" disabled={loading}>
                        {loading ? "Создаём..." : "Создать аккаунт"}
                    </button>

                    <div className="text-white/50 text-xs leading-relaxed">
                        После регистрации ты попадёшь в личный кабинет.
                    </div>
                </form>
            </div>
        </div>
    );
}