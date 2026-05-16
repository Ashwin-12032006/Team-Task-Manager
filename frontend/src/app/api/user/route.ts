import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // For now, we default to the first user in the system (the "Main" user)
    const user = await prisma.user.findFirst();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, phone, bio } = body;

    const currentUser = await prisma.user.findFirst();
    if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        email,
        role,
        phone,
        bio
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
