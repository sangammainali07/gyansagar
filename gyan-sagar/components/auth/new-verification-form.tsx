"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/actions/auth";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-xl border-t-4 border-t-[#1D2A5D]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#1D2A5D]">Confirming your email</CardTitle>
        <CardDescription>
          Please wait while we verify your email address.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center min-h-[100px]">
        {!success && !error && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D2A5D]"></div>
        )}
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm font-medium">{success}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm font-medium">{error}</div>}
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          <Link href="/sign-in" className="text-[#1D2A5D] font-medium hover:underline">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
