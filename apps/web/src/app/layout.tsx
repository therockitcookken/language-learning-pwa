import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Học Tiếng Trung & Tiếng Anh Công Xưởng - AI PWA App",
  description: "Ứng dụng học ngôn ngữ chuyên sâu dành cho kỹ thuật viên & công nhân nhà máy. Tra cứu từ điển, luyện phát âm IPA/Hán ngữ, ngữ pháp & flashcards SRS.",
  manifest: "/manifest.json",
  themeColor: "#030712",
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
