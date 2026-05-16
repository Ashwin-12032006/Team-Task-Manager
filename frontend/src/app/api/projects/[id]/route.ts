import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const project = await prisma.project.findUnique({
      where: { id: resolvedParams.id },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            tasks: {
              orderBy: { order: "asc" },
              include: { author: true }
            }
          }
        }
      }
    });

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Format data to match our frontend state structure
    const data = {
      tasks: {} as Record<string, any>,
      columns: {} as Record<string, any>,
      columnOrder: [] as string[]
    };

    project.columns.forEach(col => {
      data.columnOrder.push(col.id);
      data.columns[col.id] = {
        id: col.id,
        title: col.title,
        taskIds: col.tasks.map(t => t.id)
      };
      
      col.tasks.forEach(task => {
        data.tasks[task.id] = {
          id: task.id,
          content: task.content,
          priority: task.priority,
          status: task.status,
          author: task.author
        };
      });
    });

    return NextResponse.json({ project, boardData: data });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
