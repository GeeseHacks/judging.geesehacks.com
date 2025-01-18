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

    // Fetch projects assigned to the judge along with project value and icon
    const judgeProjects = await prisma.judgeProject.findMany({
      where: { judgeId: judgeIdInt },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            description: true,
            imageUrl: true,
            categories: {
              select: {
                investmentAmount: true,
              },
            },
          },
        },
      },
    });

    if (!judgeProjects || judgeProjects.length === 0) {
      return NextResponse.json({ error: "No projects found for this judge" }, { status: 404 });
    }

    // Format the response to match the Project interface
    const projects = judgeProjects.map((jp) => {
      const project = jp.project;
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        value: project.categories.reduce((sum, category) => sum + category.investmentAmount, 0).toString(), // Sum all investmentAmounts
        invested: '', // Placeholder for now
        icon: project.imageUrl || '', // Default to empty string if no imageUrl
      };
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching judge projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
