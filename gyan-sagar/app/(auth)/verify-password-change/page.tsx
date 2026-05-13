"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { completeChangePassword } from "@/actions/change-password";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyPasswordChangePage = () => {
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

    completeChangePassword(token)
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
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#1D2A5D]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#1D2A5D]">Verify Password Change</CardTitle>
          <CardDescription>
            Confirming your password update request.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          {!success && !error && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-[#1D2A5D]" />
              <p className="text-slate-600">Verifying your request...</p>
            </>
          )}
          {success && (
            <>
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <p className="text-green-700 font-medium text-center">{success}</p>
            </>
          )}
          {error && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <p className="text-red-700 font-medium text-center">{error}</p>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild className="text-[#1D2A5D] border-[#1D2A5D] hover:bg-[#1D2A5D]/10">
            <Link href="/sign-in">
              Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyPasswordChangePage;
