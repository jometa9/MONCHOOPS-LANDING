CREATE TABLE IF NOT EXISTS "scrapeEvent" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "userId" uuid NOT NULL,
  "jobId" varchar(100) NOT NULL,
  "kind" varchar(40) NOT NULL,
  "leadCount" integer NOT NULL,
  "deviceId" varchar(100),
  "scrapedAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "scrapeEvent_userId_user_id_fk"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "scrapeEvent_user_scrapedAt_idx"
  ON "scrapeEvent" ("userId", "scrapedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "scrapeEvent_user_jobId_unique"
  ON "scrapeEvent" ("userId", "jobId");
