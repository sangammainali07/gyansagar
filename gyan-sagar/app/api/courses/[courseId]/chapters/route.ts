import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

export async function POST(
    req:Request,
    { params }: { params: Promise<{  courseId:string }> }
) {
  const { courseId } = await params;

    try{
        const {userId} = await auth();
         const {title} = await req.json();

         if(!userId) {
            return new NextResponse("Unauthorized", {status:401});
         }

         const CourseOwner = await db.course.findUnique({
            where:{
                id:courseId,
                userId:userId,
            }
         })

         if(!CourseOwner) {
            return new NextResponse("Unauthorized",{status:401});
         }

         const lastChapter =await db.chapter.findFirst({
            where:{
                courseId:courseId,
            },
            orderBy:{
                position:"desc",
            },
         });

         const newPosition = lastChapter ? lastChapter.position + 1 : 1;

         const chapter = await db.chapter.create({
            data:{
                title,
                courseId:courseId,
                position:newPosition,
            },
         });

         return NextResponse.json(chapter);

    } catch (error) {
        console.log("[Chapters]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}