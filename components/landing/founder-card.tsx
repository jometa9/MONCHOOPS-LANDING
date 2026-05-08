"use client";

import { Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

export function FounderCard() {
  const t = useTranslations("founder");
  return (
    <div className="bg-gray-100 rounded-lg p-3 ">
      <img
        src="/assets/founder4.png"
        alt="Founder"
        className="w-1/3 object-cover rounded-lg border border-gray-200"
      />
      <p className="text-gray-600 text-2xl mt-2">{t("name")}</p>
      <p className="text-gray-400 text-sm mt-1">{t("role")}</p>
      <p className="text-gray-600 text-sm mt-3 max-w-xs font-medium">
        {t("bio")}
      </p>
      <div className="flex items-center gap-3 py-3">
        <a
          href="https://www.linkedin.com/in/joaquinmetayer/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer hover:opacity-70 transition-opacity"
        >
          <Linkedin className="w-4 h-4 text-gray-600" />
        </a>
      </div>
    </div>
  );
}
