import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: String } }) {
    const { id:projectId } = params;

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


export async function POST(request: NextRequest, { params }: { params: { id: String } }) {
    const { id} = params;

    const projectId = Number(id);
    try {
      // Parse the request body
      const { amount, judgeId} = await request.json();

      console.log(amount);
      console.log(judgeId);
      console.log(projectId);

  
      // Validate input
      if (!amount || !judgeId || !projectId) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
  
      const judge = await prisma.judge.findUnique({
        where: { id: judgeId },
      });
  
      if (!judge) {
        return NextResponse.json({ error: 'Judge not found' }, { status: 404 });
      }
  
      // Check if the judge has enough funds
      if (judge.availableFunds < amount) {
        return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 });
      }
  
      // Create the investment in the database
      const investment = await prisma.investment.create({
        data: {
          amount,
          judgeId,
          projectId,
        },
      });
  
      // Deduct the amount from the judge's available funds
      await prisma.judge.update({
        where: { id: judgeId },
        data: {
          availableFunds: {
            decrement: amount,
          },
        },
      });
  
      // Update the project's total investment
      await prisma.project.update({
        where: { id: projectId },
        data: {
          totalInvestment: {
            increment: amount, // Add the investment amount to the total
          },
        },
      });
  
      // Return the created investment
      return NextResponse.json({ success: true, investment }, { status: 201 });
    } catch (error) {
      console.error('Error creating investment:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  