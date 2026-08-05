import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học Tiếng Trung & Tiếng Anh Công Xưởng - AI PWA App",
  description: "Ứng dụng học ngôn ngữ chuyên sâu dành cho kỹ thuật viên & công nhân nhà máy. Tra cứu từ điển, luyện phát âm IPA/Hán ngữ, ngữ pháp & flashcards SRS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
