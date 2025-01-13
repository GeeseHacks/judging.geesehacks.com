import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const judgeId = url.searchParams.get('judgeId');

  try {
    if (!judgeId || isNaN(parseInt(judgeId))) {
      return NextResponse.json({ error: "Invalid judgeId" }, { status: 400 });
    }

    const judgeIdInt = parseInt(judgeId);

    // Fetch projects assigned to the judge
    const judgeProjects = await prisma.judge.findUnique({
      where: { id: judgeIdInt },
      select: {
        projects: true,
      },
    });

    if (!judgeProjects) {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }

    return NextResponse.json(judgeProjects.projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching judge projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
