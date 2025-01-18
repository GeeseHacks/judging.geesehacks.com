import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { projId : string } }) {
  const url = new URL(request.url);
  const judgeId = url.searchParams.get('judgeId');

  const {projId} = params;

  console.log(judgeId, projId)

  if (!judgeId || isNaN(parseInt(judgeId)) || !projId) {
    return NextResponse.json({ error: "Invalid judgeId or projId" }, { status: 400 });
  }

  try{

    const judgeIdInt = parseInt(judgeId);

    //name, description, icon
    const project = await prisma.project.findUnique({
      where: { id: projId },
      select: {
        name: true,
        description: true,
        imageUrl: true,
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }
    //balance
    const judge = await prisma.judge.findUnique({
      where: { id: judgeIdInt },
      select: {
        availableFunds: true,
      },
    });

    if (!judge) {
      return NextResponse.json({ message: "Judge not found" }, { status: 404 });
    }

    //get current project value
    const judgeCategory = await prisma.judgeCategory.findFirst({
      where: { judgeId: judgeIdInt },
      include: { category: true },
    });

    if (!judgeCategory) {
      throw new Error("Judge's category not found.");
    }

    const categoryId = judgeCategory.categoryId;

    const projectCategory = await prisma.projectCategory.findFirst({
      where: { projectId: projId, categoryId },
      select: {
        investmentAmount: true
      }
    });

    if (!projectCategory) {
      throw new Error("Project category not found or does not match judge's category.");
    }

    const curVal = projectCategory.investmentAmount;

    //projectMembers
    const projectMembers = await prisma.user.findMany({
      where: { project_id: projId },
      select: { firstname: true, lastname: true },
    });

    const members = projectMembers.map((user) => `${user.firstname} ${user.lastname}`);

    const response = {
      name: project.name,
      description: project.description,
      icon: project.imageUrl || "",
      currentValue: curVal.toString(),
      // yourInvestment: yourInvestment.toString(),
      yourInvestment: "$100",
      balance: judge.availableFunds.toString(),
      projectMembers: members,
    };

    console.log(response)

    return NextResponse.json(response);

  } catch (error){
    console.error("Error fetching project data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }


}

