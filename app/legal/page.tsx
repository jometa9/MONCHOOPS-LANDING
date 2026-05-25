import { LandingHeader } from "@/components/landing/landing-header";
import { Footer } from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal — Privacy Policy & Terms — MonchoOps",
  description:
    "Privacy policy and terms of use for MonchoOps. The desktop app and Chrome extension run locally on your machine and do not collect, transmit or store personal data on our servers.",
  alternates: { canonical: "/legal" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "May 24, 2026";

export default function LegalPage() {
  return (
    <>
      <LandingHeader />
      <main className="pt-25 pb-20">
        <div className="px-3 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            Legal
          </h1>
          <p className="mt-3 text-gray-600 text-lg max-w-2xl">
            Privacy policy and terms of use for MonchoOps. Short version: the
            app is free, runs entirely on your machine, and we don&apos;t
            collect your data.
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            Last updated: {LAST_UPDATED}
          </p>

          <nav className="mt-8 mb-10 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Table of contents
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <a href="#privacy" className="hover:text-indigo-600">
                  1. Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-indigo-600">
                  2. Terms of Use
                </a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-indigo-600">
                  3. Disclaimer
                </a>
              </li>
            </ul>
          </nav>

          <article className="space-y-10 text-gray-700 leading-7">
            {/* PRIVACY POLICY */}
            <section id="privacy" className="scroll-mt-24">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                1. Privacy Policy
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                What data we collect
              </h3>
              <p>
                <strong>None.</strong> Neither the desktop app nor the Chrome
                extension collects, transmits or stores personal data on our
                servers. There is no account, no login, no subscription and no
                payment processing. We do not operate a backend that receives
                your Instagram credentials, cookies, messages, leads,
                contacts, IP address, device identifiers or usage analytics.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                What data is stored locally
              </h3>
              <p>
                All data the app uses — Instagram session cookies, scraped
                leads, message variants, DM history, proxy configuration and
                preferences — is stored only on your own machine, in an
                encrypted local database (desktop) or in extension local
                storage (Chrome). It never leaves your computer or browser.
                You can delete it at any time by removing the app or clearing
                the extension storage.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Permissions used by the Chrome extension
              </h3>
              <p>
                The extension requests permissions strictly necessary to
                operate cold DM campaigns inside the Instagram tab you are
                already logged into:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>
                  Access to <code>instagram.com</code> to read your existing
                  session and send DMs on your behalf.
                </li>
                <li>
                  Local extension storage to persist your campaigns, message
                  variants and per-recipient send history between sessions.
                </li>
              </ul>
              <p className="mt-2">
                We do not request, read, transmit or sell data from any other
                website you visit. We do not use remote code.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Third-party services
              </h3>
              <p>
                MonchoOps interacts with Instagram on your behalf, using the
                session you are already signed into. We are not affiliated
                with, endorsed by, or sponsored by Instagram or Meta
                Platforms, Inc.
              </p>
              <p className="mt-2">
                If you route traffic through a third-party proxy you provide,
                that proxy operator may see your traffic. MonchoOps does not
                supply, mediate or log proxy traffic.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Cookies and tracking
              </h3>
              <p>
                The marketing website may include a Meta (Facebook) Pixel for
                anonymous traffic measurement. The desktop app and Chrome
                extension do not include any analytics, telemetry or tracking
                cookies.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Children&apos;s privacy
              </h3>
              <p>
                MonchoOps is not directed to children under 13 and we do not
                knowingly collect data from anyone.
              </p>
            </section>

            {/* TERMS OF USE */}
            <section id="terms" className="scroll-mt-24">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                2. Terms of Use
              </h2>
              <p>
                By using MonchoOps you agree to these terms. If you don&apos;t
                agree, don&apos;t use the software.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                What MonchoOps does
              </h3>
              <p>
                MonchoOps is a free desktop application and Chrome extension
                for Instagram outreach that runs on your own computer or
                browser:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>
                  Connects one or more Instagram accounts using credentials
                  you provide (desktop) or the session already logged in
                  (extension).
                </li>
                <li>
                  Optionally routes each account through an HTTP or SOCKS5
                  proxy you provide (desktop only).
                </li>
                <li>
                  Scrapes Instagram usernames from profiles, posts, hashtags
                  or locations using your own authenticated session.
                </li>
                <li>
                  Sends cold direct messages from your accounts to lists of
                  usernames you control.
                </li>
                <li>
                  Stores all sessions, leads and message history locally on
                  your machine.
                </li>
              </ul>
              <p className="mt-2">
                We provide the software. We do not run any of the automation
                on your behalf and we do not host your data.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Your responsibilities
              </h3>
              <p>You are solely responsible for:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>
                  The Instagram accounts you connect, including their
                  compliance with Instagram&apos;s Terms of Use.
                </li>
                <li>The proxies you use and how you obtain them.</li>
                <li>The leads, messages and campaigns you create.</li>
                <li>
                  Any actions Instagram or Meta Platforms, Inc. take against
                  your accounts.
                </li>
                <li>
                  Compliance with all applicable laws, including data
                  protection (GDPR, CCPA, etc.), anti-spam laws (CAN-SPAM,
                  CASL), and unsolicited messaging rules in your
                  jurisdiction.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Acceptable use
              </h3>
              <p>You may NOT use MonchoOps to:</p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>
                  Send unsolicited bulk messages that violate anti-spam laws.
                </li>
                <li>
                  Harass, threaten, defame or impersonate any person.
                </li>
                <li>
                  Distribute malware, phishing links or fraudulent content.
                </li>
                <li>Scrape or message minors.</li>
                <li>
                  Reverse-engineer the desktop application or Chrome
                  extension for malicious purposes.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Price
              </h3>
              <p>
                MonchoOps is free. There is no paid tier. We don&apos;t
                process payments. If anyone asks you for a license key,
                subscription or payment to use MonchoOps, it is not us.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">
                Termination
              </h3>
              <p>
                You can stop using MonchoOps at any time by uninstalling the
                desktop app or removing the Chrome extension. Since we
                don&apos;t store your data on our servers, there is nothing
                for us to delete on our side.
              </p>
            </section>

            {/* DISCLAIMER */}
            <section id="disclaimer" className="scroll-mt-24">
              <h2 className="text-3xl font-semibold text-gray-900 mb-4">
                3. Disclaimer
              </h2>
              <p>
                <strong>MonchoOps is an independent tool.</strong> We are not
                affiliated with, endorsed by, or sponsored by Instagram or
                Meta Platforms, Inc. Instagram is a trademark of Meta
                Platforms, Inc.
              </p>
              <p className="mt-2">
                Instagram&apos;s Terms of Use prohibit certain forms of
                automation, scraping and unsolicited messaging. MonchoOps
                gives you tools (proxy isolation, warmup, throttled sends,
                message variants) that minimize obvious red flags, but no
                automation tool can guarantee compliance with Instagram&apos;s
                policies. You assume all risk when using MonchoOps to
                interact with Instagram.
              </p>
              <p className="mt-2">
                MonchoOps is provided &ldquo;as is&rdquo; without warranties
                of any kind. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 ml-4">
                <li>
                  Your Instagram accounts will not be flagged, restricted or
                  banned.
                </li>
                <li>The software will be free of bugs or interruptions.</li>
                <li>
                  Specific outcomes (open rate, reply rate, etc.) will be
                  achieved.
                </li>
              </ul>
              <p className="mt-2">
                To the maximum extent permitted by law, we disclaim all
                liability for any damages arising from your use of MonchoOps.
              </p>
            </section>

          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
