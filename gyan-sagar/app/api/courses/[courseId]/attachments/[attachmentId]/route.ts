// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server"
// import { db } from "@/lib/db";

// export async function DELETE(
//     req:Request,
//     { params }: { params: Promise<{ courseId:string, attachmentId:string }> }
// ) {

//     try{
//         const {userId} = await auth();

//         if(!userId) {
//             return new NextResponse("Unauthorized", {status:401});
//         }

//         const courseOwner = await db.course.findUnique({
//             where:{
//                 id:courseId,
//                 userId:userId,
//             }
//         });

//         if(!courseOwner) {
//             return new NextResponse("Unauthorized", {status:401})
//         }

//         const attachment = await db.attachment.delete({
//             where:{
//                 courseId:courseId,
//                 id:attachmentId,
//             }
//         })

//     } catch(error){
//         console.log("ATTACHMENT_ID",error)
//         return new NextResponse("Internal Error", {status:500});
//     }
// }




import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{  courseId: string; attachmentId: string  }> }
) {
  const { courseId, attachmentId } = await params;

  try {
    const { userId } = await auth();

    // 1️⃣ Check if user is logged in
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2️⃣ Check if the course belongs to the user
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3️⃣ Delete the attachment (by unique id ONLY)
    await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    // 4️⃣ Return success response
    return new NextResponse("Attachment Deleted", { status: 200 });

  } catch (error) {
    console.log("[ATTACHMENT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}