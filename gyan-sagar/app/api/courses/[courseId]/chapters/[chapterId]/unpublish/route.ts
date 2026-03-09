import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    { params }: { params: Promise<{ courseId:string ; chapterId:string }> }) {
  const { courseId, chapterId } = await params;

    try{
        const {userId} = await auth(); 

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        };

        const ownCourse = await db.course.findUnique({
            where:{
                id:courseId,
                userId
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", {status:401});
        };

       
        // Ensure the chapter exists and belongs to this course
        const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                courseId: courseId,
            },
        });

        if (!chapter) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId,
            },
            data: {
                isPublished: false,
            },
        });

        // If no other chapters are published, unpublish the course
        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            },
            take: 1,
        });

        if (!publishedChaptersInCourse.length) {
            await db.course.update({
                where: { id: courseId },
                data: { isPublished: false },
            });
        }

        return NextResponse.json(unPublishedChapter);
    } catch(error){
        console.log("[chapter unpublish]",error);
        return new NextResponse("Internal Error", {status:500});
    }     
    }