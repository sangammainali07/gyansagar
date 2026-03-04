"use client";

import qs from "query-string";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchParams,useRouter,usePathname } from "next/navigation";
import { title } from "process";
import { de } from "zod/v4/locales";
// import { Input } from "./ui/input";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(()=> {
         const url =qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debouncedValue
            }
         } , {skipNull: true, skipEmptyString: true});
         router.push(url);
    },[debouncedValue, currentCategoryId, pathname, router]);

    return (
        <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search courses..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
            />
        </div>
    );
};