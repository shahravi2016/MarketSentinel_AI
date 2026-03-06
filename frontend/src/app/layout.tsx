import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Sentinel AI",
  description: "MarketSentinel AI is a context-aware financial anomaly detection system designed to identify unusual and potentially manipulative stock market activity. The platform analyzes historical and real-time market data using machine learning techniques such as Isolation Forest to detect abnormal price movements, volume spikes, and volatility patterns. It also evaluates contextual factors like market correlation and news events to determine whether a price movement is justified or suspicious. By combining statistical anomaly detection with contextual reasoning, MarketSentinel AI helps highlight unexplained market behavior and provides transparent explanations behind each risk assessment.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
