"use client";

import { useEffect } from "react";
import { useNavigate } from "@/components/landing/window-demo-app/vendor/react-router-dom";

// Each step is one "frame" of the scripted screen-recording.
type Step =
  | { kind: "nav"; path: string; wait?: number }
  | { kind: "click"; sel: string; wait?: number }
  | { kind: "type"; sel: string; text: string; perChar?: number; wait?: number }
  | { kind: "wait"; ms: number };

const NAV_DWELL = 3000;
const ACTION_DWELL = 1200;
const TYPE_PER_CHAR = 45;

// Story:
//   1. Land on Cold DM and run the full 5-step funnel (account → manual leads
//      → message variant → skip interactions → start).
//   2. Land on Scrape and run the 3-step funnel.
//   3. Tour the rest of the product, dwelling on each screen.
// The whole script loops forever.
const SCRIPT: Step[] = [
  // ── Cold DM flow ────────────────────────────────────────────────────────
  { kind: "nav", path: "/cold-dm", wait: 1200 },
  { kind: "click", sel: '[data-demo-id="account-row"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  { kind: "click", sel: '[data-demo-id="dm-tab-manual"]', wait: 700 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-manual-username"]',
    text: "founder_brunch",
    wait: 1500, // wait past the 300ms debounce in ManualPanel
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  {
    kind: "type",
    sel: '[data-demo-id="dm-variant-0"]',
    text: "Hey {{username}}, saw your post on shipping at scale — open to a quick chat about safe IG outbound?",
    wait: 1500,
  },
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 800 },
  // Step 4 (Interactions) — leave defaults, just continue.
  { kind: "click", sel: '[data-demo-id="dm-continue"]', wait: 1200 },
  { kind: "click", sel: '[data-demo-id="dm-start"]' },
  { kind: "wait", ms: 3500 }, // dwell on the JobStartedPanel

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
  { kind: "wait", ms: 3500 }, // dwell on the JobStartedPanel

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

// React tracks input values via its own setter on the input prototype;
// assigning .value directly bypasses it and the controlled input snaps back.
// Use the prototype setter + dispatch a bubbling "input" event so React picks
// it up like a real keystroke.
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

function findEl<T extends Element = Element>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

// Wait for the element to exist (newly-mounted screen, async data, etc.).
// Polls every 50ms up to ~2s before giving up.
function waitForEl<T extends Element = Element>(
  sel: string,
  timeoutMs = 2000
): Promise<T | null> {
  return new Promise((resolve) => {
    const found = findEl<T>(sel);
    if (found) {
      resolve(found);
      return;
    }
    const start = Date.now();
    const id = window.setInterval(() => {
      const el = findEl<T>(sel);
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

export function DemoAutoplay() {
  const navigate = useNavigate();

  useEffect(() => {
    let ctrl: AbortController | null = null;

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
        const el = await waitForEl<HTMLElement>(step.sel);
        if (signal.aborted) return;
        if (el && !(el as HTMLButtonElement).disabled) el.click();
        await sleep(step.wait ?? ACTION_DWELL, signal);
        return;
      }
      if (step.kind === "type") {
        const el = await waitForEl<HTMLInputElement | HTMLTextAreaElement>(step.sel);
        if (signal.aborted || !el) {
          await sleep(step.wait ?? ACTION_DWELL, signal);
          return;
        }
        el.focus();
        // Clear first so re-runs of the loop don't append to old text.
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
        // small head-start so the AppShell mounts before the first nav fires
        await sleep(400, signal);
        while (!signal.aborted) {
          for (const step of SCRIPT) {
            if (signal.aborted) return;
            await runStep(step, signal);
          }
        }
      } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
          // Don't crash the demo if a single step blew up — log and bail.
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
      // Pause the loop when the tab is hidden so we don't burn cycles
      // invisibly; restart from the top when we come back. Fine for a hero
      // demo since the visitor missed the in-flight context anyway.
      if (document.hidden) stop();
      else start();
    }

    start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [navigate]);

  return null;
}
