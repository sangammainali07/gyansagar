"use client"

import { Value } from "@prisma/client/runtime/library"
import dynamic from "next/dynamic"
import { useMemo } from "react";

import "react-quill-new/dist/quill.bubble.css"


interface PrevieProps {
    value:string;
};

export const Preview = ( {
    value,
} : PrevieProps )=>{

    const ReactQuill = useMemo(() => dynamic(() => import("react-quill-new"), {ssr: false }), []);


    return (
        
            <ReactQuill theme="bubble" value={value} readOnly/>
      
    )

}