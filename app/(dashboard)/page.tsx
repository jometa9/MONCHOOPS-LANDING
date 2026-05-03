"use client";

import { CallToActionSection } from "@/components/landing/call-to-action-section";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { FAQSection } from "@/components/landing/faq-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FounderCard } from "@/components/landing/founder-card";
import { LandingHeader } from "@/components/landing/landing-header";
import { MonchoOpsWindowDemo } from "@/components/landing/monchoops-window-demo";
import { ProductsSection } from "@/components/landing/products-section";
import { Footer } from "@/components/layout/footer";
import { useMetaPixel } from "@/components/meta-pixel";
import { PricingSection } from "@/components/pricing-section";
import { StepsSection } from "@/components/steps-section";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { handleDownload } from "@/lib/download-handler";
import {
  ArrowRight,
  AtSign,
  Bell,
  Heart,
  MessageCircle,
  Send,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Suspense, useEffect, useState } from "react";

export default function HomePage() {
  const { trackViewContent } = useMetaPixel();
  const [hasTrackedPricingView, setHasTrackedPricingView] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoadingDownloadUrl, setIsLoadingDownloadUrl] = useState(true);

  useEffect(() => {
    const fetchDownloadUrl = async () => {
      try {
        const response = await fetch("/api/download-url");
        if (response.ok) {
          const data = await response.json();
          setDownloadUrl(data.downloadUrl || null);
        }
      } catch (error) {
        console.error("Failed to fetch download URL:", error);
      } finally {
        setIsLoadingDownloadUrl(false);
      }
    };

    fetchDownloadUrl();
  }, []);

  useEffect(() => {
    const trackPricingView = () => {
      const pricingSection = document.getElementById("prices");
      if (pricingSection && !hasTrackedPricingView) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !hasTrackedPricingView) {
                const eventId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
                trackViewContent(
                  {
                    content_name: "Pricing Section - Homepage",
                    content_category: "subscription",
                  },
                  eventId
                );
                setHasTrackedPricingView(true);
                observer.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );
        observer.observe(pricingSection);
        return () => observer.disconnect();
      }
    };

    const timeout = setTimeout(trackPricingView, 500);
    return () => clearTimeout(timeout);
  }, [trackViewContent, hasTrackedPricingView]);

  useEffect(() => {
    const handleHashScroll = (isInitial = false) => {
      const hash = window.location.hash;
      if (hash) {
        const targetId = hash.substring(1);

        const attemptScroll = (attempts = 0) => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          } else if (attempts < 20) {
            setTimeout(() => attemptScroll(attempts + 1), 200);
          }
        };

        if (isInitial) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setTimeout(() => {
            attemptScroll();
          }, 400);
        } else {
          attemptScroll();
        }
      }
    };

    handleHashScroll(true);

    const handleHashChange = () => {
      handleHashScroll(false);
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleDownloadClick = async () => {
    if (isLoadingDownloadUrl) {
      window.open("/dashboard", "_blank");
      return;
    }

    if (downloadUrl) {
      await handleDownload();
    } else {
      window.open("/dashboard", "_blank");
    }
  };

  return (
    <>
      <StructuredData type="website" />
      <StructuredData type="organization" />
      <StructuredData type="software" />
      <StructuredData type="product" />
      <StructuredData type="faq" />
      <LandingHeader />
      <main data-page="home" className="pt-30">
        <div className="max-w-7xl mx-auto px-3 pb-0 relative">
  
          <h1 className="md:text-5xl text-3xl font-semibold text-gray-900 tracking-tight max-w-4xl relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-700 to-indigo-600">
              Scrape any lead on Instagram.
              <br />
              Cold DM them at scale.


            </span>
          </h1>
          <p className="mt-4 text-gray-600 text-xl max-w-2xl">
Pull leads from any profile, post, hashtag, or location. Send personalized DMs from every account you own, in parallel.          </p>
        </div>
        <div className="max-w-7xl mx-auto px-3 pb-0 flex items-center gap-3 flex-wrap">
          <Button
            type="button"
            onClick={handleDownloadClick}
            className="mt-4 inline-flex items-center gap-3 rounded-full bg-indigo-600 px-3 py-4 text-md text-white transition-all duration-200 hover:bg-indigo-700"
          >
            <span>Get started for free</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href="#how-it-works"
            className="mt-4 hidden md:inline-flex items-center gap-3 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-md text-gray-900 transition-all duration-200 hover:bg-gray-100"
          >
            See how it works
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-3 pt-3 text-xs text-gray-500">
          Free plan included · Windows &amp; macOS · No card required
        </div>

        <section className="max-w-7xl mx-auto px-3 pt-8 user-select-none">
          <div
            className="grid gap-8 items-center p-6 md:p-12 rounded-lg relative overflow-hidden "
            style={{
              background:
                "linear-gradient(180deg, #3730a3 0%, #c7d2fe 100%)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(199,210,254,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(199,210,254,0.18) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                maskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 90% 80% at 50% 50%, black 30%, transparent 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 75% 50%, rgba(165,180,252,0.55) 0%, rgba(165,180,252,0) 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 50% 40% at 80% 100%, rgba(129,140,248,0.6) 0%, rgba(129,140,248,0) 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 55% 65% at 15% 40%, rgba(99,102,241,0.35) 0%, rgba(99,102,241,0) 70%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden md:block overflow-hidden"
            >
              <style>{`
                @keyframes monchoFloat {
                  0%   { transform: translate3d(0, 40px, 0) rotate(0deg) scale(0.6); opacity: 0; }
                  15%  { opacity: 1; }
                  85%  { opacity: 1; }
                  100% { transform: translate3d(60px, -120px, 0) rotate(180deg) scale(1.05); opacity: 0; }
                }
                .moncho-sparkle {
                  position: absolute;
                  color: rgba(255,255,255,0.95);
                  filter: drop-shadow(0 0 6px rgba(199,210,254,0.85)) drop-shadow(0 0 14px rgba(165,180,252,0.55));
                  animation: monchoFloat linear infinite;
                  will-change: transform, opacity;
                }
                .moncho-sparkle svg { display: block; width: 100%; height: 100%; }
              `}</style>
              {[
                { left: '6%',  top: '70%', size: 18, dur: '9s',  delay: '0s' },
                { left: '12%', top: '85%', size: 12, dur: '11s', delay: '1.5s' },
                { left: '18%', top: '60%', size: 22, dur: '13s', delay: '3s' },
                { left: '4%',  top: '50%', size: 14, dur: '10s', delay: '4.5s' },
                { left: '22%', top: '90%', size: 10, dur: '8s',  delay: '2s' },
                { left: '10%', top: '40%', size: 13, dur: '12s', delay: '6s' },
                { left: '26%', top: '75%', size: 16, dur: '14s', delay: '0.5s' },
              ].map((s, i) => (
                <span
                  key={i}
                  className="moncho-sparkle"
                  style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDuration: s.dur, animationDelay: s.delay }}
                >
                  <Sparkles className="w-full h-full" strokeWidth={1.5} />
                </span>
              ))}
            </div>
            <div className="bg-white w-full mx-auto md:ml-auto md:mr-0 aspect-[980/600] rounded-lg relative transition-transform duration-0 overflow-hidden z-10 shadow-2xl shadow-indigo-500/30 ring-1 ring-white/10">
              <MonchoOpsWindowDemo />
            </div>
          </div>
        </section>

        <div className="py-24 px-6" id="features">
          <h2 className="text-3xl text-center text-gray-900 mb-1">
            One app to scrape leads and send cold DMs on Instagram
          </h2>
          <p className="text-md text-center text-gray-600 max-w-2xl mx-auto px-6">
            Stop paying for two SaaS tools and copy-pasting CSVs between
            them. One desktop app does the whole flow.
          </p>
        </div>

        <FeaturesSection />

        <div id="how-it-works" className="pt-24">
          <StepsSection />
        </div>

        <ProductsSection />

        <ComparisonTable />

        <Suspense
          fallback={
            <div className="py-24 text-center text-gray-600">
              Loading pricing...
            </div>
          }
        >
          <PricingSection variant="landing" />
        </Suspense>

        <div className="max-w-7xl pt-24 mx-auto px-3 grid grid-cols-1 md:grid-cols-6 md:gap-3">
          <div className="md:col-span-4 pb-6">
            <p className="text-xl text-gray-600 mb-1">Common questions</p>
            <p className="md:text-3xl text-2xl mb-3 text-gray-900">
              Frequently Asked Questions
            </p>
            <FAQSection />
          </div>
          <div className="md:col-span-2 mb-3">
            <FounderCard />
          </div>
        </div>

        <CallToActionSection onDownloadClick={handleDownloadClick} />
      </main>
      <Footer />
    </>
  );
}
