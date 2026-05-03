import {
  MemoryRouter,
  Navigate,
  Route,
  Routes,
} from "@/components/landing/window-demo-app/vendor/react-router-dom";
import { SessionProvider } from "@/components/landing/window-demo-app/context/SessionContext";
import { AccountsProvider } from "@/components/landing/window-demo-app/context/AccountsContext";
import { JobsProvider } from "@/components/landing/window-demo-app/context/JobsContext";
import { ThemeProvider } from "@/components/landing/window-demo-app/context/ThemeContext";
import { PreferencesProvider } from "@/components/landing/window-demo-app/context/PreferencesContext";
import { AppShell } from "@/components/landing/window-demo-app/components/layout/AppShell";
import { DemoAutoplay } from "@/components/landing/window-demo-app/components/DemoAutoplay";
import { Home } from "@/components/landing/window-demo-app/screens/Home";
import { InstagramAccounts } from "@/components/landing/window-demo-app/screens/InstagramAccounts";
import { MassDMs } from "@/components/landing/window-demo-app/screens/MassDMs";
import { ColdDmHistory } from "@/components/landing/window-demo-app/screens/ColdDmHistory";
import { ColdDmHistoryDetail } from "@/components/landing/window-demo-app/screens/ColdDmHistoryDetail";
import { Scrape } from "@/components/landing/window-demo-app/screens/Scrape";
import { Queue } from "@/components/landing/window-demo-app/screens/Queue";
import { Data } from "@/components/landing/window-demo-app/screens/Data";
import { LeadsDetail } from "@/components/landing/window-demo-app/screens/LeadsDetail";
import { Categories } from "@/components/landing/window-demo-app/screens/Categories";
import { CategoryLeadsDetail } from "@/components/landing/window-demo-app/screens/CategoryLeadsDetail";
import { MessageVariants } from "@/components/landing/window-demo-app/screens/MessageVariants";
import { Settings } from "@/components/landing/window-demo-app/screens/Settings";

export default function App() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <SessionProvider>
          <AccountsProvider>
            <JobsProvider>
              <MemoryRouter>
                <DemoAutoplay />
                <Routes>
                  <Route element={<AppShell />}>
                    <Route index element={<Home />} />
                    <Route path="accounts" element={<InstagramAccounts />} />
                    <Route path="cold-dm" element={<MassDMs />} />
                    <Route path="dm-history" element={<ColdDmHistory />} />
                    <Route path="dm-history/:jobId" element={<ColdDmHistoryDetail />} />
                    <Route path="scrape" element={<Scrape />} />
                    <Route path="queue" element={<Queue />} />
                    <Route path="data" element={<Data />} />
                    <Route path="data/:jobId" element={<LeadsDetail />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/:categoryId" element={<CategoryLeadsDetail />} />
                    <Route path="message-variants" element={<MessageVariants />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Routes>
              </MemoryRouter>
            </JobsProvider>
          </AccountsProvider>
        </SessionProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
