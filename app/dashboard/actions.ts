"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import dbConnect from "@/backend/lib/db";
import ClassModel from "@/backend/models/Class";

type CreateClassInput = {
  name: string;
  subject?: string | null;
  description?: string | null;
  accentColor?: string | null;
};

function parseCreateClass(formData: FormData): CreateClassInput {
  return {
    name: String(formData.get("name") ?? "").trim(),
    subject: (formData.get("subject") as string | null)?.trim() || null,
    description: (formData.get("description") as string | null)?.trim() || null,
    accentColor: (formData.get("accentColor") as string | null)?.trim() || null,
  };
}

export async function createClass(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const { name, subject, description, accentColor } =
    parseCreateClass(formData);

  if (!name) {
    throw new Error("Class name is required");
  }

  await dbConnect();

  await ClassModel.create({
    ownerId: userId,
    name,
    subject: subject || undefined,
    description: description || undefined,
    accentColor: accentColor || undefined,
  });

  revalidatePath("/dashboard");
}
