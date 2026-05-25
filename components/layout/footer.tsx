import Image from "next/image";
import Link from "next/link";
import { STRINGS } from "@/lib/strings";

export function Footer() {
  const t = STRINGS.footer;

  return (
    <footer className="w-full p-3 max-w-7xl mx-auto py-16" role="contentinfo">
      <Link href="/" className="flex items-center gap-2 pt-2">
        <Image
          src="/moncho.svg"
          alt="MonchoOps"
          width={28}
          height={28}
          className="h-7 w-7"
        />
        <span className="text-xl font-bold text-black">MonchoOps</span>
      </Link>
      <p className="text-sm text-gray-400 pt-1">{t.tagline}</p>

      <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm pt-2">
        <Link href="/documentation" aria-label="Docs" className="text-gray-600">
          {t.docs}
        </Link>
        <Link href="/legal" aria-label="Legal" className="text-gray-600">
          Legal
        </Link>
      </div>
      <p className="text-sm text-gray-400 pt-2">
        &copy; {new Date().getFullYear()} MonchoOps. {t.rights}
      </p>
    </footer>
  );
}
