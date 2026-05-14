"use client";

import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { DeleteAccountModal } from "@/components/modals/delete-account-modal";
import { Trash2 } from "lucide-react";

interface UserButtonProps {
  userImage?: string | null;
  userName?: string | null;
  hasPassword?: boolean;
}

export const UserButton = ({ userImage, userName, hasPassword }: UserButtonProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 transition hover:opacity-75">
          <AvatarImage src={userImage || ""} alt={userName || "User avatar"} />
          <AvatarFallback className="bg-slate-200">
            <User className="h-4 w-4 text-slate-500" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <Link href="/dashboard/settings">
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          onClick={() => setIsDeleteModalOpen(true)}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Me
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
      
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        hasPassword={hasPassword}
      />
    </DropdownMenu>
  );
};
