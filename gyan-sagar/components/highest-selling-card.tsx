import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "@/components/icon-badge";
import { BookOpen, TrendingUp, User } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface HighestSellingCardProps {
    id: string;
    title: string;
    imageUrl: string;
    chaptersLength: number;
    price: number;
    revenue: number;
    salesCount: number;
    category: string | null;
    teacherName: string;
}

export const HighestSellingCard = ({
    id, 
    title, 
    imageUrl, 
    chaptersLength, 
    price, 
    revenue,
    salesCount,
    category,
    teacherName
}: HighestSellingCardProps) => {
    return(
        <Link href={`/courses/${id}`}>
            <div className="group hover:shadow-md transition overflow-hidden border rounded-xl p-3 h-full bg-white">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                    <Image 
                        src={imageUrl || "/placeholder.jpg"}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute top-2 right-2 bg-sky-700 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {salesCount} Sales
                    </div>
                </div>
                <div className="flex flex-col pt-3">
                    <div className="text-lg font-semibold group-hover:text-sky-700 transition line-clamp-2">
                        {title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {category || "Uncategorized"}
                    </p>

                    <div className="mt-3 flex flex-col gap-y-2">
                        <div className="flex items-center gap-x-1 text-slate-500 text-xs">
                            <User className="h-3 w-3" />
                            <span>By {teacherName}</span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500 text-xs">
                            <BookOpen className="h-3 w-3" />
                            <span>{chaptersLength} Chapters</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-xs text-slate-500 font-medium uppercase">Price</p>
                            <p className="text-sm font-bold text-slate-700">
                                {formatPrice(price)}
                            </p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xs text-sky-700 font-medium uppercase">Total Revenue</p>
                            <p className="text-lg font-bold text-sky-700">
                                {formatPrice(revenue)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
