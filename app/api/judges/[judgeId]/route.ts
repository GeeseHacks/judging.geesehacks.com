import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(req: Request, { params }: { params: { judgeId: string } }) {
  const { judgeId } = params;

  if (!judgeId) {
    return NextResponse.json({ error: "Judge ID is required" }, { status: 400 });
  }

  try {
    // Query the database for the judge
    const judge = await prisma.judge.findUnique({
      where: { id: parseInt(judgeId) },
    });

    if (judge) {
      return NextResponse.json({ name: judge.name }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(`Error fetching judge with ID ${judgeId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}