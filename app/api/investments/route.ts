import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const { projectId } = params;

  try {
    // Fetch investments for the given projectId
    const investments = await prisma.investment.findMany({
      where: {
        projectId: parseInt(projectId), // Make sure projectId is an integer
      },
      include: {
        project: true, // Include project details if needed
      },
    });

    // If no investments found for the project, return a 404
    if (!investments.length) {
      return NextResponse.json({ error: 'No investments found for this project' }, { status: 404 });
    }

    // Transform the investments into the desired format
    const dataForProject: { time: string; value: number }[] = investments.map((investment) => ({
      time: investment.createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      value: investment.amount,
    }));

    // Send back the investment data with a 200 response
    return NextResponse.json({ projectId, investments: dataForProject }, { status: 200 });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

