"use client";

import { Linkedin } from "lucide-react";

export function FounderCard() {
  return (
    <div className="bg-gray-100 rounded-lg p-3 ">
      <img
        src="/assets/founder4.png"
        alt="Founder"
        className="w-1/3 object-cover rounded-lg border border-gray-200"
      />
      <p className="text-gray-600 text-2xl mt-2">Joaquin Metayer</p>
      <p className="text-gray-400 text-sm mt-1">Founder & Software Engineer — MonchoOps</p>
      <p className="text-gray-600 text-sm mt-3 max-w-xs font-medium">
        I run my own SaaS products and kept hitting the same wall: Meta Ads
        getting more expensive, accounts flagged, campaigns disabled overnight.
        I built MonchoOps to generate leads at scale on Instagram without
        depending on ads — scrape prospects, DM them in bulk, own the channel.
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
