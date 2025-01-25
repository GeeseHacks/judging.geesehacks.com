"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StockGraph from "../../stock-market/StockGraph";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ProjectBrowserHeader from "@/components/ProjectBrowserHeader";

interface Project {
  id: string;
  name: string;
  value: string;
  invested: string;
  change: string;
}

const MyInvestments: React.FC = () => {
  const [teamsData, setTeamsData] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const judgeId = 3; // Replace with actual judge ID from authentication
        const response = await fetch(`/api/judgeProjects?judgeId=${judgeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch investments");
        }
        const data = await response.json();

        // Transform the data and sort by invested amount in descending order
        const transformedData = data
          .map((project: any) => ({
            id: project.id,
            name: project.name,
            value: project.value,
            invested: project.invested,
            change: "+50%", // Will probably remove later
          }))
          .sort((a: Project, b: Project) => {
            // Remove any non-numeric characters and convert to number
            const aValue = parseFloat(a.invested.replace(/[^0-9.-]+/g, ""));
            const bValue = parseFloat(b.invested.replace(/[^0-9.-]+/g, ""));
            return bValue - aValue;
          });

        setTeamsData(transformedData);
      } catch (error) {
        console.error("Error fetching investments:", error);
      }
    };

    fetchInvestments();
  }, []);

  const handleRowClick = (projectID: string) => {
    router.push(`/dashboard/project-browser/${projectID}`);
  };

  return (
    <div className="relative flex flex-col h-full pl-80">
      <div className="absolute -top-24 -left-36 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-10 blur-3xl z-[-10]"></div>
      <div className="absolute -bottom-20 -right-12 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-10 blur-3xl z-[-10]"></div>
      <div className="px-7 lg:px-2 flex-1 flex flex-col">
        <ProjectBrowserHeader currentTab="investments" />

        {/* Add the table after the navigation buttons */}
        <div className="mt-6">
          <Card className="flex-1 flex w-full h-full min-w-0 overflow-hidden bg-opacity-5 bg-white py-9 px-10">
            <TooltipProvider>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">
                      Rank
                    </TableHead>
                    <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">
                      Name
                    </TableHead>
                    <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            Invested Value
                            <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The amount you have invested in this project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                    <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            Total Value
                            <Info className="h-4 w-4" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The total investment value across all judges</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamsData.map((team) => (
                    <TableRow
                      key={team.id}
                      className="hover:bg-[#0E0823] cursor-pointer"
                      onClick={() => handleRowClick(team.id)}
                    >
                      <TableCell className="sm:text-[18px] text-[#D175FA] font-bold px-10 py-6 rounded-tl-2xl rounded-bl-2xl">
                        {teamsData.indexOf(team) + 1}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                              className="sm:text-[18px] font-bold text-white"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {team.name}
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{team.name} Stock Graph</DialogTitle>
                              <DialogDescription>
                                Detailed graph data for {team.name}.
                              </DialogDescription>
                            </DialogHeader>
                            <StockGraph
                              projId={"a72d1d4e-6187-49be-b3e4-c7e47b9884b2"}
                            />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-[#F1D2FF] sm:text-lg font-semibold">
                        {team.value}
                      </TableCell>
                      <TableCell className="sm:text-lg text-[#95F2FF] font-semibold pr-10 rounded-tr-2xl rounded-br-2xl">
                        {team.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TooltipProvider>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyInvestments;
