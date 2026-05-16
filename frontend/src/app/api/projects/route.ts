import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Since we don't have auth yet, we'll assign the first user as the creator
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users exist in the system to assign to." }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        color,
        members: {
          create: [
            { userId: firstUser.id }
          ]
        }
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    // Automatically create default columns for the new project
    await prisma.boardColumn.createMany({
      data: [
        { title: "To Do", order: 0, projectId: newProject.id },
        { title: "In Progress", order: 1, projectId: newProject.id },
        { title: "Review", order: 2, projectId: newProject.id },
        { title: "Done", order: 3, projectId: newProject.id },
      ]
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
