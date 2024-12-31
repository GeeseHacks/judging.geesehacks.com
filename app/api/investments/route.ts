import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(req: NextRequest) {
    try {
        // Fetch all investments with related project (team) details
        const investments = await prisma.investment.findMany({
          include: {
            Project: true, // Include project (team) details
          },
          orderBy: {
            createdAt: 'asc', // Ensure investments are processed in chronological order
          },
        });

        // console.log(investments);
    
        // Transform investments into the desired format
        const dataForTeams: Record<string, { time: string; value: number }[]> = {};

        const projectTrackers: Record<string, number> = {};

        // Iterate over the fetched investments
        investments.forEach((investment) => {
          const { Project, amount, createdAt } = investment;

          if (!(Project.name in projectTrackers)) {
            projectTrackers[Project.name] = 100_000; // Start at 100k
            dataForTeams[Project.name] = []; // Initialize the team in the result object
          }

          // Update the cumulative value for the project
          const prevValue = projectTrackers[Project.name];
          const newValue = prevValue + amount;
          projectTrackers[Project.name] = newValue;

    
          // Format the timestamp to a string like "11:00 AM"
          const time = createdAt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })
          
          // Push investment data for that time and amount
          dataForTeams[Project.name].push({
            time,
            value: newValue,
          });
        });
    
        // Send the response back as JSON

        console.log(dataForTeams);
        return NextResponse.json(dataForTeams, { status: 200 });
      } catch (error) {
        console.error('Error fetching investments:', error);
        return new NextResponse(JSON.stringify({ message: 'Generated token' }), { status: 500 });
      }
}