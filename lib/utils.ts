import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const backgroundColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-cyan-500",
];

export function getAvatarBgColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % backgroundColors.length;
  return backgroundColors[index];
}

export function getAvatarTextColor(bgColor: string): string {
  return bgColor.includes("yellow") || bgColor.includes("pink")
    ? "text-gray-900"
    : "text-white";
}

export function formatCurrency(amount: number): string {
  const parts = amount.toFixed(2).split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${integerPart},${parts[1]}`;
}

export function formatPrice(amount: number): string {
  if (Number.isInteger(amount)) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const parts = amount.toFixed(2).split(".");
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimalPart = parts[1].replace(/0+$/, "");
  return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
}
