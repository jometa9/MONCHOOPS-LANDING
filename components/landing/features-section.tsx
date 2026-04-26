"use client";

import {
  Boxes,
  Database,
  Flame,
  Globe,
  Lock,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24">
      <div className="px-3 max-w-7xl mx-auto">
        <p className="text-gray-600 text-xl mb-1">Features</p>
        <h2 className="text-3xl text-gray-900 mb-6">
          Everything cold-DM tools won&apos;t give you, in one desktop app
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mx-auto">
          <div className="md:col-span-2 relative flex flex-col pt-18 pb-8 p-6 bg-gray-900 rounded-lg overflow-hidden">
            <Lock className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Runs on your machine, not in someone else&apos;s cloud
            </h3>
            <p className="text-gray-300 text-sm max-w-2xl">
              Every account session, cookie, proxy and lead lives on your own
              computer in an encrypted local database. No shared cloud bot, no
              shared data center IP, no vendor that suddenly knows your entire
              outreach strategy. If it stops, it&apos;s because you closed the
              app.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2 text-xs text-gray-400 max-w-md">
              <div className="rounded-md border border-gray-700 px-3 py-2">
                Local SQLite
              </div>
              <div className="rounded-md border border-gray-700 px-3 py-2">
                AES-GCM cookie encryption
              </div>
              <div className="rounded-md border border-gray-700 px-3 py-2">
                Bundled Chromium
              </div>
              <div className="rounded-md border border-gray-700 px-3 py-2">
                Zero telemetry
              </div>
            </div>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-[#03618d] text-white rounded-lg">
            <Globe className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-2">One proxy per account</h3>
            <p className="text-gray-100 text-sm">
              Bring your own HTTP or SOCKS5 proxy and assign it per Instagram
              account. MonchoOps keeps each account in its own isolated
              Chromium profile so they never share IPs, cookies or fingerprints.
              The way Instagram expects a real human to look.
            </p>
          </div>

          <div className="md:col-span-1 relative flex flex-col pt-18 pb-8 p-6 rounded-lg bg-orange-700 hover:bg-orange-800 transition-colors">
            <Flame className="h-6 w-6 text-white mb-3" />
            <h3 className="text-2xl mb-3 text-white">Real account warmup</h3>
            <p className="text-orange-50 text-sm mb-4">
              Schedule feed browsing, story views, reels, hashtag likes and
              follows per account, with realistic intervals. New accounts get
              warmed for days before they ever send a DM — and MonchoOps tracks
              the active days so you know when each one is actually ready.
            </p>
          </div>

          <div className="md:col-span-2 flex items-start flex-col pt-18 pb-8 p-6 bg-gray-100 rounded-lg">
            <Users className="h-6 w-6 text-gray-700 mb-3" />
            <h3 className="text-2xl text-gray-900 mb-2">
              Scrape leads four ways
            </h3>
            <p className="text-gray-700 text-sm max-w-2xl mb-4">
              Pull qualified usernames from a competitor&apos;s followers, the
              likers/commenters of a specific post, a hashtag&apos;s top
              activity, or a location&apos;s recent posts. Every scrape runs
              inside one of your own accounts so your IP and session stay
              consistent.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-700 w-full max-w-2xl">
              <div className="rounded-md border border-gray-300 bg-white px-3 py-2">
                By username
              </div>
              <div className="rounded-md border border-gray-300 bg-white px-3 py-2">
                By post
              </div>
              <div className="rounded-md border border-gray-300 bg-white px-3 py-2">
                By hashtag
              </div>
              <div className="rounded-md border border-gray-300 bg-white px-3 py-2">
                By location
              </div>
            </div>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-purple-900 hover:bg-purple-800 transition-colors rounded-lg">
            <Send className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-2 text-white">
              Cold DM with message variants
            </h3>
            <p className="text-gray-200 text-sm">
              Save up to 20 message variants per group and rotate them across a
              campaign so every recipient gets a slightly different DM. Stack
              optional follows and likes before the send to look like a real
              user landing on the profile.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-gray-900 rounded-lg">
            <Boxes className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl text-white mb-2">
              Multi-account, one window
            </h3>
            <p className="text-gray-200 text-sm">
              Run unlimited Instagram accounts on the Unlimited plan. Each one
              gets its own status, proxy, warmup schedule and DM history.
              Switch between them like tabs — no juggling phones, sims or
              browsers.
            </p>
          </div>

          <div className="flex items-start flex-col pt-18 pb-8 p-6 bg-gray-200 rounded-lg">
            <Database className="h-6 w-6 text-gray-700 mb-3" />
            <h3 className="text-2xl text-gray-900 mb-2">
              Lead categories &amp; auto-dedupe
            </h3>
            <p className="text-gray-700 text-sm">
              Group scrapes into categories (&quot;Tech founders LATAM&quot;,
              &quot;Yoga studios NYC&quot;) and MonchoOps automatically
              de-duplicates usernames across runs. Export any category to CSV
              with one click.
            </p>
          </div>

          <div className="md:col-span-1 flex flex-col pt-18 pb-8 p-6 rounded-lg bg-emerald-800 hover:bg-emerald-900 transition-colors">
            <Sparkles className="h-6 w-6 text-gray-200 mb-3" />
            <h3 className="text-2xl mb-3 text-white">
              AI replies (bring your own key)
            </h3>
            <p className="text-emerald-50 text-sm">
              Connect an Anthropic or OpenAI API key and let MonchoOps draft
              context-aware replies inside the unified inbox. You stay in
              control: every draft is reviewed before it goes out, and the
              prompt is yours to tune.
            </p>
            <div className="mt-3 inline-block rounded-full border border-emerald-300/40 px-3 py-1 text-xs text-emerald-100 w-fit">
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
