import { MonchoWatermark } from "@/components/layout/moncho-watermark";
import { NextAuthProvider } from "@/lib/auth/nextauth-provider";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthProvider>
      <div className="relative isolate min-h-screen overflow-hidden bg-white text-neutral-900">
        <MonchoWatermark />
        <div className="flex min-h-screen flex-col items-center justify-center px-3 py-12 pt-28">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </NextAuthProvider>
  );
}
