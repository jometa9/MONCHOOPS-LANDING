"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "@/components/landing/window-demo-app/vendor/react-router-dom";

// Each step is one "frame" of the scripted screen-recording.
export type Step =
  | { kind: "nav"; path: string; wait?: number }
  | { kind: "click"; sel: string; wait?: number }
  | { kind: "type"; sel: string; text: string; perChar?: number; wait?: number }
  | { kind: "wait"; ms: number };

const NAV_DWELL = 3000;
const ACTION_DWELL = 1200;
const TYPE_PER_CHAR = 45;

// Default script: full product tour used by the hero demo.
//   1. Land on Cold DM and run the full 5-step funnel.
//   2. Land on Scrape and run the 3-step funnel.
//   3. Tour the rest of the product, dwelling on each screen.
const DEFAULT_SCRIPT: Step[] = [
  // ── Cold DM flow ────────────────────────────────────────────────────────
  { kind: "nav", path: "/cold-dm", wait: 1200 },
  { kind: "click", sel: '[data-demo-id="account-row"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  { kind: "click", sel: '[data-demo-id="dm-tab-manual"]', wait: 700 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-manual-username"]',
    text: "founder_brunch",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-variant-0"]',
    text: "Hey {{username}}, saw your post on shipping at scale — open to a quick chat about safe IG outbound?",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-start"]' },
  { kind: "wait", ms: 3500 },

  // ── Scrape flow ─────────────────────────────────────────────────────────
  { kind: "nav", path: "/scrape", wait: 1200 },
  { kind: "click", sel: '[data-demo-id="account-row"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="scrape-continue"]', wait: 800 },
  {
    kind: "type",
    sel: '[data-demo-id="scrape-username"]',
    text: "@founder_brunch",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="scrape-continue"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="scrape-start"]' },
  { kind: "wait", ms: 3500 },

  // ── Tour the rest ───────────────────────────────────────────────────────
  { kind: "nav", path: "/", wait: NAV_DWELL },
  { kind: "nav", path: "/queue", wait: NAV_DWELL },
  { kind: "nav", path: "/data", wait: NAV_DWELL },
  { kind: "nav", path: "/data/scrape_1", wait: NAV_DWELL },
  { kind: "nav", path: "/categories", wait: NAV_DWELL },
  { kind: "nav", path: "/message-variants", wait: NAV_DWELL },
  { kind: "nav", path: "/dm-history", wait: NAV_DWELL },
  { kind: "nav", path: "/dm-history/mdm_1", wait: NAV_DWELL },
  { kind: "nav", path: "/accounts", wait: NAV_DWELL },
  { kind: "nav", path: "/settings", wait: NAV_DWELL },
];

// Step-specific scripts used by the "Setup in three steps" section. Each one
// loops indefinitely on its own embedded demo window.
export const CONNECT_SCRIPT: Step[] = [
  { kind: "nav", path: "/accounts", wait: 1800 },
  { kind: "click", sel: '[data-demo-id="add-account-button"]', wait: 1000 },
  { kind: "click", sel: '[data-demo-id="add-account-mode-credentials"]', wait: 700 },
  {
    kind: "type",
    sel: '[data-demo-id="add-account-username"]',
    text: "growth.lab.io",
    wait: 600,
  },
  {
    kind: "type",
    sel: '[data-demo-id="add-account-password"]',
    text: "supersecret123",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="add-account-cancel"]', wait: 2000 },
];

export const SCRAPE_SCRIPT: Step[] = [
  { kind: "nav", path: "/scrape", wait: 1200 },
  { kind: "click", sel: '[data-demo-id="account-row"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="scrape-continue"]', wait: 800 },
  {
    kind: "type",
    sel: '[data-demo-id="scrape-username"]',
    text: "@founder_brunch",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="scrape-continue"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="scrape-start"]' },
  { kind: "wait", ms: 5000 },
  // Navigate away so the wizard unmounts and the next loop starts from a
  // clean state (otherwise startedJobId persists and the JobStartedPanel
  // stays stuck on screen forever).
  { kind: "nav", path: "/", wait: 1500 },
];

export const COLD_DM_SCRIPT: Step[] = [
  { kind: "nav", path: "/cold-dm", wait: 1200 },
  { kind: "click", sel: '[data-demo-id="account-row"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  { kind: "click", sel: '[data-demo-id="dm-tab-manual"]', wait: 700 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-manual-username"]',
    text: "founder_brunch",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-variant-0"]',
    text: "Hey {{username}}, saw your post on shipping at scale — open to a quick chat about safe IG outbound?",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-start"]' },
  { kind: "wait", ms: 5000 },
  { kind: "nav", path: "/", wait: 1500 },
];

// React tracks input values via its own setter on the input prototype;
// assigning .value directly bypasses it and the controlled input snaps back.
function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    el instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

// When multiple demo windows live on the same page they all share the
// document, so a global `document.querySelector` would let one autoplay
// drive another's DOM. We resolve a per-instance scope by walking up to
// the closest `[data-monchoops-demo-root]`. Dialogs and other portals
// rendered to document.body are not inside that root — when a query
// fails inside the scoped root we fall back to the document so portal
// content (modals) is still reachable. The fallback is fine in practice:
// we only render one open dialog at a time across the whole page.
function findEl<T extends Element = Element>(
  scope: ParentNode,
  sel: string
): T | null {
  return (scope.querySelector<T>(sel) ?? document.querySelector<T>(sel)) as T | null;
}

function waitForEl<T extends Element = Element>(
  scope: ParentNode,
  sel: string,
  timeoutMs = 2000
): Promise<T | null> {
  return new Promise((resolve) => {
    const found = findEl<T>(scope, sel);
    if (found) {
      resolve(found);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => {
      const el = findEl<T>(scope, sel);
      if (el) {
        window.clearInterval(id);
        resolve(el);
      } else if (Date.now() - start > timeoutMs) {
        window.clearInterval(id);
        resolve(null);
      }
    }, 50);
  });
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("aborted", "AbortError"));
      return;
    }
    const id = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    function onAbort() {
      window.clearTimeout(id);
      reject(new DOMException("aborted", "AbortError"));
    }
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

interface DemoAutoplayProps {
  script?: Step[];
  startDelay?: number;
}

export function DemoAutoplay({ script = DEFAULT_SCRIPT, startDelay = 0 }: DemoAutoplayProps) {
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let ctrl: AbortController | null = null;

    // Scope DOM lookups to this demo's root so we can host multiple
    // independent demo windows on a single page without cross-talk.
    const scope: ParentNode =
      anchorRef.current?.closest("[data-monchoops-demo-root]") ?? document;

    async function runStep(step: Step, signal: AbortSignal): Promise<void> {
      if (step.kind === "nav") {
        navigate(step.path);
        await sleep(step.wait ?? NAV_DWELL, signal);
        return;
      }
      if (step.kind === "wait") {
        await sleep(step.ms, signal);
        return;
      }
      if (step.kind === "click") {
        const el = await waitForEl<HTMLElement>(scope, step.sel);
        if (signal.aborted) return;
        if (el && !(el as HTMLButtonElement).disabled) el.click();
        await sleep(step.wait ?? ACTION_DWELL, signal);
        return;
      }
      if (step.kind === "type") {
        const el = await waitForEl<HTMLInputElement | HTMLTextAreaElement>(
          scope,
          step.sel
        );
        if (signal.aborted || !el) {
          await sleep(step.wait ?? ACTION_DWELL, signal);
          return;
        }
        el.focus({ preventScroll: true });
        setNativeValue(el, "");
        const perChar = step.perChar ?? TYPE_PER_CHAR;
        let acc = "";
        for (const ch of step.text) {
          if (signal.aborted) return;
          acc += ch;
          setNativeValue(el, acc);
          await sleep(perChar, signal);
        }
        await sleep(step.wait ?? ACTION_DWELL, signal);
      }
    }

    async function runForever(signal: AbortSignal) {
      try {
        await sleep(400 + Math.max(0, startDelay), signal);
        while (!signal.aborted) {
          for (const step of script) {
            if (signal.aborted) return;
            await runStep(step, signal);
          }
        }
      } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.warn("DemoAutoplay stopped:", err);
        }
      }
    }

    function start() {
      stop();
      ctrl = new AbortController();
      void runForever(ctrl.signal);
    }
    function stop() {
      ctrl?.abort();
      ctrl = null;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate, script, startDelay]);

  return <span ref={anchorRef} aria-hidden style={{ display: "none" }} />;
}
