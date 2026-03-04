import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";



export async function PUT (
    request: Request,
    { params }: { params: { courseId: string, chapterId: string } }
){

    try {

        const { userId} = await auth();
        const { isCompleted } = await request.json();

        if (!userId) {
            return new NextResponse('[UNAUTHORIZED]', { status: 401 });
        }

        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId,
                }
            },
            update: {
                isCompleted
            },
            create:{
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        });

        return NextResponse.json(userProgress);

    } catch (error) {
        console.error('[Chapter_id_progress_error]', error);
        return new NextResponse('[INTERNAL_ERROR]', { status: 500 });
    }


}