import { Suspense } from "react";
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CoursesList } from "@/components/courses-list";

export const dynamic = "force-dynamic";

interface SearchPageProps {
    searchParams: Promise<{
        title: string;
        categoryId: string;
    }>
}

const SearchPage = async (props: SearchPageProps) => {
    const searchParams = await props.searchParams;

    const { userId } = await auth();

    if(!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const Courses = await getCourses({
        userId,
        ...searchParams
    })

    return (
        <>
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
            <Suspense fallback={<div>Loading...</div>}>
                <SearchInput />
            </Suspense>
        </div>
        <div className="p-6 space-y-4">
            <Suspense fallback={<div>Loading categories...</div>}>
                <Categories 
                items={categories}
                />
            </Suspense>
            <CoursesList items={Courses} />
        </div>
        </> 
     );
}
 
export default SearchPage;