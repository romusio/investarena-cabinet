import Link from 'next/link';

export default function HomePage() {
  return (
      <div className="min-h-screen px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-panel/60 px-4 py-2 shadow-glow">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-neon" />
            <span className="text-sm text-muted">INVESTARENA • клиентский кабинет</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight">
            Личный кабинет клиента
            <span className="text-accent"> с геймификацией</span>
          </h1>

          <p className="mt-3 text-muted max-w-2xl">
            Вход, профиль, прогресс, уровни и мотивация к регулярному использованию сервиса.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
                className="rounded-pill bg-white text-black px-6 py-3 font-medium transition hover:opacity-90 active:scale-[0.99]"
                href="/login"
            >
              Войти
            </Link>
            <Link
                className="rounded-pill border border-white/20 bg-panel/40 px-6 py-3 font-medium transition hover:border-white/35 hover:bg-panel/60 active:scale-[0.99]"
                href="/register"
            >
              Регистрация
            </Link>
            <Link className="rounded-pill border border-white/10 px-6 py-3 text-muted hover:text-text" href="/dashboard">
              Кабинет →
            </Link>
          </div>
        </div>
      </div>
  );
}
