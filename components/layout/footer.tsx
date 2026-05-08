import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { MailtoLink } from "@/components/mailto-link";

export function Footer() {
  const t = useTranslations("footer");
  const tCommon = useTranslations("common");

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
      <p className="text-sm text-gray-400 pt-1">
        {t("tagline")}
      </p>

      <div className="flex flex-wrap gap-x-2 gap-y-1 text-sm pt-2">
        <Link
          href="https://www.instagram.com/monchoops"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-gray-600"
        >
          Instagram
        </Link>
        <Link
          href="https://www.linkedin.com/company/monchoops"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-gray-600"
        >
          LinkedIn
        </Link>
        <MailtoLink label="Mail" className="text-gray-600" />
        <Link href="/legal" aria-label="Legal" className="text-gray-600">
          {t("legal")}
        </Link>
        <Link href="/documentation" aria-label="Docs" className="text-gray-600">
          {t("docs")}
        </Link>
        <Link
          href="https://www.linkedin.com/in/joaquinmetayer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Creator"
          className="text-gray-600"
        >
          {t("creator")}
        </Link>
      </div>
      <p className="text-sm text-gray-400 pt-2">
        &copy; {new Date().getFullYear()} IPTRADE COPIER LLC. {t("rights")} {t("createdBy")}{" "}
        <Link
          href="https://api2labs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          API2LABS
        </Link>
        .
      </p>
      <p className="text-sm text-gray-400 pt-2">
        {t("supportEmail")}{" "}
        <MailtoLink
          label="support@monchoops.com"
          copiedLabel={tCommon("copied")}
        />
      </p>
      <p className="text-sm text-gray-400 pt-2 max-w-2xl">
        {t("disclaimer")}
      </p>
    </footer>
  );
}
