import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { projectId: string, judgeId: string } }) {
  const { projectId, judgeId } = params;

  try {
    // Parse IDs
    const projectIdInt = parseInt(projectId);
    const judgeIdInt = parseInt(judgeId);

    if (isNaN(projectIdInt) || isNaN(judgeIdInt)) {
      return NextResponse.json({ error: "Invalid projectId or judgeId" }, { status: 400 });
    }

    // Fetch project details
    const project = await prisma.project.findUnique({
      where: { id: projectIdInt },
      include: {
        Investment: {
          include: { Judge: { select: { name: true } } },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Calculate your investment and balance
    const yourInvestment = project.Investment
      .filter((investment: { judgeId: number; }) => investment.judgeId === judgeIdInt)
      .reduce((total: any, investment: { amount: any; }) => total + investment.amount, 0);

    const judge = await prisma.judge.findUnique({
      where: { id: judgeIdInt },
      select: { availableFunds: true },
    });

    if (!judge) {
      return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    }

    // Prepare project members
    // const projectMembers = project.Investment.map((investment) => investment.Judge.name);

    // Format response
    const response = {
      id: project.id,
      name: project.name,
      description: "placeholder for project description",
      icon: "/static/icons/geesehacks.png", // Static icon
      currentValue: `$${project.totalInvestment.toLocaleString()}`,
      yourInvestment: `$${yourInvestment.toLocaleString()}`,
      balance: `$${judge.availableFunds.toLocaleString()}`,
      projectMembers: ["Ri Hong", "Benny Wu", "Bill Gates"],    //   projectMembers,
    };

    return NextResponse.json({ project: response }, { status: 200 });
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
