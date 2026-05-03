"use client";

import { useEffect, useRef, useState } from "react";
import { MonchoOpsWindowDemo } from "@/components/landing/monchoops-window-demo";
import {
  CONNECT_SCRIPT,
  SCRAPE_SCRIPT,
  COLD_DM_SCRIPT,
  type Step,
} from "@/components/landing/window-demo-app/components/DemoAutoplay";

interface StepCard {
  index: number;
  eyebrow: string;
  title: string;
  description: string;
  script: Step[];
  reverse?: boolean;
  theme: "light" | "dark";
  glow?: "top-left" | "top-right";
}

const STEPS: StepCard[] = [
  {
    index: 1,
    eyebrow: "Step 1",
    title: "Connect your account",
    description:
      "Link as many Instagram accounts as your plan allows. Sign in with credentials or open a real browser window — MonchoOps stores the session locally and reuses it from then on. Each account runs in its own isolated Chromium profile, with an optional dedicated proxy.",
    script: CONNECT_SCRIPT,
    theme: "light",
    glow: "top-left",
  },
  {
    index: 2,
    eyebrow: "Step 2",
    title: "Scrape the leads",
    description:
      "Pull qualified usernames from any profile, post, hashtag or location. Scraping runs locally on your machine, deduped against everything you've already collected, and saved into a categorized lead database.",
    script: SCRAPE_SCRIPT,
    reverse: true,
    theme: "dark",
  },
  {
    index: 3,
    eyebrow: "Step 3",
    title: "Send the DMs",
    description:
      "Pick a lead group, write up to 20 message variants, optionally have MonchoOps follow + like + watch a story before each DM, and start the job. Sending runs across all your accounts in parallel — the same prospect never gets DM'd twice.",
    script: COLD_DM_SCRIPT,
    theme: "light",
    glow: "top-right",
  },
];

// Mount the embedded demo only when the card is near the viewport. Three full
// MonchoOps demo trees on the page are heavy — gating each one behind a
// scroll observer keeps the initial load fast and avoids running three
// scripted loops the visitor may never see.
function LazyDemoFrame({
  script,
  startDelay,
  initialPath,
}: {
  script: Step[];
  startDelay?: number;
  initialPath?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shouldMount) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shouldMount]);

  return (
    <div
      ref={ref}
      className="aspect-[980/600] w-full overflow-hidden rounded-lg bg-white shadow-2xl shadow-indigo-500/20 ring-1 ring-black/5"
    >
      {shouldMount ? (
        <MonchoOpsWindowDemo
          script={script}
          startDelay={startDelay}
          initialPath={initialPath}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
          Loading MonchoOps…
        </div>
      )}
    </div>
  );
}

function StepBlock({ step }: { step: StepCard }) {
  const isDark = step.theme === "dark";
  const wrapperClass = isDark
    ? "relative rounded-lg bg-gray-900 p-6 md:p-8 mb-6 overflow-hidden"
    : "relative rounded-lg bg-gray-100 p-6 md:p-8 mb-6 overflow-hidden";

  // Soft indigo wash anchored to one corner. Subtle on purpose — it should
  // read as ambient light, not a colored background. Step 1 leans top-left,
  // step 3 mirrors it to the top-right so the section reads symmetrically.
  const glowStyle =
    step.glow === "top-left"
      ? {
          background:
            "radial-gradient(ellipse 70% 80% at 0% 0%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 65%)",
        }
      : step.glow === "top-right"
      ? {
          background:
            "radial-gradient(ellipse 70% 80% at 100% 0%, rgba(99,102,241,0.18) 0%, rgba(99,102,241,0) 65%)",
        }
      : null;
  const eyebrowClass = isDark ? "text-gray-400" : "text-gray-500";
  const titleClass = isDark ? "text-white" : "text-gray-900";
  const descriptionClass = isDark ? "text-gray-300" : "text-gray-600";
  const numberClass = isDark
    ? "border-white/15 bg-white/5 text-white"
    : "border-gray-200 bg-white text-gray-900";

  return (
    <div data-step={step.index} className={wrapperClass}>
      {glowStyle ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={glowStyle}
        />
      ) : null}
      <div className="relative grid grid-cols-1 xl:grid-cols-5 gap-8 items-center">
        <div className={`xl:col-span-2 ${step.reverse ? "xl:order-2" : "xl:order-1"}`}>
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium ${numberClass}`}
            >
              {step.index}
            </span>
            <p className={`text-sm uppercase st ${eyebrowClass}`}>
              {step.eyebrow}
            </p>
          </div>
          <h3 className={`text-3xl md:text-4xl ${titleClass}`}>{step.title}</h3>
          <p className={`mt-4 ${descriptionClass}`}>{step.description}</p>
        </div>
        <div className={`xl:col-span-3 ${step.reverse ? "xl:order-1" : "xl:order-2"}`}>
          <LazyDemoFrame
            script={step.script}
            startDelay={(step.index - 1) * 3500}
            initialPath={
              step.script.find((s) => s.kind === "nav")?.path ?? "/"
            }
          />
        </div>
      </div>
    </div>
  );
}

export function StepsSection() {
  return (
    <section id="how-it-works" className="overflow-x-hidden scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">How it works</p>
        <h2 className="text-4xl md:text-6xl text-gray-900 mb-6">
          Setup in three steps
        </h2>

        {STEPS.map((step) => (
          <StepBlock key={step.index} step={step} />
        ))}
      </div>
    </section>
  );
}
