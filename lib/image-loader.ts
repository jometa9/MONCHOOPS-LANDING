const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function imageLoader({ src }: { src: string }): string {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const normalized = src.startsWith("/") ? src : `/${src}`;
  if (normalized.startsWith(`${BASE_PATH}/`)) return normalized;
  return `${BASE_PATH}${normalized}`;
}
