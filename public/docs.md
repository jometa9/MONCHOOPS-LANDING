### Table of Contents

1. [Introduction](#introduction)
2. [What MonchoOps gives you](#what-monchoops-gives-you)
3. [Desktop app](#desktop-app)
4. [Chrome extension](#chrome-extension)
5. [Updates](#updates)
6. [FAQ](#faq)

---

## Introduction

MonchoOps is the Instagram outreach toolkit from IPTRADE COPIER LLC. It is built for founders, agencies and creators who run cold outreach on Instagram and don't want to share their accounts, sessions or leads with a third party.

There are two products you can use, together or separately:

- A **desktop app** (Windows and macOS) that runs many Instagram accounts in parallel, scrapes leads, and sends cold DM campaigns end-to-end on your machine.
- A **Chrome extension** that sends cold DMs from the Instagram account you are already logged into in your browser — lighter setup, single account, no proxies needed.

Everything runs locally. Your accounts, sessions and leads stay on your computer.

---

## What MonchoOps gives you

- Multi-account Instagram management (desktop only).
- Lead scraping by username, post, hashtag or location (desktop only).
- Lead categories with auto-dedup and CSV export.
- Reusable message variant groups, with rotation per send to avoid templated-looking DMs.
- Cold DM campaigns with optional pre-DM engagement (follow, like recent posts, watch stories).
- A live job queue with progress and per-message history.
- A Chrome extension that mirrors the cold DM flow and can read leads straight from your desktop app.

---

## Desktop app

### System requirements

- **Windows 10 or 11 (x64)** or **macOS Apple Silicon (arm64)**.
- 8 GB RAM minimum, 4 GB free disk.
- A reliable internet connection. The proxies you assign decide the IP your accounts present.
- Chromium is bundled with the installer — no extra runtime required.

### Installation

1. Download the installer for your operating system from the [download section](https://monchoops.com/#download) on the homepage.
2. Run the installer.
3. Open MonchoOps. No account, no login, no license key — just open the app and start.

The first launch creates a local user-data folder under your OS application data directory. Everything MonchoOps stores lives there.

### Adding Instagram accounts

1. Open the **Instagram accounts** screen and click **Add account**.
2. A window opens hosting a real Instagram login flow inside an isolated Chromium profile.
3. Enter the credentials for the Instagram account.
4. Solve any verification (SMS, email, captcha) Instagram presents.
5. MonchoOps captures the session, encrypts the cookies and stores them locally.

You can repeat this for as many accounts as your machine can handle.

> **Tip:** Sign in once and let the account sit idle for a day or two before doing anything else. Instagram&apos;s heuristics like to see a session "live" for a bit before you start automating.

### Bulk account import

If you have many accounts to add, use the **Import from CSV** option in the Instagram accounts screen. Upload a CSV with usernames and passwords and MonchoOps will queue the logins and run them one after another. Each account is logged in inside its own isolated profile, just like a manual sign-in.

You can monitor progress from the **Queue** screen and retry any failed login from the accounts list.

### Proxies

For any account you actually care about, **assign a proxy** from the account&apos;s row in the accounts list.

- Supported: HTTP and SOCKS5.
- Format: `protocol://user:pass@host:port`.
- We recommend residential or mobile proxies. Datacenter proxies often fail Instagram&apos;s checks.
- One proxy per account. MonchoOps does not rotate.
- A proxy can be temporarily disabled per account without removing it.

Once a proxy is assigned, the account&apos;s isolated Chromium profile uses it for every request — login, scraping, DMs.

### Scraping leads

The **Scrape** screen has four modes:

- **By username** — pulls the followers of a target account.
- **By post** — pulls the likers and commenters of a single post.
- **By hashtag** — pulls users who recently used a hashtag.
- **By location** — pulls recent posters at a location.

Pick one of your Instagram accounts to run the scrape, the target, and a category to drop the results into. The job moves into the queue; results land in **Data** when it finishes.

There is no monthly quota — scrape as many leads as you want. Just keep in mind that aggressive scraping can trigger Instagram rate-limits on the account doing the scrape, so let MonchoOps' built-in jitter and pacing do its job.

### Categories

Categories let you pool scrapes for the same audience. Two important behaviors:

- **Auto-dedupe** — usernames already in a category are not added twice when you run a new scrape into the same category.
- **CSV export** — every category exports as a single CSV with the columns you would expect (username, source, scraped_at).

You can create, rename and delete categories from the **Categories** screen, and tap into one to see every lead inside it.

### Data

The **Data** screen lists every scrape job you have ever run, with its source, target, account used, lead count, and status. Open any row to inspect the raw lead list, retry a failed scrape, or download the results as CSV.

### Message variants

A **variant group** is a named set of up to 20 DM message texts that MonchoOps rotates during a campaign. Rotating variants keeps your sends from looking templated.

Use plain text and the `{{username}}` placeholder to personalize messages with the recipient&apos;s handle.

### Cold DM campaigns

Open **Cold DM**, then walk through the steps:

1. Pick the account that will send the messages.
2. Pick the leads — a category, a saved scrape job, a CSV import, or hand-typed usernames.
3. Pick a message variant group.
4. Optionally enable **Pre-DM interactions**: follow the lead, like up to 5 of their recent posts, and/or watch their stories. These warm up the conversation before the DM lands.
5. Set the interval between sends.
6. Review the summary and start.

The campaign moves into the queue. You will see live progress, and the **DM history** screen will record every send with its status.

### Queue

Every long-running task — scrape, bulk login, cold DM — becomes a job in the queue. The **Queue** screen shows running and pending jobs, with live progress and a cancel button. Closing the app pauses jobs gracefully and they resume the next time you open MonchoOps.

### DM history

The **DM history** screen lists every cold DM campaign and lets you drill into a per-message log: which variant was used, sent or failed status, and any error reported by Instagram.

### Settings

The **Settings** screen exposes:

- **App info** — version and update check.
- **Language** — System, English, or Spanish.
- **Headless mode** — run automation without showing the Chromium window. When off, you can also toggle **Full window** to show the automated browser at full size.
- **Dark theme** — toggle light/dark UI.
- **Sounds on completion** — play a notification sound when a job finishes.
- **Data controls** — delete all Instagram accounts, delete all scrapes, or wipe everything from the local database.

---

## Chrome extension

The MonchoOps Chrome extension is a lighter way to run cold DMs. It uses the Instagram account you are already logged into in Chrome, so there are no credentials, no proxies, and no separate Chromium to install. Same UX as the desktop app for the cold DM flow.

### What it does

- Open and use, no login or license key required.
- Build a campaign with manual usernames, a CSV import, **or leads pulled straight from your desktop app** (categories and past scrape results — see [Desktop bridge](#desktop-bridge)).
- Reusable message variant groups with the `{{username}}` placeholder.
- Optional pre-DM interactions: follow, watch stories, like up to a few recent posts.
- Configurable interval between sends.
- Background scheduler that keeps running even with the dashboard tab closed, as long as Chrome is open.
- Per-lead status, full DM history, and total counters.

> The extension only sends DMs. It does not scrape leads — scraping is desktop-only.

### Extension installation

1. Install the extension from the [download section](https://monchoops.com/#download) on the homepage.
2. Pin the MonchoOps icon next to your address bar for quick access.
3. Make sure you are logged into [instagram.com](https://www.instagram.com/) in the same Chrome profile.
4. Click the icon and then click **Open dashboard** to land in the full UI.

### Sending DMs from the extension

1. Open the extension dashboard and go to **New campaign**.
2. Add leads — paste usernames, upload a CSV, or click **Import from desktop** to pull a category or past scrape from your desktop app (see below).
3. Pick or create a message variant group.
4. Optionally enable pre-DM interactions.
5. Set the interval between sends and start the campaign.

You can monitor progress from the **Campaigns** screen, see every send in **History**, and pause or cancel at any time.

### Desktop bridge

If the MonchoOps desktop app is running on the same machine, the extension can read your saved lead categories and past scrape results — no CSV export step needed.

How to pair them:

1. Open the desktop app and keep it running in the background.
2. In the extension&apos;s **New campaign** flow, click **Import from desktop**.
3. The extension shows a 4-digit code; the desktop app simultaneously pops up an "Allow this extension?" prompt with the same code.
4. Confirm in the desktop app and the two are paired.

After pairing, you can browse and import any category or scrape result from the desktop directly into the campaign you are building. You can revoke a paired extension at any time from the desktop&apos;s Settings, or unpair from the extension&apos;s Settings.

The bridge only listens on your local machine — it is invisible to other devices on the network and to other applications.

### Limits to keep in mind

- The extension works only with the Instagram account currently logged into Chrome. To switch accounts, log out of Instagram and log into a different one in the same Chrome profile.
- Chrome must be running for campaigns to make progress. If Chrome is closed, the campaign pauses and resumes when Chrome restarts.
- The extension dashboard tab itself can be closed; the background scheduler keeps running.

---

## Updates

MonchoOps checks for new versions automatically. When one is available, you will see a banner in the app with a download link. Updates are manual — you choose when to install them.

---

## FAQ

For specific questions about safety, proxies, scraping and Instagram compliance, see the FAQ section on [monchoops.com](https://monchoops.com/#faq).
