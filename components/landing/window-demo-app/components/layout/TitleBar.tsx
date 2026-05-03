import { cn } from "@/components/landing/window-demo-app/lib/cn";

interface TitleBarProps {
  title?: string;
  transparent?: boolean;
}

// Mirrors B2DM's TitleBar on macOS: 28px tall, centered title with `pl-20` to
// balance against the traffic lights, semi-transparent backdrop. Electron
// normally provides the traffic lights via `hiddenInset`; on the landing demo
// we render them manually so the chrome looks like the real desktop window.
export function TitleBar({ title = "MonchoOps", transparent = false }: TitleBarProps) {
  return (
    <div
      className={cn(
        "titlebar relative flex items-center justify-center rounded-t-lg",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-background/90 backdrop-blur"
      )}
    >
      {transparent ? null : (
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
      )}
    </div>
  );
}
