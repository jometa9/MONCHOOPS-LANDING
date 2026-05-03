"use client";

import { Database, History, Layers, Shuffle } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      Icon: Database,
      title: "Thousands of qualified leads in one afternoon",
      description:
        "Scrape from any competitor, post, hashtag or location — straight from your own account.",
      bg: "bg-indigo-600",
    },
    {
      Icon: Layers,
      title: "20+ accounts running in parallel",
      description:
        "Each account on its own proxy and isolated Chromium profile. Real device, real session.",
      bg: "bg-indigo-800",
    },
    {
      Icon: Shuffle,
      title: "20 unique message variants per campaign",
      description:
        "Rotated at random with {{username}} per recipient — no two DMs look alike.",
      bg: "bg-indigo-950",
    },
    {
      Icon: History,
      title: "Full DM history, every reply tracked",
      description:
        "Open any past campaign: who, what, when — with deep-links to the profile and the DM thread.",
      bg: "bg-gray-950",
    },
  ];

  return (
    <section id="features" className="scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">What MonchoOps does</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          More replies, less manual work.
        </h2>
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
