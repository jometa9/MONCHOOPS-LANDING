"use client";

import { STRINGS } from "@/lib/strings";
import { assetUrl } from "@/lib/asset-url";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type MouseEvent } from "react";

const HOME = assetUrl("/");
const DOWNLOAD_HREF = `${HOME}#download`;

export function LandingHeader() {
  const t = STRINGS.header;
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const navigationLinks = [
    { href: `${HOME}#features`, label: t.features },
    { href: `${HOME}#how-it-works`, label: t.howItWorks },
    { href: DOWNLOAD_HREF, label: t.download },
    { href: "/documentation", label: t.docs },
  ];

  const handleNavClick = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.includes("#")) {
        return;
      }

      event.preventDefault();
      const targetId = href.split("#")[1];

      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState({}, "", `${pathname}#${targetId}`);
        return;
      }

      if (pathname !== "/") {
        await router.push("/");
        setTimeout(() => {
          const checkAndScroll = (checkAttempts = 0) => {
            if (window.location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.replaceState({}, "", `/#${targetId}`);
              setTimeout(() => {
                const attemptScroll = (attempts = 0) => {
                  if (window.location.pathname !== "/") return;
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  } else if (attempts < 15) {
                    setTimeout(() => attemptScroll(attempts + 1), 200);
                  }
                };
                attemptScroll();
              }, 400);
            } else if (checkAttempts < 10) {
              setTimeout(() => checkAndScroll(checkAttempts + 1), 200);
            }
          };
          checkAndScroll();
        }, 500);
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(false);
    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Image
            src="/moncho.svg"
            alt="MonchoOps"
            width={28}
            height={28}
            className="h-7 w-7"
            priority
          />
          <span>MonchoOps</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium  md:flex">
          {navigationLinks.map((link) => {
            if (link.href.includes("#")) {
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => handleNavClick(event, link.href)}
                  className="transition-colors text-gray-400 hover:text-indigo-600 cursor-pointer"
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors text-gray-400 hover:text-indigo-600 cursor-pointer"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={DOWNLOAD_HREF}
            onClick={(event) => handleNavClick(event, DOWNLOAD_HREF)}
            className="rounded-full border border-transparent bg-indigo-600 px-3 py-1 text-sm cursor-pointer text-white shadow-none hover:bg-indigo-700"
          >
            {t.download}
          </a>
        </div>
      </div>
    </header>
  );
}
