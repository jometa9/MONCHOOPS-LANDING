"use client";

import { Fragment, useState } from "react";
import { Check, X } from "lucide-react";
import { STRINGS } from "@/lib/strings";

type CellValue = "yes" | "no" | "varies" | string;

const COMPETITORS = [
  { id: "autoreacher", name: "AutoReacher" },
  { id: "instadm", name: "InstaDM" },
  { id: "manychat", name: "Manychat" },
  { id: "phantombuster", name: "Phantombuster" },
] as const;

type CompetitorId = (typeof COMPETITORS)[number]["id"];

interface ComparisonRow {
  featureKey: string;
  monchoops: CellValue;
  competitors: Record<CompetitorId, CellValue>;
}

const GRID_COLS =
  "grid-cols-[minmax(11rem,1.35fr)_minmax(max-content,1fr)_repeat(4,minmax(max-content,1fr))]";

function rowLeaveHandler(
  i: number,
  setHoveredRow: (row: number | null) => void
) {
  return (e: React.MouseEvent) => {
    const to = e.relatedTarget;
    const el =
      to instanceof Element ? to.closest("[data-comparison-row]") : null;
    if (el?.getAttribute("data-comparison-row") === String(i)) return;
    setHoveredRow(null);
  };
}

export function ComparisonTable() {
  const t = STRINGS.comparison;
  const variesText = STRINGS.common.varies;
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const comparisonData: ComparisonRow[] = [
    {
      featureKey: "isolatedBrowser",
      monchoops: "yes",
      competitors: {
        autoreacher: "no",
        instadm: "no",
        manychat: "no",
        phantombuster: "no",
      },
    },
    {
      featureKey: "preDm",
      monchoops: "yes",
      competitors: {
        autoreacher: "no",
        instadm: "no",
        manychat: "no",
        phantombuster: "no",
      },
    },
    {
      featureKey: "autoSkip",
      monchoops: "yes",
      competitors: {
        autoreacher: "varies",
        instadm: "no",
        manychat: "no",
        phantombuster: "no",
      },
    },
    {
      featureKey: "localOnly",
      monchoops: "yes",
      competitors: {
        autoreacher: "no",
        instadm: "no",
        manychat: "no",
        phantombuster: "no",
      },
    },
    {
      featureKey: "variants",
      monchoops: "yes",
      competitors: {
        autoreacher: "yes",
        instadm: t.values.templates,
        manychat: t.values.templates,
        phantombuster: t.values.templates,
      },
    },
    {
      featureKey: "whereItRuns",
      monchoops: t.values.yourMachine,
      competitors: {
        autoreacher: t.values.cloud,
        instadm: t.values.cloud,
        manychat: t.values.cloud,
        phantombuster: t.values.cloud,
      },
    },
    {
      featureKey: "pricingModel",
      monchoops: t.values.free,
      competitors: {
        autoreacher: t.values.perAccount,
        instadm: t.values.subscription,
        manychat: t.values.perContact,
        phantombuster: t.values.perSlotHour,
      },
    },
    {
      featureKey: "loginRequired",
      monchoops: "no",
      competitors: {
        autoreacher: "yes",
        instadm: "yes",
        manychat: "yes",
        phantombuster: "yes",
      },
    },
    {
      featureKey: "perRecipientLog",
      monchoops: "yes",
      competitors: {
        autoreacher: "yes",
        instadm: t.values.limited,
        manychat: t.values.limited,
        phantombuster: "no",
      },
    },
    {
      featureKey: "proxyPerAccount",
      monchoops: "yes",
      competitors: {
        autoreacher: "yes",
        instadm: "yes",
        manychat: "no",
        phantombuster: "varies",
      },
    },
    {
      featureKey: "scraping4modes",
      monchoops: "yes",
      competitors: {
        autoreacher: "yes",
        instadm: "varies",
        manychat: "no",
        phantombuster: "yes",
      },
    },
    {
      featureKey: "multiAccount",
      monchoops: "yes",
      competitors: {
        autoreacher: "yes",
        instadm: "yes",
        manychat: t.values.perWorkspace,
        phantombuster: "yes",
      },
    },
    {
      featureKey: "engineering",
      monchoops: t.values.noneVal,
      competitors: {
        autoreacher: t.values.noneVal,
        instadm: t.values.noneVal,
        manychat: t.values.noneVal,
        phantombuster: t.values.someVal,
      },
    },
  ];

  function MonchoOpsCellValue({ value }: { value: string }) {
    if (value === "yes") {
      return <Check className="h-4 w-4 text-white mx-auto" strokeWidth={2.5} />;
    }
    if (value === "no") {
      return <X className="h-4 w-4 text-red-300 mx-auto" strokeWidth={2.5} />;
    }
    if (value === "varies") {
      return <span className="text-sm text-white font-semibold">{variesText}</span>;
    }
    return (
      <span className="text-xs font-medium text-white bg-white/15 border border-white/30 rounded-full px-2.5 py-0.5">
        {value}
      </span>
    );
  }

  function CompetitorCellValue({ value }: { value: string }) {
    if (value === "yes") {
      return <Check className="h-4 w-4 text-emerald-600 mx-auto" />;
    }
    if (value === "no") {
      return <X className="h-4 w-4 text-red-500 mx-auto" />;
    }
    if (value === "varies") {
      return <span className="text-xs text-gray-600 leading-snug">{variesText}</span>;
    }
    return <span className="text-xs text-gray-600 leading-snug">{value}</span>;
  }

  return (
    <section className="pt-24 max-w-7xl mx-auto px-3">
      <div className="mb-10 text-left">
        <p className="text-xl text-gray-600 mb-1">{t.eyebrow}</p>
        <h2 className="flex flex-col items-start gap-1 text-3xl text-gray-900 md:flex-row md:flex-wrap md:gap-x-2 md:gap-y-0 md:text-5xl">
          <span>{t.headingP1}</span>
          <span>{t.headingP2}</span>
        </h2>
        <p className="mt-3 text-sm text-gray-500 max-w-2xl">
          {t.intro}
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className={`grid w-full gap-0 ${GRID_COLS}`}>
          <div className="min-w-0 px-3 py-4 text-sm font-medium text-gray-500 border-b border-gray-200 bg-gray-50 flex items-center justify-center text-center">
            {t.feature}
          </div>
          <div className="px-3 py-4 flex items-center justify-center text-center bg-indigo-950 border-x border-indigo-950 border-b border-white/20">
            <span className="text-sm font-medium text-white mx-1">MonchoOps</span>
          </div>
          {COMPETITORS.map((c, idx) => (
            <div
              key={c.id}
              className={`px-6 py-4 flex items-center justify-center border-b border-gray-200 bg-gray-50 ${
                idx < COMPETITORS.length - 1 ? "border-r border-gray-200" : ""
              }`}
            >
              <span className="text-sm font-medium text-gray-600">{c.name}</span>
            </div>
          ))}

          {comparisonData.map((row, i) => {
            const isLastRow = i === comparisonData.length - 1;
            const bottomRule = isLastRow ? "" : "border-b border-gray-200";
            const isWhiteStripe = i % 2 === 0;
            const isHovered = hoveredRow === i;
            const featureBg = isWhiteStripe
              ? isHovered
                ? "bg-gray-50/50"
                : "bg-white"
              : isHovered
                ? "bg-white"
                : "bg-gray-50/50";
            const competitorBg = featureBg;
            const monchoopsBgBorder = "bg-indigo-950 border-x border-indigo-950";
            const bottomRuleDark = isLastRow ? "" : "border-b border-white/20";
            const rowProps = {
              "data-comparison-row": i,
              onMouseEnter: () => setHoveredRow(i),
              onMouseLeave: rowLeaveHandler(i, setHoveredRow),
            } as const;

            return (
              <Fragment key={row.featureKey}>
                <div
                  {...rowProps}
                  className={`min-w-0 px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors duration-150 ${bottomRule} ${featureBg} flex items-center justify-center text-center`}
                >
                  {t.rows[row.featureKey as keyof typeof t.rows]}
                </div>
                <div
                  {...rowProps}
                  className={`min-w-0 flex items-center justify-center px-3 py-3.5 text-center transition-colors duration-150 ${monchoopsBgBorder} ${bottomRuleDark}`}
                >
                  <MonchoOpsCellValue value={row.monchoops} />
                </div>
                {COMPETITORS.map((c, idx) => (
                  <div
                    key={c.id}
                    {...rowProps}
                    className={`min-w-0 px-2 py-3.5 flex items-center justify-center text-center transition-colors duration-150 ${bottomRule} ${competitorBg} ${
                      idx < COMPETITORS.length - 1
                        ? "border-r border-gray-200"
                        : ""
                    }`}
                  >
                    <CompetitorCellValue value={row.competitors[c.id]} />
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-400">
        {t.footnote}
      </p>
    </section>
  );
}
