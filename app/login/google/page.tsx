import { redirect } from "next/navigation";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function LoginGooglePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const callback = firstParam(params.callback) ?? firstParam(params.redirect);

  const target = new URLSearchParams();
  if (callback && callback.startsWith("monchoops://")) {
    target.set("source", "app");
    target.set("redirect", callback);
  }

  const qs = target.toString();
  redirect(qs ? `/sign-in?${qs}` : "/sign-in");
}
