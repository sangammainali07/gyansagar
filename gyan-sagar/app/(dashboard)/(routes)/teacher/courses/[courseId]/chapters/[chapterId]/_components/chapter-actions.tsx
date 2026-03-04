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


interface ChapterActionsProps {
    disabled: boolean;
    courseId: string;
    chapterId: string;
    isPublished: boolean;
}

export const ChapterActions = ({disabled, courseId, chapterId, isPublished}: ChapterActionsProps)=>{

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try{
            setIsLoading(true);
            if(isPublished){
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);
                toast.success("Chapter Unpublished");
            } else {
                await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);
                toast.success("Chapter Published");
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

                await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

                toast.success("Chapter deleted successfully.");
                router.refresh();
                router.push(`/teacher/courses/${courseId}`);
            } catch (error) {
                toast.error("Something went wrong.");
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