ALTER TABLE "appSettings"
ADD COLUMN IF NOT EXISTS "monchoopsVersion" varchar(20) NOT NULL DEFAULT '1.0.0';

UPDATE "appSettings"
SET "monchoopsVersion" = COALESCE(NULLIF("multiWindowsVersion", ''), NULLIF("multiMacVersion", ''), '1.0.0')
WHERE "monchoopsVersion" IS NULL OR "monchoopsVersion" = '';
