"use client";

import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import App from "@/components/landing/window-demo-app/App";
import type { Step } from "@/components/landing/window-demo-app/components/DemoAutoplay";
import type { DemoLocale } from "@/components/landing/window-demo-app/lib/i18n";

const BASE_WIDTH = 980;
const BASE_HEIGHT = 600;

interface MonchoOpsWindowDemoProps {
  script?: Step[];
  startDelay?: number;
  initialPath?: string;
}

export function MonchoOpsWindowDemo({ script, startDelay, initialPath }: MonchoOpsWindowDemoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const nextIntlLocale = useLocale();
  const demoLocale: DemoLocale = nextIntlLocale === "es" ? "es" : "en";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const { width } = el.getBoundingClientRect();
      if (width <= 0) return;
      setScale(width / BASE_WIDTH);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-monchoops-demo-root
      className="monchoops-demo-root relative h-full w-full overflow-hidden border border-gray-200 bg-white text-[13px] antialiased"
      style={{
        containerType: "size",
        borderRadius: "8px",
        clipPath: "inset(0 round 8px)",
        isolation: "isolate",
      }}
    >
      <style>{`
        .monchoops-demo-root .titlebar { height: 28px; }
        .monchoops-demo-root, .monchoops-demo-root * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .monchoops-demo-root *::-webkit-scrollbar { display: none; }
        .monchoops-demo-stage,
        .monchoops-demo-stage * {
          pointer-events: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          touch-action: none !important;
          overscroll-behavior: contain !important;
        }
      `}</style>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="monchoops-demo-stage"
          aria-hidden
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
            flex: "none",
          }}
        >
          <App script={script} startDelay={startDelay} initialPath={initialPath} locale={demoLocale} />
        </div>
      </div>
    </div>
  );
}
