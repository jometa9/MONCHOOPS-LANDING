-- Drop email/password authentication fields from user table.
-- Auth is now Google OAuth only; password reset flow no longer exists.
ALTER TABLE "user" DROP COLUMN IF EXISTS "passwordHash";
ALTER TABLE "user" DROP COLUMN IF EXISTS "resetToken";
ALTER TABLE "user" DROP COLUMN IF EXISTS "resetTokenExpiry";
