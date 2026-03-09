import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const videoService = muxClient.video;

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
    try {
        const { userId } = await auth();        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include: {
                chapters: {
                    select: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Delete all Mux assets for chapters in this course
        for(const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await videoService.assets.delete(chapter.muxData.assetId); 
            }
        }

        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
            },
        });

        return NextResponse.json(deletedCourse);
    } catch (error) {
        console.log("[COURSE_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    const { courseId } = await params;
    try {
        const { userId } = await auth();
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
                ...values,
            }
        });

        return NextResponse.json(course);

    } catch (error) {
        console.log("[COURSE_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}