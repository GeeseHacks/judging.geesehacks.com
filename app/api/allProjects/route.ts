import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Fetch all projects with their categories, filtered by categoryId = 5
    const projects = await prisma.project.findMany({
      where: {
        categories: {
          some: {
            categoryId: 5,
          },
        },
      },
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
        judges: {
          where: {
            judgeId: parseInt(
              request.nextUrl.searchParams.get("judgeId") || "0"
            ),
          },
          select: {
            amountInvested: true,
          },
        },
      },
    });

    if (!projects || projects.length === 0) {
      return NextResponse.json({ error: "No projects found" }, { status: 404 });
    }

    // Format the response to match the Project interface
    const formattedProjects = projects.map((project) => {
      const totalValue = project.categories.reduce(
        (sum, category) => sum + category.investmentAmount,
        0
      );

      // Get this judge's investment in the project (if any)
      const judgeInvestment = project.judges[0]?.amountInvested || 0;

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        value: "$" + totalValue.toString(),
        invested: "$" + judgeInvestment.toString(),
        icon: project.imageUrl || "",
      };
    });

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}