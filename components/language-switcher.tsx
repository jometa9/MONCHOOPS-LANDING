"use client";

import { setLocale } from "@/i18n/actions";
import { type Locale } from "@/i18n/config";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "default" | "compact";
}

export function LanguageSwitcher({
  className = "",
  variant = "default",
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();

  const handleChange = (locale: Locale) => {
    if (locale === currentLocale || isPending) return;
    startTransition(async () => {
      await setLocale(locale);
      window.location.reload();
    });
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => handleChange(currentLocale === "en" ? "es" : "en")}
        disabled={isPending}
        aria-label="Toggle language"
        className={`inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50 ${className}`}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="uppercase">{currentLocale === "en" ? "EN" : "ES"}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white p-0.5 text-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => handleChange("en")}
        disabled={isPending}
        className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
          currentLocale === "en"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleChange("es")}
        disabled={isPending}
        className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
          currentLocale === "es"
            ? "bg-gray-900 text-white"
            : "text-gray-500 hover:text-gray-800"
        }`}
      >
        ES
      </button>
    </div>
  );
}
