import "./globals.css";
import Header from "./components/Header";
import { NotificationProvider } from "./components/notifications/NotificationProvider";
import Toast from "./components/notifications/Toast";

export default function RootLayout({children, }: {children: React.ReactNode;})
{
    return (
      <html lang="ru">
      <body className="min-h-screen text-white sa-bg">
      <NotificationProvider>
        <Header />
        <main className="min-h-screen px-4 pb-16">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
        <Toast />
      </NotificationProvider>
      </body>
      </html>
    );
}