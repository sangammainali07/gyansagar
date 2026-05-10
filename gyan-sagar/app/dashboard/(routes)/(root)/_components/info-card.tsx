import { IconBadge } from "@/components/icon-badge"
import { LucideIcon } from "lucide-react";


interface InfoCardProps {
    numberOfItems: number;
    variant?: "default" | "success";
    label: string;
    icon:LucideIcon;
    /** optional pixel size to pass to the icon (e.g. 20, 24) */
    size?: number;
}


export const InfoCard = (
    {
        variant,
        icon:Icon,
        numberOfItems,
        label,
        size
    }: InfoCardProps
) => {

    return (
        <div className="border rounded-md flex items-center gap-x-2 p-3">
            <IconBadge 
            variant={variant}
            icon={Icon}
            iconSize={size}
            />
            <div>
                <p className="font-medium">
                    {label}
                </p>
                <p className="text-gray-500 text-sm">
                    {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
                </p>
            </div>
        </div>
    )
}