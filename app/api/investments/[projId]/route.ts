import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

function roundToNearest5Minutes(date: Date): Date {
  const minutes = date.getMinutes();
  const remainder = minutes % 5;
  const roundedMinutes = remainder < 2.5 ? minutes - remainder : minutes + (5 - remainder);

  // Set the rounded minutes, reset seconds and milliseconds
  date.setMinutes(roundedMinutes);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
}

export async function POST(req: NextRequest, { params }: { params: { projId: string } }) {
  const { projId } = params;

  try{
    const { amount, judgeId} = await req.json();

    if (!amount || !judgeId || !projId) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const judgeCategory = await prisma.judgeCategory.findFirst({
      where: { judgeId: judgeId },
      include: { category: true },
    });

    if (!judgeCategory) {
      throw new Error("Judge's category not found.");
    }

    await prisma.judgeProject.update({
      where: {
        judgeId_projectId:{
          judgeId: judgeId,
          projectId: projId
        }
      },
      data: {
        amountInvested: {
          increment: amount
        }
      }
    })

    const categoryId = judgeCategory.categoryId;

    // Step 2: Get the project's category and current investment amount
    const projectCategory = await prisma.projectCategory.findFirst({
      where: { projectId: projId, categoryId },
    });

    if (!projectCategory) {
      throw new Error("Project category not found or does not match judge's category.");
    }

    // Step 3: Validate and deduct judge's available funds
    const judge = await prisma.judge.findUnique({
      where: { id: judgeId },
    });

    if (!judge) {
      throw new Error("Judge not found.");
    }

    if (judge.availableFunds < amount) {
      throw new Error("Insufficient funds for the investment.");
    }

    await prisma.judge.update({
      where: { id: judgeId },
      data: { availableFunds: { decrement: amount } },
    });

    // Step 4: Update the project's investment amount
    await prisma.projectCategory.update({
      where: { projectId_categoryId: { projectId: projId, categoryId } },
      data: { investmentAmount: { increment: amount } },
    });

    // Step 5: Log the transaction in InvestmentHistory
    await prisma.investmentHistory.create({
      data: {
        judgeId: judgeId,
        projectId: projId,
        projectValue: projectCategory.investmentAmount + amount,
        createdAt: roundToNearest5Minutes(new Date())
      },
    });

    console.log("Investment successfully completed!");

    return NextResponse.json({message: "Investment successful"
    }, {status:200})

  } catch (error){
    console.error('Error making investment:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }

}

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
      return {
        time: investment.createdAt.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
        value: investment.projectValue,
      };
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error(`Error fetching investments for project ${projId}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/*
1. Make POST api for investments (when judges make investments)
2. Make get api to get all the projects that a judge is responsible for
3. Make another get api to get details about a specific project
*/

