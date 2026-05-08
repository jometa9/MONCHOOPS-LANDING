"use client";

import { Database, History, Layers, Shuffle } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeaturesSection() {
  const t = useTranslations("features");

  const features = [
    {
      Icon: Database,
      title: t("leadsTitle"),
      description: t("leadsDescription"),
      bg: "bg-indigo-600",
    },
    {
      Icon: Layers,
      title: t("parallelTitle"),
      description: t("parallelDescription"),
      bg: "bg-indigo-800",
    },
    {
      Icon: Shuffle,
      title: t("variantsTitle"),
      description: t("variantsDescription"),
      bg: "bg-indigo-950",
    },
    {
      Icon: History,
      title: t("historyTitle"),
      description: t("historyDescription"),
      bg: "bg-gray-950",
    },
  ];

  return (
    <section id="features" className="scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">{t("eyebrow")}</p>
        <h2 className="text-3xl text-gray-900 mb-6">{t("heading")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mx-auto">
          {features.map(({ Icon, title, description, bg }) => (
            <div
              key={title}
              className={`flex flex-col pt-18 pb-8 p-6 ${bg} rounded-lg overflow-hidden`}
            >
              <Icon className="h-6 w-6 text-gray-200 mb-3" />
              <h3 className="text-2xl mb-2 text-white">{title}</h3>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
