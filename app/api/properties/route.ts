import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const property = await prisma.property.create({
      data: body,
    });

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 });
  }
}
