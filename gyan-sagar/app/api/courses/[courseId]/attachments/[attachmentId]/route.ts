import { auth } from "@/lib/auth-helper";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{  courseId: string; attachmentId: string  }> }
) {
  const { courseId, attachmentId } = await params;

  try {
    const { userId, role } = await auth();

    // 1️⃣ Check if user is logged in and is a teacher
    if (!userId || !isTeacher(role)) {
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