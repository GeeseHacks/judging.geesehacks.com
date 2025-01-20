import { NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { uniqueKey } = body;

    if (!uniqueKey) {
      return NextResponse.json(
        { success: false, message: "Key is required" },
        { status: 400 }
      );
    }

    // Query the database for a judge with the provided unique key
    const judge = await prisma.judge.findUnique({
      where: { login_key: uniqueKey },
    });

    if (judge) {
      return NextResponse.json(
        { success: true, judgeId: judge.id, name: judge.name },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid key" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
