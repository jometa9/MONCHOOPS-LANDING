"use client";

import { BackgroundGradientAnimation } from "@/components/landing/background-gradient-animation";

export type AIAssistantAmbientBgVariant = "section" | "card";

export function AIAssistantAmbientBg({
  variant,
}: {
  variant: AIAssistantAmbientBgVariant;
}) {
  const card = variant === "card";

  return (
    <>
      <BackgroundGradientAnimation
        className="absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        size={card ? "72%" : "88%"}
        blendingValue="darken"
        gradientBackgroundStart="rgb(46, 16, 64)"
        gradientBackgroundEnd="rgb(28, 16, 60)"
        firstColor="88, 28, 135"
        secondColor="131, 58, 180"
        thirdColor="120, 40, 140"
        fourthColor="157, 23, 77"
        fifthColor="76, 29, 149"
        pointerColor="131, 58, 180"
      />
      <div className="pointer-events-none absolute inset-0 z-1 bg-[#1a0a2e]/50 backdrop-blur-md transition-colors duration-300 group-hover:bg-[#1a0a2e]/40" />
    </>
  );
}
