"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export const Social = () => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 items-center w-full gap-2 mt-4">
      <Button
        size="lg"
        className="w-full border-gray-300 hover:bg-gray-50"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Google</span>
      </Button>
      <Button
        size="lg"
        className="w-full border-gray-300 hover:bg-gray-50"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">GitHub</span>
      </Button>
    </div>
  );
};
