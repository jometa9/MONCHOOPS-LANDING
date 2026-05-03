"use client";

import {
  Bell,
  Boxes,
  Database,
  Globe,
  History,
  Send,
  ShieldCheck,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">What MonchoOps does</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          Seven tools. One outcome: more replies, zero bans.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto">
          <div className="md:col-span-2 relative flex flex-col pt-18 pb-8 p-6 bg-gray-900 rounded-lg overflow-hidden">
            <Database className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Pull thousands of qualified leads in one afternoon
            </h3>
            <p className="text-gray-300 text-sm max-w-2xl mb-5">
              Scrape from a competitor&apos;s followers. From the likers and
              commenters of any post or reel. From hashtag activity. From
              geo-tagged locations. Every scrape runs inside one of your own
              accounts — same IP, same session — so the request looks like
              a normal human browsing.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-300 w-full max-w-2xl">
              <div className="rounded-md border border-indigo-400/40 bg-indigo-500/10 text-indigo-100 px-3 py-2">
                By username
              </div>
              <div className="rounded-md border border-indigo-400/40 bg-indigo-500/10 text-indigo-100 px-3 py-2">
                By post / reel
              </div>
              <div className="rounded-md border border-indigo-400/40 bg-indigo-500/10 text-indigo-100 px-3 py-2">
                By hashtag
              </div>
              <div className="rounded-md border border-indigo-400/40 bg-indigo-500/10 text-indigo-100 px-3 py-2">
                By location
              </div>
            </div>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-[#03618d] text-white rounded-lg">
            <Globe className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-2">
              One account. One browser. One proxy.
            </h3>
            <p className="text-gray-100 text-sm">
              Bring your own HTTP or SOCKS5 proxy and assign it per
              Instagram account. Each account runs in its own isolated
              Chromium profile — separate cookies, separate fingerprints,
              separate IP. Instagram sees what it expects: a real human on
              a real device.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-purple-900 hover:bg-purple-800 transition-colors rounded-lg">
            <Send className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              20 message variants. No two DMs alike.
            </h3>
            <p className="text-gray-200 text-sm">
              Save up to 20 message variants per group. MonchoOps rotates
              them at random across the campaign and substitutes
              {" "}<code className="text-purple-200">{"{{username}}"}</code>{" "}
              per recipient. No twin DMs. No &quot;sent from a bot&quot;
              fingerprint.
            </p>
          </div>

          <div className="md:col-span-2 flex items-start flex-col pt-18 pb-8 p-6 bg-gray-100 rounded-lg">
            <Boxes className="h-6 w-6 text-gray-700 mb-3" />
            <h3 className="text-2xl text-gray-900 mb-2">
              Run all your accounts in parallel
            </h3>
            <p className="text-gray-700 text-sm max-w-2xl mb-4">
              Each account gets its own status, proxy, and DM history.
              Launch scrapes and campaigns across multiple accounts at the
              same time — MonchoOps queues them per account, runs them, and
              shows live progress with one-click cancel. Close the app and
              every running job cancels gracefully.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-700 w-full max-w-md">
              <div className="rounded-md border border-indigo-200 bg-white text-indigo-700 px-3 py-2 inline-flex items-center gap-2">
                Per-account queue
              </div>
              <div className="rounded-md border border-indigo-200 bg-white text-indigo-700 px-3 py-2 inline-flex items-center gap-2">
                Live progress
              </div>
              <div className="rounded-md border border-indigo-200 bg-white text-indigo-700 px-3 py-2 inline-flex items-center gap-2">
                One-click cancel
              </div>
            </div>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-indigo-700 hover:bg-indigo-800 transition-colors rounded-lg">
            <ShieldCheck className="h-6 w-6 text-indigo-100 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Never DM the same prospect twice
            </h3>
            <p className="text-indigo-100 text-sm">
              Every recipient is logged forever. When you launch a new
              campaign, MonchoOps automatically skips anyone you&apos;ve
              already messaged from that account — even months later. Stop
              embarrassing yourself with duplicate outreach.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-orange-700 hover:bg-orange-800 transition-colors rounded-lg">
            <Bell className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Show up in their notifications first
            </h3>
            <p className="text-orange-50 text-sm">
              Optional pre-DM interactions per campaign: follow the target,
              like 1–5 of their recent posts, watch a story or two — with
              realistic dwell times. By the time your message arrives,
              you&apos;re a profile they already noticed.
            </p>
          </div>

          <div className="flex flex-col pt-18 pb-8 p-6 rounded-lg bg-emerald-800 hover:bg-emerald-900 transition-colors">
            <History className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-3 text-white">
              Every DM logged. Every recipient tracked.
            </h3>
            <p className="text-emerald-50 text-sm">
              Open any past campaign and see exactly what was sent to whom,
              with deep-links straight to the Instagram profile and the DM
              thread. Sent / failed counts, durations, full message text.
              Compliance and debugging without spreadsheets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
