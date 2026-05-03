export interface FAQItem {
  id: string;
  question: string;
  answer: string | React.ReactNode;
}

export const faqsData: FAQItem[] = [
  {
    id: "what-is-monchoops",
    question: "What is MonchoOps?",
    answer: `MonchoOps is a desktop app for Instagram outreach. You add one or more Instagram accounts, optionally assign a proxy to each, and run scrapes, account warmup and cold DM campaigns from your own computer. Everything — sessions, leads, message history — is stored locally in an encrypted database. There is no shared cloud bot.`,
  },
  {
    id: "windows-mac",
    question: "Does it run on Windows and Mac?",
    answer: `Yes. MonchoOps ships as a native Electron app for Windows (x64 installer) and macOS (Apple Silicon). Same features on both. You only need the machine on while jobs are running — close it and MonchoOps gracefully cancels what's in flight.`,
  },
  {
    id: "is-it-safe",
    question: "Is it safe for my Instagram accounts?",
    answer: `It's as safe as the limits you set. MonchoOps gives you the tools the average cloud bot doesn't: one proxy per account, isolated Chromium profiles, randomized delays with ±25% jitter on every action, optional pre-DM interactions (follow + likes + story view), throttled DM sends, full session persistence, and auto-skip on prospects you've already DM'd. Automation always carries some risk on Instagram — MonchoOps removes the obvious red flags but you remain responsible for how aggressively you push.`,
  },
  {
    id: "how-many-accounts",
    question: "How many Instagram accounts can I run?",
    answer: `It depends on your plan — see the Pricing section below for the current limits on accounts, monthly DMs, and scrape jobs. The Free plan exists so you can test the full workflow (add an account, scrape leads, send a small Cold DM run) before paying anything.`,
  },
  {
    id: "do-i-need-proxies",
    question: "Do I need proxies?",
    answer: `Strongly recommended for any account you actually care about, and required if you run more than 2-3 accounts from the same machine. MonchoOps doesn't sell proxies — bring your own HTTP or SOCKS5 (residential or mobile work best). You assign one proxy per account in the app and MonchoOps routes everything for that account through it.`,
  },
  {
    id: "scraping-modes",
    question: "What can MonchoOps scrape?",
    answer: `Four modes: by username (a competitor's followers), by post (likers/commenters of a specific post), by hashtag (recent activity), and by location (recent posts at a place). Every scrape runs inside one of your own accounts so the request looks like a normal user browsing. Results land in your local database and can be grouped into categories with automatic deduplication.`,
  },
  {
    id: "pre-dm-interactions",
    question: "Can I follow / like / view stories before sending the DM?",
    answer: `Yes, optionally. Inside each Cold DM campaign you can configure pre-send interactions: follow the target, like 1-5 of their recent posts, and watch a story or two with realistic dwell times. By the time your message arrives, you're a profile they already noticed in their notifications — not a stranger out of nowhere. You decide which interactions to enable per campaign and how aggressive each one is.`,
  },
  {
    id: "message-variants",
    question: "Can I A/B test DM copy?",
    answer: `Yes. Save up to 20 message variants per group and MonchoOps rotates them at random across a campaign with {{username}} substitution per recipient. Each prospect gets a slightly different DM, which keeps your sends from looking templated. The DM History tab shows exactly which variant was sent to which user, with delivery status and a deep-link to the thread.`,
  },
  {
    id: "no-duplicate-dms",
    question: "Will I accidentally DM the same person twice?",
    answer: `No. Every recipient is logged forever in your local database. When you launch a new campaign, MonchoOps automatically detects prospects you've already DM'd from that account and skips them — even if you scraped them again into a new category months later. You can override this per campaign if you ever need to follow up.`,
  },
  {
    id: "queue-and-progress",
    question: "Can I run multiple campaigns at once?",
    answer: `Yes. Each Instagram account can run one job at a time (a scrape or a Cold DM campaign), but you can run as many accounts as your plan allows in parallel. The Queue screen shows every running and queued job with live progress bars, elapsed time, and a one-click cancel. Close the app and MonchoOps gracefully cancels what's in flight — nothing dangling.`,
  },
  {
    id: "compliance",
    question: "Is this compliant with Instagram's Terms?",
    answer: `Instagram's Terms of Use prohibit certain forms of automation. MonchoOps is a tool — what you do with it is your responsibility. Use it for outreach you'd be comfortable explaining (genuine prospecting, real conversations, qualified offers), not spam. We are not affiliated with, endorsed by, or sponsored by Instagram or Meta Platforms, Inc.`,
  },
  {
    id: "cloud-vs-local",
    question: "Why is local better than a cloud DM tool?",
    answer: `Cloud DM tools push your account to share an IP and session with hundreds of other users on the same provider. Instagram pattern-matches that. They also store your cookies on their servers, so if they get breached or shut down you lose everything. MonchoOps runs on your machine, with your IP (or your proxy), and keeps the data encrypted on your disk.`,
  },
  {
    id: "data-privacy",
    question: "Does MonchoOps see my account data?",
    answer: `No. We don't store your Instagram credentials, cookies, leads, or DM history on our servers. The desktop app talks to monchoops.com only to validate your subscription and check for app updates. Everything else lives locally on your machine in an encrypted SQLite database.`,
  },
  {
    id: "system-requirements",
    question: "What are the system requirements?",
    answer: `Windows 10/11 (x64) or macOS Apple Silicon (arm64). 8 GB RAM, 2 GB free disk. No external dependencies — Chromium is bundled with the installer. The app is around ~250 MB and runs fine on a regular laptop.`,
  },
  {
    id: "refunds",
    question: "Can I get a refund?",
    answer: `Yes. We offer a 7-day refund window on first-time paid plans. Just email support@monchoops.com from the same address you used to subscribe and we'll process it. See our Refund Policy for the full terms.`,
  },
];
