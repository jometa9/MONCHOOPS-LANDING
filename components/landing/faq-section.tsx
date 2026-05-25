"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

const LANDING_FAQ_IDS = [
  "whatIsMonchoops",
  "isItFree",
  "isItSafe",
  "howManyAccounts",
  "doINeedProxies",
  "noDuplicateDms",
  "cloudVsLocal",
] as const;

export function FAQSection() {
  const t = useTranslations("faq");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-3xl">
      {LANDING_FAQ_IDS.map((id) => (
        <div key={id} className="rounded-lg overflow-hidden py-2">
          <button
            onClick={() => toggleItem(id)}
            className="w-full flex justify-between items-center text-gray-600 text-left hover:text-gray-400 cursor-pointer"
          >
            <h3 className="pr-3 ">{t(`${id}.q`)}</h3>
          </button>
          {openItems[id] && (
            <div className="py-3 text-sm text-gray-400 max-w-xl">
              {t(`${id}.a`)}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
