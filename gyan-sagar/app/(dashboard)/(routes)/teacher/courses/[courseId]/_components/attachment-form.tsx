"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";




import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { title } from "process";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Textarea } from "@/components/ui/textarea";
import { Attachment, Course } from "@prisma/client";
import Image from "next/image";
// import { FileUpload } from "@/components/file-upload";
import { url } from "inspector";
import { FileUpload } from "@/components/file-upload";
import { UploadButton } from "@/lib/uploadthing";



interface AttachmentFormProps {
    initialData: Course & { attachments : Attachment[]};
    courseId: string;

}

const formSchema = z.object({
    url:z.string().min(1),
})

export const AttachmentForm = ({ initialData,
    courseId }: AttachmentFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [deletingId,setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current);
    const router = useRouter();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Updated");
            toggleEdit();
            router.refresh();
        } catch (error) {
            toast.error("Something Went Wrong");
        }
    }
    const onDelete = async(id:string)=>{
        try{
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment Deleted");
            router.refresh();
        } catch(error) {
            toast.error("Something went wrong");
        } finally{
            setDeletingId(null);
        }
    }
    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course Attachment
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing && (
                        <>Cancel</>
                    )}

                    {!isEditing &&  (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a file
                        </>
                    )}

                   

                </Button>
            </div>
            {!isEditing && (
                <>
                    {initialData.attachments.length === 0 && (
                        <p className="text-sm mt-2 text-slate-500 italic">
                            No attachments yet
                        </p>
                    )}
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">
                                {initialData.attachments.map((attachment)=>(
                                    <div key={attachment.id} 
                                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                    >
                                        <File className="h-4 w-4 mr-2 flex-shrink-0 "/>
                                        <p className="text-xs line-clamp-1"> {attachment.name}</p>
                                        {deletingId === attachment.id && (
                                            <div>
                                                <Loader2 className="h-4 w-4 animate-spin"/>
                                            </div>
                                        )}
                                        {deletingId !== attachment.id && (
                                            <button className="ml-auto hover:opacity-75 transition" 
                                            onClick={()=>onDelete(attachment.id)}
                                            >
                                                <X className="h-4 w-4 "/>
                                            </button >
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </>
            )}



            {isEditing && (
                <div>
                      {isEditing && (
                    <div>
                        <UploadButton
                        endpoint="courseAttachment"
                        onClientUploadComplete={async (res) => {
                            if (!res?.length) return;

                            const fileUrl = res[0].ufsUrl;
                            const fileName = res[0].name;

                            await axios.post(`/api/courses/${courseId}/attachments`, {
                            name: fileName,
                            url: fileUrl,
                            });

                            toast.success("Attachment uploaded");
                            router.refresh();
                            toggleEdit();
                        }}
                        onUploadError={(error: Error) => {
                            toast.error(error.message);
                        }}
                        />

                        <div className="text-xs text-muted-foreground mt-4">
                        Add anything your student might need to complete the course.
                        </div>
                    </div>
)}
                </div>
            )}
        </div>
    )
}