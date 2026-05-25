import { assetUrl } from "@/lib/asset-url";

export function MacOSIcon({ className }: { className?: string }) {
  return (
    <img
      src={assetUrl("/assets/apple-logo.png")}
      alt="macOS"
      className={className}
    />
  );
}
