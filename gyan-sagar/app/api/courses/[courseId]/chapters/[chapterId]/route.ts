import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import Mux from "@mux/mux-node";
// 'test' import was unused

// create a client with the correct option object; the constructor expects
// a single options object (or will read env vars automatically).
const muxClient = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

// the instance exposes a lower‑case `video` property; it is **not** named
// `Video` on the instance.  (Video is the static class on the exported Mux
// class when required directly.)
const videoService = muxClient.video;


export async function DELETE(
    req:Request,
    {params} : {params: Promise<{courseId:string ; chapterId:string}>}
){
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

        if(!chapter){
            return new NextResponse("Not found", {status:404});
        }

        if(chapter.videoUrl){
            const existingmuxData = await db.muxData.findFirst({
                where:{
                    chapterId:chapterId
                }
            });
            if(existingmuxData) {
                await videoService.assets.delete(existingmuxData.assetId);
                await db.muxData.delete({
                    where:{
                        id:existingmuxData.id
                    }
                });
            } 
        }

        const deletedChapter = await db.chapter.delete({
            where:{
                id:chapterId,
                courseId:courseId
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where:{
                courseId:courseId,
                isPublished:true
            }
        });

        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where:{
                    id:courseId
                },
                data:{
                    isPublished:false
                }
            });
        }

        return NextResponse.json(deletedChapter);
    } catch(error){
        console.log("[COURSE_CHAPTER_DELETE]",error);
        return new NextResponse("Internal Error", {status:500});
    }
}


export async function PATCH(
    req:Request,
    {params} : {params: Promise<{courseId:string ; chapterId:string}>}
){
    const { courseId, chapterId } = await params;

    try{
        const {userId} = await auth();
        const { isPublished, ...values } = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", {status:401});
        };

        const ownCourse = await db.course.findUnique({
            where:{
                id: courseId,
                userId
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", {status:401});
        };

        const chapter = await db.chapter.update({
            where:{
                id: chapterId,
                courseId: courseId
            },
            data:{
                ...values
            }
        });

        // Handle video Upload 

        if (values.videoUrl) {
            // values.videoUrl should be a publicly accessible URL that Mux can fetch.
            console.log("[COURSE_CHAPTER_PATCH] videoUrl provided", values.videoUrl);

            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapterId,
                },
            });

            if (existingMuxData) {
                // console.log("[COURSE_CHAPTER_PATCH] deleting old asset", existingMuxData.assetId);
                await videoService.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            try {
                const asset = await videoService.assets.create({
                    inputs: [{ url: values.videoUrl }],
                    playback_policies: ["public"],
                    test: false,
                });

                console.log("[COURSE_CHAPTER_PATCH] mux response", asset);

                await db.muxData.create({
                    data: {
                        chapterId: chapterId,
                        assetId: asset.id,
                        playbackId: asset.playback_ids?.[0]?.id,
                    },
                });
            } catch (muxErr) {
                console.error("[COURSE_CHAPTER_PATCH] mux error", muxErr);
                // rethrow so outer catch logs and returns 500
                throw muxErr;
            }
        }



        return NextResponse.json(chapter);
    } catch(error){
        console.log("[COURSER_CHAPTER_ID]",error);
        return new NextResponse("Internal Error", {status:500});
    }
} 