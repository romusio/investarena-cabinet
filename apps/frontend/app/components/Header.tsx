"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationBell from "./notifications/NotificationBell";

function NavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
          active
            ? "border-[#00FF85]/40 bg-white/5 text-white shadow-[0_0_12px_rgba(0,255,133,0.18)]"
            : "border-white/15 bg-white/5 text-white hover:border-[#00FF85]/30 hover:text-[#00FF85]"
        }`}
      >
          {label}
      </Link>
    );
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        setHasToken(!!localStorage.getItem("accessToken"));
    }, [pathname]);

    useEffect(() => {
        function syncAuthState() {
            setHasToken(!!localStorage.getItem("accessToken"));
        }

        window.addEventListener("storage", syncAuthState);
        window.addEventListener("auth-changed", syncAuthState);

        return () => {
            window.removeEventListener("storage", syncAuthState);
            window.removeEventListener("auth-changed", syncAuthState);
        };
    }, []);

    function logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.dispatchEvent(new Event("auth-changed"));
        setHasToken(false);
        router.push("/login");
    }

    return (
      <header className="sticky top-0 z-50 px-4 pt-6">
          <div className="max-w-6xl mx-auto rounded-[28px] border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl px-5 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                  <Link href={hasToken ? "/profile" : "/login"} className="flex items-center gap-4 min-w-[220px]">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-black/20 flex items-center justify-center">
                          <Image
                            src="/strike-logo.png"
                            alt="Strike Arena"
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                      </div>

                      <div>
                          <div className="text-lg font-bold tracking-wide text-white">
                              STRIKE ARENA
                          </div>
                          <div className="text-xs text-gray-400">
                              геймифицированный личный кабинет
                          </div>
                      </div>
                  </Link>

                  <nav className="flex items-center gap-2 flex-wrap">
                      {hasToken ? (
                        <>
                            <NavLink href="/profile" label="Профиль" />
                            <NavLink href="/tasks" label="Задания" />
                            <NavLink href="/achievements" label="Достижения" />
                            <NavLink href="/store" label="Магазин" />
                            <NavLink href="/history" label="История" />

                            <NotificationBell />

                            <button
                              className="px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white hover:border-[#00FF85]/30 hover:text-[#00FF85] transition text-sm font-medium"
                              type="button"
                              onClick={logout}
                            >
                                Выйти
                            </button>
                        </>
                      ) : (
                        <>
                            <NavLink href="/login" label="Вход" />
                            <NavLink href="/register" label="Регистрация" />
                        </>
                      )}
                  </nav>
              </div>
          </div>
      </header>
    );
}