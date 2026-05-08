"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionState } from "@/lib/auth/middleware";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useActionState, useState } from "react";
import { forgotPassword } from "../actions";

export default function ForgotPasswordPage() {
  const t = useTranslations("auth");
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    forgotPassword,
    {
      error: "",
      success: "",
    }
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (formData: FormData) => {
    if (hasSubmitted || isPending || showSuccess) {
      return;
    }

    setHasSubmitted(true);
    formAction(formData);
  };

  React.useEffect(() => {
    if (state.error && !isPending) {
      setHasSubmitted(false);
    }
  }, [state.error, isPending]);

  React.useEffect(() => {
    if (state.success) {
      setShowSuccess(true);
    }
  }, [state.success]);

  React.useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setHasSubmitted(false);
        setShowSuccess(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <div className="space-y-3 pb-20">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          {t("resetTitle")}
        </h2>
        <p className="text-xl text-gray-400">
          {t("resetSubtitle")}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-3">
        <div className="space-y-1">
          <div>
            <Label htmlFor="email" className="text-sm text-gray-700">
              {t("email")}
            </Label>
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            required
            autoComplete="email"
            maxLength={50}
            disabled={isPending || hasSubmitted || showSuccess}
          />
          <p className="text-xs text-gray-600">
            {t("resetEmailHelp")}
          </p>
        </div>

        {state.error && (
          <div className="text-sm text-gray-600">
            <p>{state.error}</p>
          </div>
        )}

        {showSuccess && (
          <div className="text-sm text-gray-600">
            <p>{state.success}</p>
            {state.resetLink && (
              <div className="mt-2">
                <Link
                  href={state.resetLink as string}
                  className={`text-blue-500 underline ${
                    isPending || hasSubmitted || showSuccess
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  {t("resetLinkDevOnly")}
                </Link>
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          className="w-full justify-center rounded-lg bg-gray-900 py-3 text-md text-white hover:bg-gray-600"
          disabled={
            isPending || (hasSubmitted && !state.error) || showSuccess
          }
        >
          {showSuccess ? (
            t("resetLinkSent")
          ) : isPending || (hasSubmitted && !state.error) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("loading")}
            </>
          ) : (
            t("sendResetLink")
          )}
        </Button>
      </form>

      <div className="text-sm text-gray-600">
        {t("rememberPassword")}{" "}
        <Link
          href="/sign-in"
          className={`font-semibold text-gray-900 hover:underline ${
            isPending || hasSubmitted || showSuccess
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          {t("signIn")}
        </Link>
      </div>
    </div>
  );
}
