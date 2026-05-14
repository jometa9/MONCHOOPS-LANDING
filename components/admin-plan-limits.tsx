"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Tier = "free" | "pro" | "unlimited";

interface TierLimits {
  accountLimit: number | null;
  dmMonthlyLimit: number | null;
  leadsMonthlyLimit: number | null;
}

type State = Record<Tier, TierLimits>;

const TIERS: Tier[] = ["free", "pro", "unlimited"];
const FIELDS: { key: keyof TierLimits; labelKey: string }[] = [
  { key: "accountLimit", labelKey: "planLimitsAccounts" },
  { key: "dmMonthlyLimit", labelKey: "planLimitsDms" },
  { key: "leadsMonthlyLimit", labelKey: "planLimitsLeads" },
];

function emptyState(): State {
  return {
    free: { accountLimit: 0, dmMonthlyLimit: 0, leadsMonthlyLimit: 0 },
    pro: { accountLimit: 0, dmMonthlyLimit: 0, leadsMonthlyLimit: 0 },
    unlimited: { accountLimit: null, dmMonthlyLimit: null, leadsMonthlyLimit: null },
  };
}

function toInput(value: number | null): string {
  return value === null ? "" : String(value);
}

function parseInput(raw: string): number | null | "invalid" {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) return "invalid";
  return Math.floor(parsed);
}

export default function AdminPlanLimits() {
  const t = useTranslations("admin");
  const [state, setState] = useState<State>(emptyState);
  const [original, setOriginal] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonStatus, setButtonStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/plan-limits");
        if (!res.ok) return;
        const data = (await res.json()) as State;
        if (cancelled) return;
        setState(data);
        setOriginal(data);
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (tier: Tier, field: keyof TierLimits, raw: string) => {
    const parsed = parseInput(raw);
    if (parsed === "invalid") return;
    setState((prev) => ({
      ...prev,
      [tier]: { ...prev[tier], [field]: parsed },
    }));
  };

  const hasChanges =
    original !== null && JSON.stringify(state) !== JSON.stringify(original);

  const submit = async () => {
    setIsLoading(true);
    setButtonStatus(null);
    try {
      const res = await fetch("/api/admin/plan-limits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = (await res.json()) as State | { error?: string };
      if (!res.ok || "error" in data) throw new Error("update failed");
      setState(data as State);
      setOriginal(data as State);
      setButtonStatus("success");
      setTimeout(() => setButtonStatus(null), 2000);
    } catch {
      setButtonStatus("error");
      setTimeout(() => setButtonStatus(null), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {t("planLimitsHelp")}
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier}
            className="rounded-md border border-gray-200 bg-white p-3 space-y-2"
          >
            <p className="text-sm font-medium capitalize">{tier}</p>
            {FIELDS.map(({ key, labelKey }) => (
              <div key={key} className="grid w-full items-center gap-1.5">
                <Label
                  htmlFor={`${tier}-${key}`}
                  className="text-xs text-muted-foreground"
                >
                  {t(labelKey)}
                </Label>
                <Input
                  id={`${tier}-${key}`}
                  type="number"
                  min={0}
                  placeholder={t("planLimitsUnlimitedPlaceholder")}
                  value={toInput(state[tier][key])}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setField(tier, key, e.target.value)
                  }
                  className="shadow-none text-sm"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button
        onClick={submit}
        disabled={isLoading || !hasChanges}
        className="w-full"
      >
        {isLoading
          ? t("updating")
          : buttonStatus === "success"
            ? t("success")
            : buttonStatus === "error"
              ? t("error")
              : t("updatePlanLimits")}
      </Button>
    </div>
  );
}
