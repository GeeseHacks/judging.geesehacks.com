import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const judgeId = url.searchParams.get('judgeId');

  console.log("Received Judge ID:", judgeId, "Project ID:");

  if (!judgeId || isNaN(parseInt(judgeId))) {
    return NextResponse.json(
      { error: "Invalid judgeId or projId" },
      { status: 400 }
    );
  }
  try {
    const judgeIdInt = parseInt(judgeId);

    const judge = await prisma.judge.findUnique({
      where: { id: judgeIdInt },
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
