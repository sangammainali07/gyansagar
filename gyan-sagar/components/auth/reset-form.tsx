"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/actions/auth";
import Link from "next/link";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-xl border-t-4 border-t-[#1D2A5D]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#1D2A5D]">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="john.doe@example.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
            {success && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{success}</div>}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full bg-[#1D2A5D] hover:bg-[#1D2A5D]/90 text-white font-semibold"
            >
              Send reset email
            </Button>
          </form>
        </Form>
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
