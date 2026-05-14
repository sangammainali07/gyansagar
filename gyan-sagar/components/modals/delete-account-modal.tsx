"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { AlertTriangle, Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { deleteAccount } from "@/actions/delete-account";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasPassword?: boolean;
}

export const DeleteAccountModal = ({
  isOpen,
  onClose,
  hasPassword,
}: DeleteAccountModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaText, setCaptchaText] = useState("");
  const [expectedCaptcha, setExpectedCaptcha] = useState("");

  // Generate CAPTCHA on mount or when modal opens
  useEffect(() => {
    if (isOpen && !hasPassword) {
      const num1 = Math.floor(Math.random() * 10) + 1;
      const num2 = Math.floor(Math.random() * 10) + 1;
      setCaptchaText(`What is ${num1} + ${num2}?`);
      setExpectedCaptcha((num1 + num2).toString());
    }
  }, [isOpen, hasPassword]);

  // Dynamic schema based on authentication type
  const formSchema = hasPassword
    ? z.object({
        password: z.string().min(1, "Password is required"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        captchaAnswer: z.string().optional(),
      }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    : z.object({
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
        captchaAnswer: z.string().min(1, "Answer is required"),
      }).refine((data) => data.captchaAnswer === expectedCaptcha, {
        message: "Incorrect answer",
        path: ["captchaAnswer"],
      });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      captchaAnswer: "",
    },
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    form.reset();
  }, [isOpen, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const payload = {
        password: values.password,
        captchaAnswer: values.captchaAnswer,
        expectedCaptcha: expectedCaptcha,
      };

      const response = await deleteAccount(payload);

      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(response.success);
        // Automatically log out and redirect
        await signOut({ callbackUrl: "/" });
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600 gap-x-2">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="pt-2 text-zinc-500">
            This action is <span className="font-semibold text-zinc-800 dark:text-zinc-200">permanent and cannot be undone.</span> All your personal data, progress, and purchases will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            {hasPassword ? (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          type="password"
                          placeholder="Enter your current password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          type="password"
                          placeholder="Confirm your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-md text-sm">
                  Since you signed in with Google/GitHub, please solve this to verify you are human:
                </div>
                <FormField
                  control={form.control}
                  name="captchaAnswer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md font-semibold">{captchaText}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isLoading}
                          placeholder="Type the answer here"
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Delete My Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
