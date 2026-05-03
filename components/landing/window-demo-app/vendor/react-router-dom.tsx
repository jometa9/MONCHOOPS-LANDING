"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

type RouteValue = {
  path: string;
  end: boolean;
  element: ReactElement | null;
  children: RouteValue[];
};

interface RouterContextValue {
  pathname: string;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

interface RouteMatch {
  matched: boolean;
  params: Record<string, string>;
  rest: string;
}

interface OutletContextValue {
  child: ReactElement | null;
  params: Record<string, string>;
}

const OutletContext = createContext<OutletContextValue>({ child: null, params: {} });
const ParamsContext = createContext<Record<string, string>>({});

function joinPath(parent: string, child: string): string {
  if (!child) return parent || "/";
  if (child.startsWith("/")) return child;
  if (!parent || parent === "/") return "/" + child;
  return parent.replace(/\/$/, "") + "/" + child;
}

function matchPath(pattern: string, end: boolean, pathname: string): RouteMatch {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);
  const params: Record<string, string> = {};

  if (end && patternParts.length !== pathParts.length) {
    return { matched: false, params: {}, rest: "" };
  }
  if (!end && patternParts.length > pathParts.length) {
    return { matched: false, params: {}, rest: "" };
  }

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const v = pathParts[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(v ?? "");
    } else if (p !== v) {
      return { matched: false, params: {}, rest: "" };
    }
  }
  const rest = "/" + pathParts.slice(patternParts.length).join("/");
  return { matched: true, params, rest: rest === "/" ? "/" : rest };
}

export function MemoryRouter({
  initialEntries = ["/"],
  children,
}: {
  initialEntries?: string[];
  children: ReactNode;
}) {
  const [pathname, setPathname] = useState(initialEntries[0] || "/");
  const navigate = useCallback((to: string) => {
    setPathname(to.startsWith("/") ? to : "/" + to);
  }, []);
  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function BrowserRouter({ children }: { children: ReactNode }) {
  return <MemoryRouter>{children}</MemoryRouter>;
}

function collectRoutes(children: ReactNode, parentPath = ""): RouteValue[] {
  const out: RouteValue[] = [];
  const arr = Array.isArray(children) ? children : [children];
  for (const node of arr) {
    if (!node || typeof node !== "object") continue;
    const el = node as ReactElement<{
      index?: boolean;
      path?: string;
      element?: ReactElement | null;
      children?: ReactNode;
    }>;
    if (el.type !== Route) continue;
    const props = el.props;
    const path = props.index ? "" : props.path ?? "";
    const fullPath = joinPath(parentPath, path);
    const childRoutes = props.children ? collectRoutes(props.children, fullPath) : [];
    out.push({
      path: fullPath || "/",
      end: !props.children || childRoutes.length === 0,
      element: props.element ?? null,
      children: childRoutes,
    });
  }
  return out;
}

function findMatch(
  routes: RouteValue[],
  pathname: string
): { route: RouteValue; params: Record<string, string>; child: ReactElement | null } | null {
  for (const r of routes) {
    if (r.children.length > 0) {
      const m = matchPath(r.path, false, pathname);
      if (m.matched) {
        const childMatch = findMatch(r.children, pathname);
        const child = childMatch?.route.element ?? null;
        const childParams = childMatch?.params ?? {};
        return { route: r, params: { ...m.params, ...childParams }, child };
      }
    } else {
      const m = matchPath(r.path, true, pathname);
      if (m.matched) {
        return { route: r, params: m.params, child: null };
      }
    }
  }
  // wildcard
  for (const r of routes) {
    if (r.path.endsWith("/*") || r.path === "*") {
      return { route: r, params: {}, child: null };
    }
  }
  return null;
}

export function Routes({ children }: { children: ReactNode }) {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("Routes must be inside a Router");
  const routes = useMemo(() => collectRoutes(children), [children]);
  const match = findMatch(routes, ctx.pathname);
  if (!match) return null;
  return (
    <ParamsContext.Provider value={match.params}>
      <OutletContext.Provider value={{ child: match.child, params: match.params }}>
        {match.route.element}
      </OutletContext.Provider>
    </ParamsContext.Provider>
  );
}

export function Route(_props: {
  index?: boolean;
  path?: string;
  element?: ReactElement | null;
  children?: ReactNode;
}): ReactElement | null {
  return null;
}

export function Outlet() {
  const { child, params } = useContext(OutletContext);
  if (!child) return null;
  return <ParamsContext.Provider value={params}>{child}</ParamsContext.Provider>;
}

export function Navigate({ to, replace: _replace }: { to: string; replace?: boolean }) {
  const ctx = useContext(RouterContext);
  if (!ctx) return null;
  if (ctx.pathname !== to) {
    queueMicrotask(() => ctx.navigate(to));
  }
  return null;
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useNavigate must be inside a Router");
  return ctx.navigate;
}

export function useParams<T extends Record<string, string | undefined>>(): T {
  return useContext(ParamsContext) as T;
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useLocation must be inside a Router");
  return { pathname: ctx.pathname };
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const ctx = useContext(RouterContext);
  return (
    <a
      {...rest}
      href={to}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx?.navigate(to, { replace });
      }}
    >
      {children}
    </a>
  );
}

interface NavLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  to: string;
  end?: boolean;
  className?: string | ((p: { isActive: boolean; isPending: boolean }) => string);
  children?: ReactNode | ((p: { isActive: boolean; isPending: boolean }) => ReactNode);
}

export function NavLink({ to, end, className, children, onClick, ...rest }: NavLinkProps) {
  const ctx = useContext(RouterContext);
  const pathname = ctx?.pathname ?? "/";
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(to + "/");
  const cls = typeof className === "function" ? className({ isActive, isPending: false }) : className;
  const kids = typeof children === "function" ? children({ isActive, isPending: false }) : children;
  return (
    <a
      {...rest}
      href={to}
      className={cls}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
        if (e.defaultPrevented) return;
        ctx?.navigate(to);
      }}
    >
      {kids}
    </a>
  );
}
