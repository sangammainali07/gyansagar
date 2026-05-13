import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token }
    });
    return verificationToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token: hashedToken }
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email }
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordChangeTokenByToken = async (token: string) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const passwordChangeToken = await db.passwordChangeToken.findUnique({
      where: { token: hashedToken }
    });
    return passwordChangeToken;
  } catch {
    return null;
  }
};

export const getPasswordChangeTokenByEmail = async (email: string) => {
  try {
    const passwordChangeToken = await db.passwordChangeToken.findFirst({
      where: { email }
    });
    return passwordChangeToken;
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  await db.passwordResetToken.create({
    data: {
      email,
      token: hashedToken,
      expires
    }
  });

  return { email, token }; // Return raw token for email
};

export const generatePasswordChangeToken = async (email: string, newPasswordHash: string) => {
  const token = uuidv4();
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour

  const existingToken = await getPasswordChangeTokenByEmail(email);

  if (existingToken) {
    await db.passwordChangeToken.delete({
      where: { id: existingToken.id }
    });
  }

  await db.passwordChangeToken.create({
    data: {
      email,
      token: hashedToken,
      newPassword: newPasswordHash,
      expires
    }
  });

  console.log("GENERATED PASSWORD CHANGE TOKEN FOR:", email);

  return { email, token };
};
