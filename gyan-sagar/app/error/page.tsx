"use client";

import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md mx-auto shadow-xl border-t-4 border-t-red-600">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center gap-x-2">
            <AlertTriangle className="h-6 w-6" />
            Authentication Error
          </CardTitle>
          <CardDescription>
            Something went wrong during the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[100px] gap-y-4">
           <p className="text-sm text-gray-500 text-center">
             {error === "Configuration" && "There is a problem with the server configuration. Check your environment variables."}
             {error === "AccessDenied" && "Access was denied. You might not have permission to log in."}
             {error === "Verification" && "The verification token has expired or has already been used."}
             {!error && "An unknown error occurred."}
           </p>
           {error && (
             <div className="bg-red-50 text-red-800 text-xs font-mono p-2 rounded border border-red-200">
               Error Code: {error}
             </div>
           )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/sign-in">
              Back to login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
