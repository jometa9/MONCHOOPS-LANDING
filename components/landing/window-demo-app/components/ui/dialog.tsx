import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/components/landing/window-demo-app/lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, title, description, children, footer, className }: DialogProps) {
  const sentinelRef = useRef<HTMLSpanElement | null>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const node = sentinelRef.current;
    if (!node) return;
    const root = node.closest<HTMLElement>('[data-demo-modal-root]');
    setTarget(root ?? null);
  }, [open]);

  if (!open) return <span ref={sentinelRef} hidden />;

  return (
    <>
      <span ref={sentinelRef} hidden />
      {target
        ? createPortal(
            <div className="absolute inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30" onClick={onClose} />
              <div
                className={cn(
                  'relative z-10 w-full max-w-md border border-border bg-background p-6 shadow-lg',
                  className
                )}
              >
                {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
                {description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
                <div className="mt-4">{children}</div>
                {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
              </div>
            </div>,
            target
          )
        : null}
    </>
  );
}
