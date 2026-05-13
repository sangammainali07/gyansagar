import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";

type CourseWithRevenue = Course & {
  category: Category | null;
  chapters: { id: string }[];
  revenue: number;
  salesCount: number;
  teacherName?: string | null;
};

// Manual Quick Sort implementation for sorting courses by revenue
function quickSort(arr: CourseWithRevenue[]): CourseWithRevenue[] {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x.revenue > pivot.revenue);
  const middle = arr.filter((x) => x.revenue === pivot.revenue);
  const right = arr.filter((x) => x.revenue < pivot.revenue);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

export const getHighestSellingCourses = async (): Promise<CourseWithRevenue[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          select: {
            id: true,
          },
        },
      },
    });

    // Fetch teacher names separately or include them if User relation exists
    // For this project, userId in Course refers to the teacher
    const userIds = [...new Set(courses.map((course) => course.userId))];
    const teachers = await db.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            name: true
        }
    });

    const teacherMap = new Map(teachers.map(t => [t.id, t.name]));

    const coursesWithRevenue: CourseWithRevenue[] = courses.map((course) => {
      const salesCount = course.purchases.length;
      const revenue = salesCount * (course.price || 0);
      
      return {
        ...course,
        revenue,
        salesCount,
        teacherName: teacherMap.get(course.userId) || "Unknown Instructor",
      };
    });

    // Use manual Quick Sort to sort by revenue descending
    const sortedCourses = quickSort(coursesWithRevenue);

    return sortedCourses;
  } catch (error) {
    console.error("[GET_HIGHEST_SELLING]", error);
    return [];
  }
};
