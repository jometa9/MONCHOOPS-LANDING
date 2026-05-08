import { ProductKey } from "@/lib/db/schema";

export type DownloadOS = "windows" | "mac";

export const detectOS = (): DownloadOS => {
  if (typeof window === "undefined") return "windows";

  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes("mac")) return "mac";
  return "windows";
};

export function getDownloadEventId(): string {
  return `download-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

export const trackDownloadEvent = (
  productKey: ProductKey,
  os: DownloadOS,
  eventId: string
) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      content_name: `MonchoOps ${productKey.toUpperCase()} Download`,
      content_category: "app_download",
      content_ids: [productKey],
      custom_data: { productKey, os },
      eventID: eventId,
    });
  }
};

export const handleDownload = async (
  productKey: ProductKey = "monchoops",
  os?: DownloadOS
) => {
  try {
    const detectedOS = os || detectOS();
    const eventId = getDownloadEventId();

    const response = await fetch("/api/app-version");

    if (!response.ok) {
      throw new Error("Failed to fetch app version");
    }

    const data = await response.json();
    const downloadUrl: string = data?.downloadUrls?.[detectedOS] || "";

    if (!downloadUrl) {
      alert("Download link is not configured. Please contact support.");
      return;
    }

    trackDownloadEvent(productKey, detectedOS, eventId);
    void fetch("/api/track-download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ os: detectedOS, metaEventId: eventId }),
    }).catch(() => {});

    const link = document.createElement("a");
    link.href = downloadUrl;

    const fileName = detectedOS === "mac"
      ? "MonchoOps-Multi-Setup.dmg"
      : "MonchoOps-Multi-Setup.exe";

    link.download = fileName;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch {
    alert(
      "Failed to download the installer. Please try again or contact support."
    );
  }
};

export const fetchAppVersion = async () => {
  try {
    const response = await fetch("/api/app-version");

    if (!response.ok) {
      throw new Error("Failed to fetch app version");
    }

    return (await response.json()) as {
      version: string;
      downloadUrls: { mac: string; windows: string };
    };
  } catch {
    return null;
  }
};
