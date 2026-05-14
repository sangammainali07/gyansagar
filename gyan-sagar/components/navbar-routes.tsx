"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";
import { UserButton } from "./auth/user-button";

interface NavbarRoutesProps {
  user?: {
    id?: string;
    role?: any;
    image?: string | null;
    name?: string | null;
    hasPassword?: boolean;
  } | null;
}

export const NavbarRoutes = ({ user }: NavbarRoutesProps) => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
  const isCoursePage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/dashboard/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}

      <div className="flex gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage ? (
          <Link href="/dashboard/search">
            <Button size="sm" variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isTeacher(user?.role) ? (
          <Link href="/dashboard/teacher/courses">
            <Button size="sm" variant="ghost">
              Teacher mode
            </Button>
          </Link>
        ) : null}

        {user && (
          <UserButton 
            userImage={user.image} 
            userName={user.name} 
            hasPassword={user.hasPassword}
          />
        )}
      </div>
    </>
  );
};