export type DownloadOS = "windows" | "mac";

export const DOWNLOAD_URLS: Record<DownloadOS, string> = {
  windows: "https://github.com/jometa/monchoops/releases/latest/download/MonchoOps-Multi-Setup.exe",
  mac: "https://github.com/jometa/monchoops/releases/latest/download/MonchoOps-Multi-Setup.dmg",
};

export const APP_VERSION = "1.0.0";

export const DOWNLOAD_FILENAMES: Record<DownloadOS, string> = {
  windows: "MonchoOps-Multi-Setup.exe",
  mac: "MonchoOps-Multi-Setup.dmg",
};

export function detectOS(): DownloadOS {
  if (typeof window === "undefined") return "windows";
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  return "windows";
}

export function getDownloadUrl(os?: DownloadOS): string {
  const target = os ?? detectOS();
  return DOWNLOAD_URLS[target];
}

export function triggerDownload(os?: DownloadOS): void {
  if (typeof window === "undefined") return;
  const target = os ?? detectOS();
  const url = DOWNLOAD_URLS[target];
  const link = document.createElement("a");
  link.href = url;
  link.download = DOWNLOAD_FILENAMES[target];
  link.target = "_blank";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
