import { and, eq, gte, isNull, sql } from "drizzle-orm";
import { db } from "./drizzle";
import {
  dmEvent,
  instagramAccount,
  scrapeEvent,
  type InstagramAccount,
} from "./schema";
import { startOfCurrentMonthUTC } from "@/lib/subscriptions/plan-limits";

function normalizeUsername(raw: string): string {
  return raw.trim().replace(/^@+/, "").toLowerCase();
}

export async function listActiveInstagramAccounts(
  userId: string
): Promise<InstagramAccount[]> {
  return db
    .select()
    .from(instagramAccount)
    .where(
      and(eq(instagramAccount.userId, userId), isNull(instagramAccount.removedAt))
    );
}

export async function countActiveInstagramAccounts(
  userId: string
): Promise<number> {
  const rows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(instagramAccount)
    .where(
      and(eq(instagramAccount.userId, userId), isNull(instagramAccount.removedAt))
    );
  return rows[0]?.c ?? 0;
}

export interface RegisterAccountResult {
  account: InstagramAccount;
  created: boolean;
  reactivated: boolean;
}

export async function registerInstagramAccount(
  userId: string,
  rawUsername: string,
  deviceId: string | null
): Promise<RegisterAccountResult> {
  const username = normalizeUsername(rawUsername);
  if (!username) {
    throw new Error("username is required");
  }

  const existing = await db
    .select()
    .from(instagramAccount)
    .where(
      and(
        eq(instagramAccount.userId, userId),
        eq(instagramAccount.username, username)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    const row = existing[0];
    if (row.removedAt) {
      const updated = await db
        .update(instagramAccount)
        .set({
          removedAt: null,
          deviceId: deviceId ?? row.deviceId,
          addedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(instagramAccount.id, row.id))
        .returning();
      return { account: updated[0], created: false, reactivated: true };
    }
    if (deviceId && row.deviceId !== deviceId) {
      const updated = await db
        .update(instagramAccount)
        .set({ deviceId, updatedAt: new Date() })
        .where(eq(instagramAccount.id, row.id))
        .returning();
      return { account: updated[0], created: false, reactivated: false };
    }
    return { account: row, created: false, reactivated: false };
  }

  const inserted = await db
    .insert(instagramAccount)
    .values({
      userId,
      username,
      deviceId: deviceId ?? null,
    })
    .returning();
  return { account: inserted[0], created: true, reactivated: false };
}

export async function unregisterInstagramAccount(
  userId: string,
  rawUsername: string
): Promise<boolean> {
  const username = normalizeUsername(rawUsername);
  if (!username) return false;

  const result = await db
    .update(instagramAccount)
    .set({ removedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(instagramAccount.userId, userId),
        eq(instagramAccount.username, username),
        isNull(instagramAccount.removedAt)
      )
    )
    .returning({ id: instagramAccount.id });
  return result.length > 0;
}

export async function countDmsThisMonth(userId: string): Promise<number> {
  const since = startOfCurrentMonthUTC();
  const rows = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(dmEvent)
    .where(and(eq(dmEvent.userId, userId), gte(dmEvent.sentAt, since)));
  return rows[0]?.c ?? 0;
}

export interface RecordDmInput {
  fromUsername: string;
  targetUsername: string;
  deviceId?: string | null;
  sentAt?: Date;
}

export async function recordDmEvents(
  userId: string,
  events: RecordDmInput[]
): Promise<number> {
  if (events.length === 0) return 0;
  const rows = events
    .map((evt) => ({
      userId,
      fromUsername: normalizeUsername(evt.fromUsername),
      targetUsername: normalizeUsername(evt.targetUsername),
      deviceId: evt.deviceId ?? null,
      sentAt: evt.sentAt ?? new Date(),
    }))
    .filter((r) => r.fromUsername && r.targetUsername);
  if (rows.length === 0) return 0;
  await db.insert(dmEvent).values(rows);
  return rows.length;
}

export async function countLeadsThisMonth(userId: string): Promise<number> {
  const since = startOfCurrentMonthUTC();
  const rows = await db
    .select({ c: sql<number>`COALESCE(SUM(${scrapeEvent.leadCount}), 0)::int` })
    .from(scrapeEvent)
    .where(and(eq(scrapeEvent.userId, userId), gte(scrapeEvent.scrapedAt, since)));
  return rows[0]?.c ?? 0;
}

export interface RecordScrapeInput {
  jobId: string;
  kind: string;
  leadCount: number;
  deviceId?: string | null;
  scrapedAt?: Date;
}

export async function recordScrapeEvent(
  userId: string,
  input: RecordScrapeInput
): Promise<number> {
  const jobId = input.jobId.trim();
  const kind = input.kind.trim();
  const leadCount = Math.max(0, Math.floor(input.leadCount));
  if (!jobId || !kind || leadCount === 0) return 0;
  const result = await db
    .insert(scrapeEvent)
    .values({
      userId,
      jobId,
      kind,
      leadCount,
      deviceId: input.deviceId ?? null,
      scrapedAt: input.scrapedAt ?? new Date(),
    })
    .onConflictDoNothing({ target: [scrapeEvent.userId, scrapeEvent.jobId] })
    .returning({ leadCount: scrapeEvent.leadCount });
  return result.length > 0 ? result[0].leadCount : 0;
}
