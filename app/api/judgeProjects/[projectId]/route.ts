import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { projId: string } }) {
  const url = new URL(request.url);
  const judgeId = url.searchParams.get('judgeId');

  const { projId } = params;

  try {
    if (!judgeId || isNaN(parseInt(judgeId))) {
      return NextResponse.json({ error: "Invalid judgeId" }, { status: 400 });
    }

    const judgeIdInt = parseInt(judgeId);

    // Fetch projects assigned to the judge
    const rightProject = await prisma.judgeProject.findFirst({
      where: {
        judgeId: judgeIdInt, // Match the judgeId
        projectId: projId,   // Match the projectId
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl:true,
          },
        },
      },
    });
    

    if (!rightProject) {
      return NextResponse.json({ error: "No projects found for this judge" }, { status: 404 });
    }
    

    // Format the response to include only project details
    const response = {
      name: rightProject.project.name,
      description: rightProject.project.description,
      icon: rightProject.project.imageUrl || '', // Fallback if imageUrl is null
      currentValue: `$${currentValue.toLocaleString()}`,
      yourInvestment: `$${yourInvestment.toLocaleString()}`,
      balance: `$${balance.toLocaleString()}`,
      projectMembers: project.judges.map((j) => j.judge.name), // List judge names associated with the project
    };

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching judge projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
