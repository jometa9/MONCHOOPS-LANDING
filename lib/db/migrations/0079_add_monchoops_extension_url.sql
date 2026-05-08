-- Store the Chrome Web Store URL for the MonchoOps extension alongside the
-- desktop app download URLs so it can be configured from the admin app
-- settings panel and consumed by the landing, dashboard and Electron app.
ALTER TABLE "appSettings" ADD COLUMN IF NOT EXISTS "monchoopsExtensionUrl" text;
