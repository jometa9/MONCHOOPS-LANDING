"use client";

import {
  AtSign,
  Bell,
  Boxes,
  Database,
  Globe,
  Heart,
  History,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">What MonchoOps does</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          Seven tools. One outcome: more replies, less manual work.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto">
          {/* Row 1: dark-gray | dark-blue | light-gray */}
          <div className="flex flex-col pt-18 pb-8 p-6 bg-gray-900 rounded-lg overflow-hidden">
            <Database className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Thousands of qualified leads in one afternoon
            </h3>
            <p className="text-gray-300 text-sm">
              Scrape from any competitor, post, hashtag or location — straight from your own account.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-[#03618d] text-white rounded-lg">
            <Globe className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-2">
              Look human to Instagram
            </h3>
            <p className="text-gray-100 text-sm">
              Your proxy + isolated Chromium profile per account. Real device, real session.
            </p>
          </div>

          <VisualCard
            variant="gray"
            stat="∞"
            label="accounts running in parallel"
            floatingIcons={[
              { Icon: Boxes, top: "10%", left: "14%", size: "h-12 w-12", rotate: "-16deg", opacity: "opacity-25" },
              { Icon: Users, top: "20%", right: "12%", size: "h-10 w-10", rotate: "18deg", opacity: "opacity-30" },
              { Icon: Send, bottom: "16%", left: "18%", size: "h-11 w-11", rotate: "10deg", opacity: "opacity-25" },
              { Icon: Zap, bottom: "12%", right: "16%", size: "h-14 w-14", rotate: "-24deg", opacity: "opacity-20" },
              { Icon: Sparkles, top: "48%", left: "46%", size: "h-8 w-8", rotate: "28deg", opacity: "opacity-30" },
            ]}
          />

          {/* Row 2: light-sky | dark-purple | dark-indigo */}
          <VisualCard
            variant="sky"
            stat="1,000+"
            label="DMs / day per account"
            floatingIcons={[
              { Icon: Send, top: "10%", left: "12%", size: "h-10 w-10", rotate: "-18deg", opacity: "opacity-30" },
              { Icon: Heart, top: "20%", right: "14%", size: "h-12 w-12", rotate: "14deg", opacity: "opacity-25" },
              { Icon: MessageCircle, bottom: "16%", left: "18%", size: "h-14 w-14", rotate: "8deg", opacity: "opacity-30" },
              { Icon: AtSign, bottom: "12%", right: "20%", size: "h-9 w-9", rotate: "-22deg", opacity: "opacity-35" },
              { Icon: Sparkles, top: "48%", left: "46%", size: "h-8 w-8", rotate: "26deg", opacity: "opacity-30" },
            ]}
          />

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-purple-900 hover:bg-purple-800 transition-colors rounded-lg">
            <Send className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              No two DMs alike
            </h3>
            <p className="text-gray-200 text-sm">
              20 message variants per group, rotated at random with{" "}
              <code className="text-purple-200">{"{{username}}"}</code> per recipient.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-indigo-700 hover:bg-indigo-800 transition-colors rounded-lg">
            <ShieldCheck className="h-6 w-6 text-indigo-100 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Never DM the same prospect twice
            </h3>
            <p className="text-indigo-100 text-sm">
              Every recipient logged forever. New campaigns auto-skip anyone you&apos;ve already messaged.
            </p>
          </div>

          {/* Row 3: dark-orange | light-rose | dark-emerald */}
          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-orange-700 hover:bg-orange-800 transition-colors rounded-lg">
            <Bell className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Show up in their notifications first
            </h3>
            <p className="text-orange-50 text-sm">
              Optional pre-DM follow, like and story-watch — so your DM lands on a face they recognize.
            </p>
          </div>

          <VisualCard
            variant="rose"
            stat="20"
            label="message variants per campaign"
            floatingIcons={[
              { Icon: ShieldCheck, top: "8%", left: "16%", size: "h-12 w-12", rotate: "-14deg", opacity: "opacity-25" },
              { Icon: Users, top: "22%", right: "10%", size: "h-10 w-10", rotate: "20deg", opacity: "opacity-30" },
              { Icon: UserPlus, bottom: "18%", left: "12%", size: "h-9 w-9", rotate: "12deg", opacity: "opacity-30" },
              { Icon: Zap, bottom: "10%", right: "18%", size: "h-14 w-14", rotate: "-26deg", opacity: "opacity-22" },
              { Icon: Sparkles, top: "50%", left: "44%", size: "h-8 w-8", rotate: "30deg", opacity: "opacity-30" },
            ]}
          />

          <div className="flex flex-col pt-18 pb-8 p-6 rounded-lg bg-emerald-800 hover:bg-emerald-900 transition-colors">
            <History className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-3 text-white">
              Every DM logged. Every recipient tracked.
            </h3>
            <p className="text-emerald-50 text-sm">
              Open any past campaign: who, what, when — with deep-links to the profile and the DM thread.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface FloatingIcon {
  Icon: React.ComponentType<{ className?: string }>;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size: string;
  rotate: string;
  opacity: string;
}

function VisualCard({
  variant,
  stat,
  label,
  floatingIcons,
}: {
  variant: "sky" | "rose" | "indigo" | "emerald" | "amber" | "gray";
  stat: string;
  label: string;
  floatingIcons: FloatingIcon[];
}) {
  const palettes = {
    sky: {
      bg: "bg-gradient-to-br from-sky-50 via-white to-sky-100",
      blob1: "bg-sky-400/40",
      blob2: "bg-cyan-500/30",
      blob3: "bg-sky-300/30",
      iconStroke: "stroke-sky-500 text-sky-500",
      stat: "text-sky-700",
      label: "text-gray-600",
    },
    rose: {
      bg: "bg-gradient-to-br from-rose-50 via-white to-rose-100",
      blob1: "bg-rose-400/40",
      blob2: "bg-pink-500/30",
      blob3: "bg-fuchsia-300/30",
      iconStroke: "stroke-rose-500 text-rose-500",
      stat: "text-rose-700",
      label: "text-gray-600",
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-50 via-white to-indigo-100",
      blob1: "bg-indigo-400/40",
      blob2: "bg-indigo-500/30",
      blob3: "bg-violet-300/30",
      iconStroke: "stroke-indigo-500 text-indigo-500",
      stat: "text-indigo-700",
      label: "text-gray-600",
    },
    emerald: {
      bg: "bg-gradient-to-br from-emerald-50 via-white to-emerald-100",
      blob1: "bg-emerald-400/40",
      blob2: "bg-teal-500/30",
      blob3: "bg-emerald-300/30",
      iconStroke: "stroke-emerald-500 text-emerald-500",
      stat: "text-emerald-700",
      label: "text-gray-600",
    },
    amber: {
      bg: "bg-gradient-to-br from-amber-50 via-white to-amber-100",
      blob1: "bg-amber-400/40",
      blob2: "bg-yellow-500/30",
      blob3: "bg-orange-300/30",
      iconStroke: "stroke-amber-500 text-amber-500",
      stat: "text-amber-700",
      label: "text-gray-600",
    },
    gray: {
      bg: "bg-gradient-to-br from-gray-50 via-white to-gray-200",
      blob1: "bg-gray-400/40",
      blob2: "bg-slate-500/25",
      blob3: "bg-zinc-300/30",
      iconStroke: "stroke-gray-500 text-gray-500",
      stat: "text-gray-800",
      label: "text-gray-600",
    },
  };
  const p = palettes[variant];

  return (
    <div
      className={`relative flex items-center justify-center py-18 p-6 rounded-lg overflow-hidden border border-gray-200 ${p.bg}`}
    >
      <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl pointer-events-none ${p.blob1}`} />
      <div className={`absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-3xl pointer-events-none ${p.blob2}`} />
      <div className={`absolute top-1/2 left-1/3 h-56 w-56 rounded-full blur-3xl pointer-events-none ${p.blob3}`} />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map(({ Icon, top, left, right, bottom, size, rotate, opacity }, i) => (
          <Icon
            key={i}
            className={`${size} ${p.iconStroke} ${opacity} absolute`}
            // @ts-expect-error inline style positioning
            style={{ top, left, right, bottom, transform: `rotate(${rotate})` }}
          />
        ))}
      </div>
      <div className="relative z-10 text-center px-2">
        <p className={`text-5xl font-semibold ${p.stat}`}>{stat}</p>
        <p className={`mt-2 text-sm ${p.label}`}>{label}</p>
      </div>
    </div>
  );
}
