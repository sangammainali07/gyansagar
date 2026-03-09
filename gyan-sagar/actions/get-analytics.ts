

import { db } from "@/lib/db";

import { Course, Purchase } from "@prisma/client";

type purchaseWithCourse = Purchase & {
    course: {
        id: string;
        title: string;
        price: number | null;
    };
}

const groupByCourse = (purchases: purchaseWithCourse[]) => {
    const grouped: {[courseTitle:string]: number} = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title || "Untitled Course";
        const price = purchase.course.price ?? 0;
        
        console.log("[groupByCourse] Course:", courseTitle, "Price:", price);
        
        if (grouped[courseTitle] !== undefined) {
            grouped[courseTitle] += price;
        } else {
            grouped[courseTitle] = price;
        }
    });
    
    console.log("[groupByCourse] Final grouped:", grouped);
    return grouped;
}


export const getAnalytics = async (userId:string) => {


    try {

        const purchases = await db.purchase.findMany({
            where: {
                course: {
                    userId:userId
                }
            },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            }
        });

        console.log("[GET_ANALYTICS] Purchases found:", purchases.length);
        console.log("[GET_ANALYTICS] Full purchase:", JSON.stringify(purchases, null, 2));

        const groupedEarnings = groupByCourse(purchases);

        const data = Object.entries(groupedEarnings).map(([courseTitle, total]) => ({
            name:courseTitle,
            total:total,
        })); 

        console.log("[GET_ANALYTICS] Grouped data:", data);

        const totalRevenue = purchases.reduce((acc, curr) => acc + (curr.course.price ?? 0), 0);
        const totalSales = purchases.length;

   
        return {
            data,
            totalRevenue,
            totalSales,
        }


    } catch (error) {
        console.log("[GET_ANALYTICS]", error);
        return {
            data : [],
            totalRevenue: 0,
            totalSales: 0,
        }
    }

}