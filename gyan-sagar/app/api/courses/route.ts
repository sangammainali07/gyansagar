import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

console.log("Imported DB:", db);


export async function POST(
    req:Request,
) {
    try{

        console.log("DB VALUE:", db);

        const {userId} =await auth();
        const {title}=await req.json();

        if(!userId) {
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


