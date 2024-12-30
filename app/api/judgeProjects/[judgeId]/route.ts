import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { judgeId: string } }) {
  const { judgeId } = params;

  try {
    // Fetch the judge pair and related projects
    const judgePair = await prisma.judgePair.findFirst({
      where: {
        OR: [
          { primaryJudgeId: parseInt(judgeId) },
          { secondaryJudgeId: parseInt(judgeId) },
        ],
      },
      include: {
        Project: {
          select: {
            id: true,
            name: true,
            // description: true,
            totalInvestment: true,
            // Tag: {
            //   select: {
            //     name: true,
            //     color: true,
            //   },
            // },
          },
        },
      },
    });

    // Handle the case where the judge pair is not found
    if (!judgePair) {
      return NextResponse.json({ error: 'Judge pair not found' }, { status: 404 });
    }

    // Extract project details
    const projects = judgePair.Project.map((project) => ({
      id: project.id,
      name: project.name,
      description: "placeholder WE MUST ADD DESCRIPTION TO PROJECT SCHEMA",
      totalInvestment: project.totalInvestment,
      // tags: project.Tag.map((tag) => ({
      //   name: tag.name,
      //   color: tag.color,
      // })),
    }));

    // Return the project data
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects for judge pair:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
