import { NextRequest, NextResponse } from 'next/server';
import prisma from '@lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { category: string } }) {
    const{category:category} = params;

    // const category = "General";

    const validCategories = ["general", "sun life", "teejlab", "cs-can"];
    if (!category || !validCategories.includes(category.toLowerCase())) {
        return NextResponse.json(
        { error: "Invalid or missing category. Valid categories are: general, sun life, teejlab, cs-can." },
        { status: 400 }
        );
    }

    try {
        // Fetch the top 10 projects by investmentAmount for the specified category
        const projects = await prisma.projectCategory.findMany({
          where: {
            category: {
              name: category,
            },
          },
          include: {
            project: true,
          },
          orderBy: {
            investmentAmount: "desc",
          },
          take: 10,
        });

        // console.log("projects", projects)
    
        // Format the response
        const teamsData = projects.map((item, index) => ({
          id: index + 1,
          name: item.project.name,
          value: `$${item.investmentAmount.toLocaleString()}`,
          change: "$50", // Placeholder for change
          projectId: item.project.id
        }));
        console.log("teamsData", teamsData);
        return NextResponse.json(teamsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
          { error: "An error occurred while fetching the data." },
          { status: 500 }
        );
      }
}
