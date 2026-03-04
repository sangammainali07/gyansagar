"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";




import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { title } from "process";
import { ImageIcon, Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course, MuxData } from "@prisma/client";
import Image from "next/image";
// import { FileUpload } from "@/components/file-upload";
import { url } from "inspector";
import { FileUpload } from "@/components/file-upload";
import { UploadButton } from "@/lib/uploadthing";
import MuxPlayer from "@mux/mux-player-react";



interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null };
    courseId: string;
    chapterId:string;
}

const formSchema = z.object({
    videoUrl: z.string().min(1),
})

export const ChapterVideoForm = ({ initialData,
    courseId,chapterId }: ChapterVideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter Updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter's Video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing && !initialData.videoUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a Video
                        </>
                    )}

                    {!isEditing && initialData.videoUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Video
                        </>
                    )
                    }

                </Button>
            </div>
            {!isEditing && (
                !initialData.videoUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : initialData.muxData?.playbackId ? (
                    <div className="relative aspect-video mt-2">
                        <MuxPlayer 
                        playbackId={initialData.muxData.playbackId}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                )
            )}



           {isEditing && (
  <div>
    <UploadButton
      endpoint="chapterVideo"
      onClientUploadComplete={async (res) => {
        try {
          const videoUrl = res?.[0]?.ufsUrl;

          if (!videoUrl) {
            toast.error("Upload failed");
            return;
          }

          await axios.patch(
            `/api/courses/${courseId}/chapters/${chapterId}`,
            {
              videoUrl,
            }
          );

          toast.success("Chapter video updated");
          router.refresh();
          toggleEdit();
        } catch (error) {
          toast.error("Something went wrong");
        }
      }}
      onUploadError={(error: Error) => {
        toast.error(error.message);
      }}
    />

    <div className="text-xs text-muted-foreground mt-4">
      Upload this chapter's video.
    </div>
  </div>
)}
        {initialData.videoUrl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
                Videoes can take few minutes to process. Once processed, the video will be available for students to view.
            </div>
        )}
        </div>
    )
}