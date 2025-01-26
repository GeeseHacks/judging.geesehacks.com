import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { projId: string } }
) {
  const url = new URL(request.url);
  // const judgeId = url.searchParams.get('judgeId');
  const { projId } = params;

  // console.log("Received Judge ID:", judgeId, "Project ID:", projId);

  // if (!judgeId || isNaN(parseInt(judgeId)) || !projId) {
  //   return NextResponse.json(
  //     { error: "Invalid judgeId or projId" },
  //     { status: 400 }
  //   );
  // }

  try {
    // const judgeIdInt = parseInt(judgeId);

    // Fetch project details
    const project = await prisma.project.findUnique({
      where: { id: projId },
      select: {
        name: true,
        description: true,
        devpostLink: true,
        imageUrl: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch judge's available funds
    // const judge = await prisma.judge.findUnique({
    //   where: { id: judgeIdInt },
    //   select: {
    //     availableFunds: true,
    //   },
    // });

    // if (!judge) {
    //   return NextResponse.json({ error: "Judge not found" }, { status: 404 });
    // }

    // Fetch current project value based on judge's category
    // const judgeCategory = await prisma.judgeCategory.findFirst({
    //   where: { judgeId: judgeIdInt },
    //   include: { category: true },
    // });

    // if (!judgeCategory) {
    //   return NextResponse.json(
    //     { error: "Judge's category not found" },
    //     { status: 404 }
    //   );
    // }

    // const categoryId = judgeCategory.categoryId;

    const projectCategory = await prisma.projectCategory.findFirst({
      where: { projectId: projId, categoryId: 5 },
      select: {
        investmentAmount: true,
      },
    });

    if (!projectCategory) { 
      return NextResponse.json(
        {
          error:
            "Project category not found or does not match judge's category",
        },
        { status: 404 }
      );
    }
    const curVal = projectCategory.investmentAmount;

    // Fetch project members
    const projectMembers = await prisma.user.findMany({
      where: { project_id: projId },
      select: { firstname: true, lastname: true },
    });

    const members = projectMembers.map(
      (user) => `${user.firstname} ${user.lastname}`
    );

    // Fetch judge's investment in the project
    // const judgeProject = await prisma.judgeProject.findFirst({
    //   where: {
    //     projectId: projId,
    //   },
    //   select: {
    //     amountInvested: true,
    //   },
    // });

    // const investedAmount = judgeProject ? judgeProject.amountInvested : 0;

    // Build response object
    const response = {
      name: project.name,
      description: project.description,
      devpostLink: project.devpostLink,
      icon: project.imageUrl || "",
      currentValue: `$${curVal.toLocaleString()}`,
      //yourInvestment: `$${investedAmount.toLocaleString()}`,
     // balance: `$${judge.availableFunds.toLocaleString()}`,
      projectMembers: members,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
