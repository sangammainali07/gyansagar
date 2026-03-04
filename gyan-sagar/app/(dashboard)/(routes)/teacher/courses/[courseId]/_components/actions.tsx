"use client";

import { Chapter } from "@prisma/client";
import { IconBadge } from "@/components/icon-badge";
// import { LayoutDashboard, Eye, Video } from "@phosphor-icons/react";        
import { Button } from "@/components/ui/button";
// import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { ConfirmModel } from "@/components/modals/confirm-model";
import { useState } from "react";
import toast from "react-hot-toast";
import { set } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useConfettiStore } from "@/hooks/use-confetti-store";


interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean;
}

export const Actions = ({disabled, courseId, isPublished}: ActionsProps)=>{

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const confetti = useConfettiStore();

    const onClick = async () => {
        try{
            setIsLoading(true);
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/unpublish`);
                toast.success("Course Unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`);
                toast.success("Course Published");
                confetti.onOpen();
            }
            router.refresh();
        } catch(error: any){
            console.log(error);
            toast.error(error.response?.data || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    }


    const onDelete =async () => {
            // Implement delete functionality here  
            try {
                setIsLoading(true);
                // await deleteChapter(chapterId);

                await axios.delete(`/api/courses/${courseId}`);

                toast.success("Course deleted successfully.");
                router.refresh();
                router.push(`/teacher/courses`);
            } catch (error: any) {
                console.log(error);
                toast.error(error.response?.data || "Something went wrong.");
            }
            finally {
                setIsLoading(false);
            }

    }
    return (
        <div className="flex items-center gap-x-2">
            <Button
            onClick={onClick} 
            disabled={disabled || isLoading}   
             variant="outline"
             size="sm"
             >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>

            <ConfirmModel onConfirm={onDelete}>
            <Button size="sm" disabled={isLoading}>
                <Trash className="h-4 w-4" />
            </Button>
            </ConfirmModel>
        </div>
    )
}