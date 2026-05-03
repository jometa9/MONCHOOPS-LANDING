import Image from "next/image";
import Link from "next/link";
import { MailtoLink } from "@/components/mailto-link";

export function Footer() {
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
        Instagram outreach, on your machine.
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
          Legal
        </Link>
        <Link href="/documentation" aria-label="Docs" className="text-gray-600">
          Docs
        </Link>
        <Link
          href="https://www.linkedin.com/in/joaquinmetayer"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Creator"
          className="text-gray-600"
        >
          Creator
        </Link>
      </div>
      <p className="text-sm text-gray-400 pt-2">
        &copy; {new Date().getFullYear()} MONCHOOPS LLC. All rights reserved.
      </p>
      <p className="text-sm text-gray-400 pt-2">
        Support Email:{" "}
        <MailtoLink
          label="support@monchoops.com"
          copiedLabel="Copied to clipboard"
        />
      </p>
      <p className="text-sm text-gray-400 pt-2 max-w-2xl">
        MonchoOps is an independent desktop tool. We are not affiliated with,
        endorsed by, or sponsored by Instagram or Meta Platforms, Inc. You are
        responsible for using MonchoOps in compliance with Instagram&apos;s
        Terms of Use and applicable laws in your jurisdiction.
      </p>
    </footer>
  );
}
