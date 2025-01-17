import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { projId: string } }) {
  const { projId } = params;

  console.log(projId)
  console.log("HEHEHEHHEHEHEHEH")

  try {
    const investments = await prisma.investmentHistory.findMany({
      where: { projectId: projId },
      orderBy: { createdAt: 'asc' },
    });

    console.log(investments)

    let cumulativeValue = 0;
    const chartData = investments.map((investment) => {
      cumulativeValue += investment.projectValue;
      return {
        time: investment.createdAt.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
        value: cumulativeValue,
      };
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error(`Error fetching investments for project ${projId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
