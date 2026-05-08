export function MonchoWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[50vh] bg-foreground/[0.03]"
      style={{
        aspectRatio: "1280 / 1116",
        WebkitMaskImage: "url(/home-bg.svg)",
        maskImage: "url(/home-bg.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "bottom left",
        maskPosition: "bottom left",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
