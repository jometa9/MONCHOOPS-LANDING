### Table of Contents

1. [Introduction](#introduction)
2. [System requirements](#system-requirements)
3. [Installation](#installation)
4. [Adding your first Instagram account](#adding-your-first-instagram-account)
5. [Proxies](#proxies)
6. [Account warmup](#account-warmup)
7. [Scraping leads](#scraping-leads)
8. [Lead categories](#lead-categories)
9. [Message variants](#message-variants)
10. [Cold DM campaigns](#cold-dm-campaigns)
11. [The job queue](#the-job-queue)
12. [DM history](#dm-history)
13. [Settings](#settings)
14. [Updates](#updates)
15. [FAQ](#faq)

---

## Introduction

MonchoOps is a desktop application for Instagram outreach. Everything runs on your computer: account sessions, scrapers, warmup workers, and DM senders. There is no shared cloud bot. Your data lives in an encrypted SQLite database on your machine.

Built by IPTRADE COPIER LLC for founders, agencies and creators who run cold outreach on Instagram and don't want to share their accounts, sessions or leads with a third party.

---

## System requirements

- **Windows 10 or 11 (x64)** or **macOS Apple Silicon (arm64)**.
- 8 GB RAM minimum, 4 GB free disk.
- A reliable internet connection (the proxies you use will determine the IP your accounts present).
- Chromium is bundled with the installer — no extra runtime required.

---

## Installation

1. Download the appropriate installer from your dashboard at [monchoops.com/dashboard](https://monchoops.com/dashboard).
2. Run the installer.
3. Open MonchoOps. Sign in with the same email address you used to subscribe (email + password or Google OAuth).

The first launch creates a local user-data folder under your OS application data directory. Everything MonchoOps stores lives there.

---

## Adding your first Instagram account

1. Open the **Accounts** screen and click **Add account**.
2. A window opens hosting a real Instagram login flow inside an isolated Chromium profile.
3. Enter the credentials for the Instagram account.
4. Solve any verification (SMS, email, captcha) Instagram presents.
5. MonchoOps captures the session, encrypts the cookies and stores them locally.

You can repeat this for as many accounts as your plan allows.

> **Tip:** Sign in once and let the account sit idle for a day or two before doing anything else. Instagram&apos;s heuristics like to see a session "live" for a bit before you start automating.

---

## Proxies

For any account you actually care about, **assign a proxy** from the account&apos;s detail panel.

- Supported: HTTP and SOCKS5.
- Format: `protocol://user:pass@host:port`.
- We recommend residential or mobile proxies. Datacenter proxies often fail Instagram&apos;s checks.
- One proxy per account. MonchoOps does not rotate.

Once a proxy is assigned, the account&apos;s isolated Chromium profile uses it for every request — login, scraping, warmup, DMs.

---

## Account warmup

Brand-new accounts (and accounts you haven&apos;t logged into via MonchoOps before) should be warmed before you DM anyone.

In the **Warmup** screen you can schedule per-account activities:

- Browse feed
- Watch stories
- Watch reels
- Like by hashtag
- Like by location
- Follow by hashtag
- Follow by location

Configure a daily session window, the number of actions per category, and the interval between them. MonchoOps tracks the **distinct days** an account has been actively warmed. We mark an account as **Warmed** only after:

- The account is at least 7 days old, AND
- It has at least 2 distinct active warmup days.

You can run warmups in parallel with other jobs.

---

## Scraping leads

The **Scrape Leads** screen has four modes:

- **By username** — pulls the followers of a target account.
- **By post** — pulls the likers and commenters of a single post.
- **By hashtag** — pulls users who recently used a hashtag.
- **By location** — pulls recent posters at a location.

Pick the source account that should run the scrape (yes, it uses one of your accounts), the target, and a category to drop the results into. The scrape runs in the queue; results land in **Leads** when it finishes.

---

## Lead categories

Categories let you pool scrapes for the same audience. Two important behaviors:

- **Auto-dedupe** — usernames already in a category aren&apos;t added twice when you run a new scrape into the same category.
- **CSV export** — every category exports as a single CSV with the columns you&apos;d expect (username, source, scraped_at).

---

## Message variants

A **variant group** is a named set of up to 20 DM message texts that MonchoOps will rotate during a campaign. This keeps your sends from looking templated.

In the editor you can use plain text. Future versions will add light spintax / handle injection.

---

## Cold DM campaigns

Open **Cold DM**, then:

1. Pick the account that will send the messages (must be warmed).
2. Pick the leads — a category, a CSV import, or hand-typed usernames.
3. Pick a message variant group.
4. Optionally toggle **Follow before send** and **Like recent post** to add lightweight engagement before each DM.
5. Set the interval between sends (in seconds).
6. Review and start.

The campaign moves into the queue. You&apos;ll see live progress, and the **DM History** screen will record every send with its status.

---

## The job queue

Every long-running task (scrape, warmup, cold DM) becomes a job in the queue. The **Queue** screen shows running and pending jobs, with live progress bars and a cancel button. Closing the app pauses jobs gracefully.

---

## DM history

The **DM History** screen lists every Cold DM campaign and lets you drill into a per-message log: which variant was used, sent/failed status, and any error reported by Instagram.

---

## Settings

The **Settings** screen exposes:

- **Headless mode** — run automation without showing the Chromium window.
- **Sound alerts** — notification sound when a job completes.
- **Refresh session** — re-login an account if it expired.
- **Delete data** — wipe accounts, leads, or everything from the local database.

---

## Updates

MonchoOps checks `monchoops.com/api/version` on startup. When a new version is available, you&apos;ll see a banner with a download link. Updates are manual — you choose when to install them.

---

## FAQ

For specific questions about pricing, safety, proxies, scraping limits, and Instagram compliance, see the FAQ section on [monchoops.com](https://monchoops.com/#faq).
