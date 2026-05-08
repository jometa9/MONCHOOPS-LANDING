"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import en from "./locales/en.json";
import es from "./locales/es.json";

export type DemoLocale = "en" | "es";

const RESOURCES: Record<DemoLocale, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  es: es as Record<string, unknown>,
};

interface DemoI18nContextValue {
  locale: DemoLocale;
  t: TFunction;
}

type TOptions =
  | (Record<string, string | number> & { count?: number; defaultValue?: string })
  | undefined;

export type TFunction = (key: string, options?: TOptions) => string;

const DemoI18nContext = createContext<DemoI18nContextValue | null>(null);

function lookup(resources: Record<string, unknown>, key: string): unknown {
  const parts = key.split(".");
  let cur: unknown = resources;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return cur;
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) => {
    const v = vars[name];
    return v === undefined || v === null ? match : String(v);
  });
}

function pickPlural(key: string, count: number): string {
  return count === 1 ? `${key}_one` : `${key}_other`;
}

function makeT(locale: DemoLocale): TFunction {
  const primary = RESOURCES[locale];
  const fallback = RESOURCES.en;
  return function t(key: string, options?: TOptions): string {
    let lookupKey = key;
    if (options && typeof options.count === "number") {
      const pluralKey = pickPlural(key, options.count);
      const candidate = lookup(primary, pluralKey) ?? lookup(fallback, pluralKey);
      if (typeof candidate === "string") {
        return interpolate(candidate, options as Record<string, string | number>);
      }
    }
    const value = lookup(primary, lookupKey) ?? lookup(fallback, lookupKey);
    if (typeof value === "string") {
      return interpolate(value, options as Record<string, string | number> | undefined);
    }
    if (options && typeof options.defaultValue === "string") {
      return interpolate(options.defaultValue, options as Record<string, string | number>);
    }
    return key;
  };
}

interface DemoI18nProviderProps {
  locale: DemoLocale;
  children: ReactNode;
}

export function DemoI18nProvider({ locale, children }: DemoI18nProviderProps) {
  const value = useMemo<DemoI18nContextValue>(() => ({ locale, t: makeT(locale) }), [locale]);
  return <DemoI18nContext.Provider value={value}>{children}</DemoI18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(DemoI18nContext);
  if (!ctx) {
    return { t: makeT("en"), i18n: { language: "en" as DemoLocale } };
  }
  return { t: ctx.t, i18n: { language: ctx.locale } };
}

export function useDemoLocale(): DemoLocale {
  const ctx = useContext(DemoI18nContext);
  return ctx?.locale ?? "en";
}
