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

        const chapter = await db.chapter.findUnique({
            where:{
                id:chapterId,    
                courseId:courseId
            }
        }); 

        if(!chapter || !chapter.title || !chapter.description || !chapter.videoUrl){ 
            return new NextResponse("Missing required fields", {status:400});
        };

        const publishedChapter = await db.chapter.update({
            where:{
                id:chapterId,    
                courseId:courseId
            },
            data:{
                isPublished:true,
            }   

            });

            return NextResponse.json(publishedChapter);

    } catch(error){
        console.log("[chapter publish]",error);
        return new NextResponse("Internal Error", {status:500});
    }     
    }