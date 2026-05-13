import { isTeacher } from "@/lib/teacher";
import { auth } from "@/lib/auth-helper";
import { redirect } from "next/navigation";



const TeacherLayout = async ({
    children,
} : { children: React.ReactNode }) => {

    const { userId, role } = await auth();

    if (!userId) {
        return redirect("/");
    }

    if (!isTeacher(role)) {
        return redirect("/dashboard");
    }


    return <>{children}</>
}
 
export default TeacherLayout;