import { auth as nextAuth } from "@/auth";

export const auth = async () => {
  const session = await nextAuth();
  return {
    userId: session?.user?.id || null,
    role: session?.user?.role || null,
  };
};

export const currentUser = async () => {
  const session = await nextAuth();
  return session?.user || null;
};
