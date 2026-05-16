import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Create Task
export async function POST(request: Request) {
  try {
    const { content, columnId, priority } = await request.json();
    
    // Get highest order in column to append
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: "desc" }
    });
    
    const firstUser = await prisma.user.findFirst();

    const task = await prisma.task.create({
      data: {
        content,
        columnId,
        priority: priority || "Medium",
        order: lastTask ? lastTask.order + 1 : 0,
        authorId: firstUser?.id
      },
      include: { author: true }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// Update task column/order (Drag and Drop)
export async function PUT(request: Request) {
  try {
    const { taskId, newColumnId, newIndex, oldColumnId } = await request.json();
    
    // Simple approach: we fetch all tasks in the new column, insert this task at newIndex, and update all orders
    const tasksInNewCol = await prisma.task.findMany({
      where: { columnId: newColumnId, id: { not: taskId } },
      orderBy: { order: "asc" }
    });

    tasksInNewCol.splice(newIndex, 0, { id: taskId } as any);

    // Run transaction to update all orders and column mapping
    await prisma.$transaction(
      tasksInNewCol.map((t, index) => 
        prisma.task.update({
          where: { id: t.id },
          data: { order: index, columnId: newColumnId }
        })
      )
    );

    // If moved between columns, also reorder old column to be clean
    if (newColumnId !== oldColumnId) {
      const tasksInOldCol = await prisma.task.findMany({
        where: { columnId: oldColumnId },
        orderBy: { order: "asc" }
      });
      await prisma.$transaction(
        tasksInOldCol.map((t, index) => 
          prisma.task.update({
            where: { id: t.id },
            data: { order: index }
          })
        )
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
