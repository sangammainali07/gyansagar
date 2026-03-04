

"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

// Top-level dynamic import for react-quill-new
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export const Editor = ({ value, onChange }: EditorProps) => {
  return (
    <div className="bg-white">
      <ReactQuill theme="snow" value={value} onChange={onChange} />
    </div>
  );
};