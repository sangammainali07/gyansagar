import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{  courseId: string  }> }
) {
  const { courseId } = await params;

    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!ownCourse) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const hasPublishedChapter = ownCourse.chapters.some((chapter) => chapter.isPublished);

        if (
            !ownCourse.title ||
            !ownCourse.description ||
            !ownCourse.imageUrl ||
            !ownCourse.categoryId ||
            !ownCourse.price ||  
            !hasPublishedChapter
        ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishedCourse);
    } catch (error) {
        console.log("[COURSE_Id_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
