import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import StockGraph from "./StockGraph";

// const teamsData = [
//   { id: 1, name: "Team 1", value: "$1,000,000", change: "+50%" },
//   { id: 2, name: "Team 2", value: "$1,000,000", change: "+50%" },
//   { id: 3, name: "Team 3", value: "$1,000,000", change: "+50%" },
//   { id: 4, name: "Team 4", value: "$1,000,000", change: "+50%" },
//   { id: 5, name: "Team 5", value: "$1,000,000", change: "+50%" },
// ];

interface Team {
  id: number;
  name: string;
  value: string;
  change: string;
  projectId: string;
}

const LeaderBoard = ({category}: {category:string}) => {
  const [teamsData, setTeams] = useState<Team[]>([]);
  
  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch(`/api/teamData/${category}`);
      const data = await response.json();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleRowClick = (teamName: string) => {
    setSelectedTeam(teamName); // Set the selected team
  };
  
  
  return (
    <div>
      <Card className="flex-1 flex w-full h-full min-w-0 overflow-hidden bg-opacity-5 bg-white pt-7 sm:py-9 px-2 sm:px-10">
        <Table>
          {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
          <TableHeader>
            <TableRow>
                <TableHead className="w-[100px] pb-4"></TableHead>
                <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">ID</TableHead>
                <TableHead className="text-lg sm:text-xl font-bold text-white pb-4">Value</TableHead>
                <TableHead className="text-right text-lg sm:text-xl font-bold text-white pb-4">% Change</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {teamsData.map((team) => (
              <TableRow key={team.id} className="hover:bg-[#0E0823] cursor-pointer">
                <TableCell className="text-[20px] text-[#D175FA] font-bold">{team.id}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="text-[20px] font-bold text-white underline"
                        onClick={() => handleRowClick(team.name)}
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
                      <StockGraph projId={team.projectId} />
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-[#F1D2FF] text-lg font-bold">{team.value}</TableCell>
                <TableCell className="text-right text-lg text-[#95F2FF] font-bold">{team.change}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default LeaderBoard;