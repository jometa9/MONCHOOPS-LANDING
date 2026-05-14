CREATE TABLE IF NOT EXISTS "planLimits" (
  "tier" varchar(20) PRIMARY KEY NOT NULL,
  "accountLimit" integer,
  "dmMonthlyLimit" integer,
  "leadsMonthlyLimit" integer,
  "updatedAt" timestamp DEFAULT now() NOT NULL,
  "updatedBy" uuid REFERENCES "user"("id")
);

INSERT INTO "planLimits" ("tier", "accountLimit", "dmMonthlyLimit", "leadsMonthlyLimit")
VALUES
  ('free', 1, 100, 100),
  ('pro', 5, 5000, 5000),
  ('unlimited', NULL, NULL, NULL)
ON CONFLICT ("tier") DO NOTHING;

ALTER TABLE "userProductSubscription" DROP COLUMN IF EXISTS "accountLimit";
