"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState } from "@/lib/auth/middleware";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { resetPasswordAction } from "../actions";

function ResetPasswordForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { data: session, status } = useSession();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    {
      error: "",
      autoLogin: false,
    }
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDashboardRedirect = () => {
    setIsRedirecting(true);
    router.push("/dashboard");
  };

  useEffect(() => {
    if (state.success) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        const redirectTo =
          state.autoLogin || session ? "/dashboard" : "/sign-in";
        router.push(redirectTo);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, state.autoLogin, session, router]);

  useEffect(() => {
    if (state.error && !isPending) {
      setHasSubmitted(false);
    }
  }, [state.error, isPending]);


  if (session && !state.success) {
    return (
      <div className="space-y-3 pb-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("alreadySignedInTitle")}
          </h2>
          <p className="text-xl text-gray-400">
            {t("alreadySignedInSubtitle")}
          </p>
        </div>

        {token ? (
          <div className="space-y-3">
            <p
              className="text-sm text-gray-600 text-center"
              dangerouslySetInnerHTML={{
                __html: t.raw("signedInAs").replace("{email}", session.user?.email || ""),
              }}
            />

            <form
              action={async (formData) => {
                setHasSubmitted(true);
                await formAction(formData);
              }}
              className="space-y-3"
            >
              <input type="hidden" name="token" value={token} />
              <div className="space-y-1">
                <div>
                  <Label htmlFor="password" className="text-sm text-gray-700">
                    {t("newPassword")}
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  required
                  minLength={8}
                  maxLength={100}
                  disabled={
                    isPending ||
                    (hasSubmitted && !state.error) ||
                    !!state.success
                  }
                />
                <p className="text-xs text-gray-600">
                  {t("passwordHelp")}
                </p>
              </div>

              <div className="space-y-1">
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm text-gray-700"
                  >
                    {t("confirmPassword")}
                  </Label>
                </div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  required
                  minLength={8}
                  maxLength={100}
                  disabled={
                    isPending ||
                    (hasSubmitted && !state.error) ||
                    !!state.success
                  }
                />
              </div>

              {state.error && (
                <div className="text-sm text-gray-600">
                  <p>{state.error}</p>
                </div>
              )}

              {state.success && (
                <div className="text-sm text-gray-600">
                  <p>{state.success}</p>
                  <p className="text-sm opacity-75 mt-1">
                    {t("passwordUpdatedNote")}
                  </p>
                  <p className="text-sm opacity-75">
                    {t("redirectingDashboard")}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600"
                disabled={
                  isPending || (hasSubmitted && !state.error) || !!state.success
                }
              >
                {state.success ? (
                  t("passwordUpdatedSuccessfully")
                ) : isPending || (hasSubmitted && !state.error) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("updatingPassword")}
                  </>
                ) : (
                  t("updatePassword")
                )}
              </Button>
            </form>

            <div className="text-sm text-gray-600">
              <Link
                href="/dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  handleDashboardRedirect();
                }}
                className={`font-semibold text-gray-900 hover:underline ${
                  isRedirecting ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    {t("redirectingToDashboard")}
                  </>
                ) : (
                  t("goToDashboard")
                )}
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-blue-800 text-sm">
              <p>{t("noValidToken")}</p>
            </div>

            <div className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full block"
                onClick={(e) => {
                  e.preventDefault();
                  handleDashboardRedirect();
                }}
              >
                <Button
                  className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("redirectingToDashboard")}
                    </>
                  ) : (
                    t("goToDashboard")
                  )}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="space-y-3 pb-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("invalidResetTitle")}
          </h2>
          <p className="text-xl text-gray-400">
            {t("invalidResetSubtitle")}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {t("invalidResetBody")}
          </p>
          <Link href="/forgot-password" className="w-full block">
            <Button className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600">
              {t("requestNewResetLink")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!isMounted || status === "loading") {
    return (
      <div className="flex flex-col items-center gap-3 text-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        <p className="text-sm text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20" id="reset-form">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {session ? t("updateYourPassword") : t("resetPasswordTitle")}
        </h2>
        <p className="text-xl text-gray-400">
          {session
            ? t("updateYourPasswordSub")
            : t("resetPasswordSubtitle")}
        </p>

        {session && (
          <div
            className="mt-2 text-sm text-gray-600"
            dangerouslySetInnerHTML={{
              __html: t.raw("signedInAs").replace("{email}", session.user?.email || ""),
            }}
          />
        )}
      </div>

      <form
        action={async (formData) => {
          setHasSubmitted(true);
          await formAction(formData);
        }}
        className="space-y-3"
      >
        <input type="hidden" name="token" value={token} />
        <div className="space-y-1">
          <div>
            <Label htmlFor="password" className="text-sm text-gray-700">
              {t("newPassword")}
            </Label>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            required
            minLength={8}
            maxLength={100}
            disabled={
              isPending || (hasSubmitted && !state.error) || !!state.success
            }
          />
          <p className="text-xs text-gray-600">
            {t("passwordHelp")}
          </p>
        </div>

        <div className="space-y-1">
          <div>
            <Label htmlFor="confirmPassword" className="text-sm text-gray-700">
              {t("confirmPassword")}
            </Label>
          </div>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder={t("passwordPlaceholder")}
            required
            minLength={8}
            maxLength={100}
            disabled={
              isPending || (hasSubmitted && !state.error) || !!state.success
            }
          />
        </div>

        {state.error && (
          <div className="text-sm text-gray-600">
            <p>{state.error}</p>
          </div>
        )}

        {state.success && (
          <div className="text-sm text-gray-600">
            <p>{state.success}</p>
            {session && (
              <p className="text-sm opacity-75 mt-1">
                {t("passwordUpdatedNote")}
              </p>
            )}
            <p className="text-sm opacity-75">
              {state.autoLogin || session
                ? t("redirectingDashboard")
                : t("redirectingSignin")}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600"
          disabled={
            isPending || (hasSubmitted && !state.error) || !!state.success
          }
        >
          {state.success ? (
            t("passwordUpdatedSuccessfully")
          ) : isPending || (hasSubmitted && !state.error) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {session ? t("updatingPassword") : t("resettingPassword")}
            </>
          ) : session ? (
            t("updatePassword")
          ) : (
            t("resetPasswordBtn")
          )}
        </Button>
      </form>

      <div className="text-sm text-gray-600">
        {state.success ? (
          <Link
            href={state.autoLogin || session ? "/dashboard" : "/sign-in"}
            className="font-semibold text-gray-900 hover:underline"
          >
            {state.autoLogin || session ? t("goToDashboard") : t("goToSignIn")}
          </Link>
        ) : (
          <Link
            href={session ? "/dashboard" : "/sign-in"}
            className={`font-semibold text-gray-900 hover:underline ${
              isPending || (hasSubmitted && !state.error)
                ? "pointer-events-none opacity-50"
                : ""
            }`}
          >
            {session ? t("backToDashboard") : t("backToSignIn")}
          </Link>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  const t = useTranslations("auth");
  return (
    <div className="flex flex-col items-center gap-3 text-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
      <p className="text-sm text-gray-600">{t("loading")}</p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
