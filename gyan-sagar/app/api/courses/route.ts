import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@/lib/auth-helper";
import { NextResponse } from "next/server";

export async function POST(
    req:Request,
) {
    try{
        const { userId, role } = await auth();
        const { title } = await req.json();

        if(!userId || !isTeacher(role)) {
            return new NextResponse("Unauthorized", {status:401});
        }

        const course = await db.course.create({
            data:{
                userId,
                title,
            }
        });
            
        return NextResponse.json(course);
    }catch(error){
        console.log("[COURSES]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}
