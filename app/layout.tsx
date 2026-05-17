import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "修图魔法铺",
  description: "把一句修图想法整理成可复制的提示词。",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
