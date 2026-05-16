import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const team = await prisma.user.findMany({
      include: {
        pastWork: true,
        tasks: {
          where: { status: { not: "Done" } }, // active tasks
          select: { content: true, status: true }
        }
      }
    });

    // Format for frontend
    const formattedTeam = team.map(member => ({
      ...member,
      activeTasks: member.tasks.map(t => ({ title: t.content, status: t.status }))
    }));

    return NextResponse.json(formattedTeam);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}
