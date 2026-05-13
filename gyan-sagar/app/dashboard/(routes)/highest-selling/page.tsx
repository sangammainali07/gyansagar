import { auth } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { getHighestSellingCourses } from "@/actions/get-highest-selling";
import { HighestSellingCard } from "@/components/highest-selling-card";

const HighestSellingPage = async () => {
    const { userId } = await auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await getHighestSellingCourses();

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-bold text-slate-700">
                    Highest Selling Courses
                </h1>
                <p className="text-sm text-muted-foreground">
                    Our top-performing courses ranked by total revenue generated.
                </p>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                {courses.map((course) => (
                    <HighestSellingCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        imageUrl={course.imageUrl!}
                        chaptersLength={course.chapters.length}
                        price={course.price!}
                        revenue={course.revenue}
                        salesCount={course.salesCount}
                        category={course.category?.name || null}
                        teacherName={course.teacherName || "Unknown Instructor"}
                    />
                ))}
            </div>

            {courses.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                    <p className="text-muted-foreground text-lg">
                        No courses have been sold yet.
                    </p>
                </div>
            )}
        </div>
    );
}
 
export default HighestSellingPage;
