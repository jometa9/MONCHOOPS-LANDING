import { Outlet } from '@/components/landing/window-demo-app/vendor/react-router-dom';
import { Sidebar } from './Sidebar';
import { TitleBar } from './TitleBar';
import { assetUrl } from '@/lib/asset-url';

export function AppShell() {
  const bgMask = `url(${assetUrl('/home-bg.svg')})`;
  return (
    <div className="relative flex h-full flex-col" data-demo-modal-root>
      <TitleBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative isolate flex-1 overflow-auto">
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[50cqh] bg-foreground/[0.03]"
            style={{
              aspectRatio: '1280 / 1116',
              WebkitMaskImage: bgMask,
              maskImage: bgMask,
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'bottom left',
              maskPosition: 'bottom left',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
            }}
          />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
