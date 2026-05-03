"use client";

import dynamic from "next/dynamic";

const App = dynamic(
  () => import("@/components/landing/window-demo-app/App"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-white text-xs text-gray-400">
        Loading MonchoOps…
      </div>
    ),
  }
);

export function MonchoOpsWindowDemo() {
  return (
    <div
      className="monchoops-demo-root relative h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white text-[13px] antialiased"
      // transform on the wrapper makes `position: fixed` descendants (like
      // dialogs) contain themselves inside the demo frame instead of escaping
      // to the viewport. side-effect: the parent's rounded-corner clip stops
      // applying to us, so we re-declare the radius+border here.
      style={{ transform: "translateZ(0)" }}
    >
      {/* Mirror the B2DM index.css rules that the copied components rely on,
          scoped to the demo so they don't leak into the rest of the landing. */}
      <style>{`
        .monchoops-demo-root .titlebar { height: 28px; }
        .monchoops-demo-root, .monchoops-demo-root * {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        .monchoops-demo-root *::-webkit-scrollbar { display: none; }
      `}</style>
      <App />
    </div>
  );
}
