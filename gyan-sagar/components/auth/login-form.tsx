"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState, useTransition, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/auth.config";
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
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "@/actions/auth";
import Link from "next/link";
import { Social } from "@/components/auth/social";
import { Eye, EyeOff } from "lucide-react";

export const LoginForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: typeof window !== "undefined" ? localStorage.getItem("rememberedEmail") || "" : "",
      password: "",
      rememberMe: typeof window !== "undefined" ? !!localStorage.getItem("rememberedEmail") : false,
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    if (values.rememberMe) {
      localStorage.setItem("rememberedEmail", values.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-xl border-t-4 border-t-[#1D2A5D]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-[#1D2A5D]">Welcome back</CardTitle>
        <CardDescription>
          Login to your Gyan Sagar account
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type={showPassword ? "text" : "password"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <Button size="sm" variant="link" asChild className="px-0 font-medium text-[#1D2A5D] hover:text-[#1D2A5D]/80 transition-colors">
                      <Link href="/forgot-password">
                        Forgot password?
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Remember me
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Stay logged in for 30 days
                      </p>
                    </div>
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
              Login
            </Button>
          </form>
        </Form>
        <div className="mt-4">
          <Social />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-[#1D2A5D] font-medium hover:underline">
            Register here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
