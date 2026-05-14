"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import bcryptjs from "bcryptjs";
import { getUserByEmail, getUserById } from "@/lib/user";
import { sendAccountDeletionEmail } from "@/lib/mail";
import { currentUser } from "@/lib/auth-helper";

const DeleteAccountSchema = z.object({
  password: z.string().optional(),
  captchaAnswer: z.string().optional(),
  expectedCaptcha: z.string().optional(),
});

export const deleteAccount = async (values: z.infer<typeof DeleteAccountSchema>) => {
  const user = await currentUser();

  if (!user || !user.id || !user.email) {
    return { error: "Unauthorized" };
  }

  const validatedFields = DeleteAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password, captchaAnswer, expectedCaptcha } = validatedFields.data;

  const existingUser = await getUserById(user.id);
  if (!existingUser) {
    return { error: "User not found!" };
  }

  // Security Case 1: Password User
  if (existingUser.password) {
    if (!password) {
      return { error: "Password is required to delete your account." };
    }
    const passwordsMatch = await bcryptjs.compare(password, existingUser.password);
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }
  } 
  // Security Case 2: OAuth User
  else {
    if (!captchaAnswer || !expectedCaptcha || captchaAnswer.trim() !== expectedCaptcha.trim()) {
      return { error: "Incorrect CAPTCHA answer!" };
    }
  }

  try {
    // Database Cleanup
    // 1. Unpublish courses owned by teacher to preserve student purchases
    await db.course.updateMany({
      where: { userId: user.id },
      data: { isPublished: false }
    });

    // 2. Delete student specific records
    await db.userProgress.deleteMany({
      where: { userId: user.id }
    });

    await db.purchase.deleteMany({
      where: { userId: user.id }
    });

    await db.stripeCustomer.deleteMany({
      where: { userId: user.id }
    });

    // 3. Delete the user (this cascades to Account and Session)
    await db.user.delete({
      where: { id: user.id }
    });

    // Send confirmation email asynchronously
    sendAccountDeletionEmail(user.email).catch(console.error);

    return { success: "Account deleted successfully." };
  } catch (error) {
    console.error("[DELETE_ACCOUNT_ERROR]", error);
    return { error: "Something went wrong while deleting your account." };
  }
};
