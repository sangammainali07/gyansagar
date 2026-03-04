"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";




import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { title } from "process";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";
import Image from "next/image";
// import { FileUpload } from "@/components/file-upload";
import { url } from "inspector";
import { FileUpload } from "@/components/file-upload";
import { UploadButton } from "@/lib/uploadthing";



interface ImageFormProps {
    initialData: Course;
    courseId: string;

}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is required"
    }),

})

export const ImageForm = ({ initialData,
    courseId }: ImageFormProps) => {

    const [isEditing, setIsEditing] = useState(false);

    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course Updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing && !initialData.imageUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add an Image
                        </>
                    )}

                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Image
                        </>
                    )
                    }

                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <Image
                            alt="upload"
                            fill
                            className="object-cover rounded-md"
                            src={initialData?.imageUrl}
                        />
                    </div>
                )
            )}



            {isEditing && (
                <div>
                  <UploadButton
  endpoint="imageUploader"
  onClientUploadComplete={async (res) => {
    try {
      const imageUrl = res[0].ufsUrl; 

      await axios.patch(`/api/courses/${courseId}`, {
        imageUrl: imageUrl,
      });

      toast.success("Course Updated");
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
                        16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
    )
}