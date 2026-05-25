"use client";

import { STRINGS } from "@/lib/strings";
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
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-3xl">
      {LANDING_FAQ_IDS.map((id) => {
        const item = STRINGS.faq[id];
        return (
          <div key={id} className="rounded-lg overflow-hidden py-2">
            <button
              onClick={() => toggleItem(id)}
              className="w-full flex justify-between items-center text-gray-600 text-left hover:text-gray-400 cursor-pointer"
            >
              <h3 className="pr-3 ">{item.q}</h3>
            </button>
            {openItems[id] && (
              <div className="py-3 text-sm text-gray-400 max-w-xl">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
