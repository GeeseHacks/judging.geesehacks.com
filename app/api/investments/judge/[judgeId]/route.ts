import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { judgeId: string } }) {
  const { judgeId } = params;

  try {
    // Fetch investments for the specific judge
    const investments = await prisma.investmentHistory.findMany({
      where: { judgeId: parseInt(judgeId, 10) }, // Assuming `judgeId` is an integer
      include: { project: true }, // Include project details
    });

    const response = investments.map((investment) => ({
      id: investment.id,
      name: investment.project.name,
      value: `$${investment.projectValue.toLocaleString()}`,
      change: '+50%', // Placeholder for percentage change
      projectId: investment.projectId,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error fetching investments for judge ${judgeId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
