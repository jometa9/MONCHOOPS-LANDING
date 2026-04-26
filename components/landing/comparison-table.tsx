"use client";

import { Fragment, useState } from "react";
import { Check, X } from "lucide-react";

type CellValue = "yes" | "no" | "varies" | string;

const COMPETITORS = [
  { id: "manychat", name: "Manychat" },
  { id: "phantombuster", name: "Phantombuster" },
  { id: "instantData", name: "InstantData" },
  { id: "diy", name: "DIY scripts" },
] as const;

type CompetitorId = (typeof COMPETITORS)[number]["id"];

interface ComparisonRow {
  feature: string;
  monchoops: CellValue;
  competitors: Record<CompetitorId, CellValue>;
}

const comparisonData: ComparisonRow[] = [
  {
    feature: "Where it runs",
    monchoops: "Your machine",
    competitors: {
      manychat: "Cloud",
      phantombuster: "Cloud",
      instantData: "Cloud",
      diy: "Your machine",
    },
  },
  {
    feature: "Multi-account",
    monchoops: "yes",
    competitors: {
      manychat: "Per workspace",
      phantombuster: "yes",
      instantData: "yes",
      diy: "varies",
    },
  },
  {
    feature: "Proxy per account",
    monchoops: "yes",
    competitors: {
      manychat: "no",
      phantombuster: "varies",
      instantData: "no",
      diy: "yes",
    },
  },
  {
    feature: "Isolated browser per account",
    monchoops: "yes",
    competitors: {
      manychat: "no",
      phantombuster: "no",
      instantData: "no",
      diy: "varies",
    },
  },
  {
    feature: "Account warmup system",
    monchoops: "yes",
    competitors: {
      manychat: "no",
      phantombuster: "no",
      instantData: "no",
      diy: "no",
    },
  },
  {
    feature: "Lead scraping (4 modes)",
    monchoops: "yes",
    competitors: {
      manychat: "no",
      phantombuster: "yes",
      instantData: "yes",
      diy: "varies",
    },
  },
  {
    feature: "Cold DM with variants",
    monchoops: "yes",
    competitors: {
      manychat: "Templates",
      phantombuster: "Templates",
      instantData: "Templates",
      diy: "varies",
    },
  },
  {
    feature: "Data stored locally only",
    monchoops: "yes",
    competitors: {
      manychat: "no",
      phantombuster: "no",
      instantData: "no",
      diy: "yes",
    },
  },
  {
    feature: "Pricing model",
    monchoops: "Flat rate",
    competitors: {
      manychat: "Per contact",
      phantombuster: "Per slot/hour",
      instantData: "Per export",
      diy: "Free",
    },
  },
  {
    feature: "Upfront engineering",
    monchoops: "None",
    competitors: {
      manychat: "None",
      phantombuster: "Some",
      instantData: "None",
      diy: "Significant",
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
    return <span className="text-sm text-white font-semibold">Varies</span>;
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
  if (value === "varies" || value === "Varies") {
    return <span className="text-xs text-gray-600 leading-snug">Varies</span>;
  }
  return <span className="text-xs text-gray-600 leading-snug">{value}</span>;
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
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <section className="pt-14 max-w-7xl mx-auto px-3">
      <div className="mb-10 text-left">
        <p className="text-xl text-gray-600 mb-1">How we compare</p>
        <h2 className="flex flex-col items-start gap-1 text-3xl text-gray-900 md:flex-row md:flex-wrap md:gap-x-2 md:gap-y-0 md:text-5xl">
          <span>MonchoOps vs.</span>
          <span>cloud Instagram tools</span>
        </h2>
        <p className="mt-3 text-sm text-gray-500 max-w-2xl">
          Cloud DM tools share IPs and store your sessions on their servers.
          MonchoOps runs on your machine, with your proxy, and keeps everything
          encrypted on your disk.
        </p>
      </div>

      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <div className={`grid w-full gap-0 ${GRID_COLS}`}>
          <div className="min-w-0 px-4 py-4 text-sm font-medium text-gray-500 border-b border-gray-200 bg-gray-50 flex items-center justify-center text-center">
            Feature
          </div>
          <div className="px-3 py-4 flex items-center justify-center text-center bg-gray-900 border-x border-b border-gray-900">
            <span className="font-bold text-lg text-white mx-1">MonchoOps</span>
          </div>
          {COMPETITORS.map((c, idx) => (
            <div
              key={c.id}
              className={`px-2 py-4 flex items-center justify-center border-b border-gray-200 bg-gray-50 ${
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
            const monchoopsBgBorder = "bg-gray-900 border-x border-gray-900";
            const bottomRuleDark = isLastRow ? "" : "border-b border-gray-900";
            const rowProps = {
              "data-comparison-row": i,
              onMouseEnter: () => setHoveredRow(i),
              onMouseLeave: rowLeaveHandler(i, setHoveredRow),
            } as const;

            return (
              <Fragment key={row.feature}>
                <div
                  {...rowProps}
                  className={`min-w-0 px-4 py-3.5 text-sm font-medium text-gray-700 transition-colors duration-150 ${bottomRule} ${featureBg} flex items-center justify-center text-center`}
                >
                  {row.feature}
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
        Comparison reflects publicly stated features at time of writing. We are
        not affiliated with any of the products listed.
      </p>
    </section>
  );
}
