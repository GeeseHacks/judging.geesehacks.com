import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const judgeId = 6969; // TODO: Replace with actual judge authentication

    const judge = await prisma.judge.findUnique({
      where: { id: judgeId },
      select: { availableFunds: true },
    });

    if (!judge) {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }

    return NextResponse.json({ balance: judge.availableFunds });
  } catch (error) {
    console.error("Error fetching judge balance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
