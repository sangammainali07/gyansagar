"use server";

import * as z from "zod";
import bcryptjs from "bcryptjs";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ChangePasswordSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/lib/user";
import { generatePasswordChangeToken, getPasswordChangeTokenByToken } from "@/lib/tokens";
import { sendPasswordChangeVerificationEmail, sendPasswordChangedConfirmationEmail } from "@/lib/mail";

export const requestChangePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
  const session = await auth();

  if (!session?.user?.id) {
    console.log("NO SESSION USER ID FOUND");
    return { error: "Unauthorized" };
  }

  console.log("REQUESTING PASSWORD CHANGE FOR USER ID:", session.user.id);

  const validatedFields = ChangePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const user = await getUserById(session.user.id);

  if (!user || !user.password || !user.email) {
    console.log("USER DATA MISSING:", { hasUser: !!user, hasPassword: !!user?.password, hasEmail: !!user?.email });
    return { error: "User not found!" };
  }

  console.log("COMPARING PASSWORDS FOR:", user.email);
  const passwordsMatch = await bcryptjs.compare(currentPassword, user.password);
  console.log("PASSWORDS MATCH:", passwordsMatch);

  if (!passwordsMatch) {
    return { error: "Incorrect current password!" };
  }

  const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

  const verificationToken = await generatePasswordChangeToken(user.email, hashedNewPassword);

  await sendPasswordChangeVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Verification email sent!" };
};

export const completeChangePassword = async (token: string) => {
  const existingToken = await getPasswordChangeTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const user = await getUserByEmail(existingToken.email);

  if (!user) {
    console.error("USER NOT FOUND FOR EMAIL:", existingToken.email);
    return { error: "User not found!" };
  }

  console.log("UPDATING PASSWORD FOR USER:", user.email);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: { password: existingToken.newPassword }
  });

  if (updatedUser) {
    console.log("PASSWORD SUCCESSFULLY UPDATED IN DB FOR:", user.email);
  }

  await db.passwordChangeToken.delete({
    where: { id: existingToken.id }
  });

  await sendPasswordChangedConfirmationEmail(user.email!);

  return { success: "Password changed successfully!" };
};
