import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { projId: string } }
) {
  const { projId } = params;

  try {
    const { amount, judgeId } = await req.json();

    if (!amount || !judgeId || !projId) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Parse judgeId to an integer
    const judgeIdInt = parseInt(judgeId, 10);

    const judgeCategory = await prisma.judgeCategory.findFirst({
      where: { judgeId: judgeIdInt },
      include: { category: true },
    });

    if (!judgeCategory) {
      throw new Error("Judge's category not found.");
    }

    // Get current JudgeProject record to check amountInvested
    const currentJudgeProject = await prisma.judgeProject.findUnique({
      where: {
        judgeId_projectId: {
          judgeId: judgeIdInt,
          projectId: projId,
        },
      },
    });

    if (!currentJudgeProject) {
      throw new Error("Judge's project record not found.");
    }

    // Check if retraction would result in negative amount
    if (amount < 0 && Math.abs(amount) > currentJudgeProject.amountInvested) {
      return NextResponse.json(
        {
          error: "Cannot retract more than previously invested",
        },
        { status: 400 }
      );
    }

    // Get current ProjectCategory record to check investmentAmount
    const projectCategory = await prisma.projectCategory.findFirst({
      where: { projectId: projId, categoryId: judgeCategory.categoryId },
    });

    if (!projectCategory) {
      throw new Error("Project category not found.");
    }

    // Check if retraction would result in negative amount for project category
    if (amount < 0 && Math.abs(amount) > projectCategory.investmentAmount) {
      return NextResponse.json(
        {
          error: "Cannot retract more than total project investment",
        },
        { status: 400 }
      );
    }

    await prisma.judgeProject.update({
      where: {
        judgeId_projectId: {
          judgeId: judgeIdInt,
          projectId: projId,
        },
      },
      data: {
        amountInvested: {
          increment: amount,
        },
      },
    });

    const categoryId = judgeCategory.categoryId;

    // Step 3: Validate and deduct judge's available funds
    const judge = await prisma.judge.findUnique({
      where: { id: judgeIdInt },
    });

    if (!judge) {
      throw new Error("Judge not found.");
    }

    if (judge.availableFunds < amount) {
      throw new Error("Insufficient funds for the investment.");
    }

    await prisma.judge.update({
      where: { id: judgeIdInt },
      data: { availableFunds: { decrement: amount } },
    });

    // Step 4: Update the project's investment amount
    await prisma.projectCategory.update({
      where: { projectId_categoryId: { projectId: projId, categoryId } },
      data: { investmentAmount: { increment: amount } },
    });

    if (categoryId == 5) {
      // Calculate the current 5-minute window timestamp
      const currentTimeWindow = new Date(
        Math.floor(new Date().getTime() / (5 * 60 * 1000)) * (5 * 60 * 1000)
      );

      // Check for existing entry in the same time window
      const existingEntry = await prisma.investmentHistory.findFirst({
        where: {
          projectId: projId,
          createdAt: currentTimeWindow,
        },
      });

      if (existingEntry) {
        // Update existing entry with new cumulative value
        await prisma.investmentHistory.delete({
          where: { id: existingEntry.id },
        });

        await prisma.investmentHistory.create({
          data: {
            judgeId: judgeIdInt,
            projectId: projId,
            projectValue: existingEntry.projectValue + amount,
            createdAt: currentTimeWindow,
          },
        });
      } else {
        // Create new entry if none exists in this time window
        await prisma.investmentHistory.create({
          data: {
            judgeId: judgeIdInt,
            projectId: projId,
            projectValue: projectCategory.investmentAmount + amount,
            createdAt: currentTimeWindow,
          },
        });
      }
    }

    console.log("Investment successfully completed!");

    return NextResponse.json(
      { message: "Investment successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error making investment:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { projId: string } }
) {
  const { projId } = params;

  try {
    const investments = await prisma.investmentHistory.findMany({
      where: { projectId: projId },
      orderBy: { createdAt: "asc" },
    });

    console.log(investments);

    let cumulativeValue = 0;
    const chartData = investments.map((investment) => {
      cumulativeValue += investment.projectValue;
      return {
        time: investment.createdAt.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        value: cumulativeValue,
      };
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error(`Error fetching investments for project ${projId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/*
1. Make POST api for investments (when judges make investments)
2. Make get api to get all the projects that a judge is responsible for
3. Make another get api to get details about a specific project
*/
