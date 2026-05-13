import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  );
}
