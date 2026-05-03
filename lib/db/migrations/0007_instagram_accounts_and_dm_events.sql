CREATE TABLE IF NOT EXISTS "instagramAccount" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL,
  "username" varchar(60) NOT NULL,
  "deviceId" varchar(100),
  "addedAt" timestamp DEFAULT now() NOT NULL,
  "removedAt" timestamp,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "instagramAccount_userId_user_id_fk"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "instagramAccount_user_username_unique"
  ON "instagramAccount" ("userId", "username");

CREATE INDEX IF NOT EXISTS "instagramAccount_userId_idx"
  ON "instagramAccount" ("userId");

CREATE TABLE IF NOT EXISTS "dmEvent" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "userId" uuid NOT NULL,
  "fromUsername" varchar(60) NOT NULL,
  "targetUsername" varchar(60) NOT NULL,
  "deviceId" varchar(100),
  "sentAt" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "dmEvent_userId_user_id_fk"
    FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "dmEvent_user_sentAt_idx"
  ON "dmEvent" ("userId", "sentAt");
