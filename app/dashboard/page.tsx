import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import dbConnect from "@/backend/lib/db";
import ClassModel from "@/backend/models/Class";

import ClassList, { DashboardClass } from "./components/ClassList";
import NewClassForm from "./components/NewClassForm";

async function getClasses(ownerId: string): Promise<DashboardClass[]> {
  await dbConnect();

  const classes = await ClassModel.find({ ownerId })
    .sort({ createdAt: -1 })
    .lean();

  return classes.map((c) => ({
    id: c._id.toString(),
    name: c.name,
    subject: c.subject ?? undefined,
    description: c.description ?? undefined,
    accentColor: c.accentColor ?? undefined,
    createdAt: c.createdAt?.toISOString(),
  }));
}

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const classes = await getClasses(userId);

  return (
    <div className="min-h-screen bg-(--color-app-background) px-4 py-12 text-(--color-app-text) sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <div className="w-full lg:max-w-sm">
          <div className="space-y-6">
            <header>
              <p className="text-sm font-medium uppercase tracking-wide text-(--color-app-text-muted)">
                Dashboard
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-(--color-app-text)">
                Your classes
              </h1>
              <p className="mt-2 text-sm text-(--color-app-text-muted)">
                Review existing classes or set up a new space for your students.
              </p>
            </header>
            <NewClassForm />
          </div>
        </div>

        <div className="flex-1">
          <ClassList classes={classes} />
        </div>
      </div>
    </div>
  );
}
