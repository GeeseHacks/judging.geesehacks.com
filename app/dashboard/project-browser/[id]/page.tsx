'use client';
import { useEffect, useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; 

interface Project {
  name: string;
  description: string;
  icon: string;
  currentValue: string;
  yourInvestment: string;
  balance: string;
  projectMembers: string[];
}

const ProjectDetails = () => {
  const { id } = useParams();  
  const router = useRouter(); 
  const [project, setProject] = useState<Project | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  // const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(`/api/judgeProjects/3/project/${id}`); // api format: /api/judgeProjects/{judgeId}/projects/{projectId}
        if (!response.ok) {
          throw new Error(`Error fetching project: ${response.status}`);
        }
        const data = await response.json();
        // console.log("HIIIII")
        // console.log(data);
        setProject(data.project);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      }
    };

    if (id) fetchProjectData();
  }, [id, refreshKey]);

  if (!id) return <div>Loading...</div>;

  // Simulated static data based on the project ID.
  // const project = {
  //   id: Number(id),
  //   name: `Project ${id}`,
  //   description: `This is the detailed description of Project ${id}`,
  //   icon: "/static/icons/geesehacks.png",
  //   currentValue: "$100,000,000",
  //   yourInvestment: "$100",
  //   balance: "$100,000",
  //   projectMembers: ["Ri Hong", "Benny Wu", "Bill Gates"],
  // };

  const projId = Number(id);

  const handleAddInvestmentClick = async () => {
    try {
      const response = await fetch(`/api/investments/${projId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: parseInt(investmentAmount),
          judgeId: 3 //HOW TO GET CURRENT LOGGED IN JUDGE'S ID??!!
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setInvestmentAmount("");
      setRefreshKey((prev) => prev + 1);
      // setError(null);
      console.log("Fetched investments:", data.investments);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      // setError("Failed to fetch investments. Please try again later.");
    }
  };

  const handleRetractInvestmentClick = async() => {
    try {
      const response = await fetch(`/api/investments/${projId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          amount: parseInt(investmentAmount) * -1,
          judgeId: 3 //HOW TO GET CURRENT LOGGED IN JUDGE'S ID??!!
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      // setError(null);
      setInvestmentAmount("");
      setRefreshKey((prev) => prev + 1);
      console.log("Fetched investments:", data.investments);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      // setError("Failed to fetch investments. Please try again later.");
    }
  }

  return (
    <div className="relative flex flex-col h-full">
      <div className="absolute -top-24 -left-36 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-10 blur-3xl z-[-10]"></div>
      <div className="absolute -bottom-20 -right-12 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-10 blur-3xl z-[-10]"></div>

      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-6">
        <Image
          src="/static/icons/stock-market-title.png"
          alt="Stock Market Title Image"
          width={35}
          height={35}
        />
        <h1 className="text-3xl md:text-4xl font-semibold text-white">Project Browser</h1>
      </div>

      {/* Description Section */}
      <p className="pb-6 text-base md:text-lg text-gray-500">Some description here</p>
      <div className="flex justify-start ">
        <button
              onClick={() => router.push("/dashboard/project-browser/")}
              className="text-[#BD6CE6] text-lg font-semibold transparent"
            >
          ← All Projects
        </button>
      </div>

      {}
      <div className="flex flex-col gap-3 md:gap-5 mt-6 bg-white p-7 md:p-12 bg-opacity-5 rounded-xl">
        {/* Project Details */}
        <h1 className="text-2xl md:text-3xl font-semibold text-white">{project?.name}</h1>
        <p className="sm:pb-6 text-sm sm:text-lg text-white break-words max-w-[20ch] sm:max-w-[30ch] md:max-w-[50ch]">{project?.description}</p>

        {/* <div className="absolute top-40 right-5 md:top-44 md:right-10 m-5">
          <Image
            src={project?.icon ?? ''}
            alt={`${project?.name} Icon`}
            width={120}
            height={120}
            className="w-24 h-24 sm:w-24 sm:h-24 md:w-32 md:h-32 object-contain"
          />
        </div> */}

        <div className="flex sm:flex-row justify-between font-semibold text-white gap-3 sm:gap-0">
          <div className="flex flex-col">
            <span className="text-[#D175FA] text-base">Current Value</span>
            <span className="text-base md:text-lg">{project?.currentValue}</span>

            <span className="text-[#BD6CE6] mt-2 md:mt-5 text-base">My Balance</span>
            <span className="text-base md:text-lg">{project?.balance}</span>
          </div>
          <div className="flex flex-col pl-7 md:pl-0">
            <span className="text-[#D175FA] text-base">Your Current Investment</span>
            <span className="text-abse md:text-lg">{project?.yourInvestment}</span>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-100 mb-2">Project Members</h3>
            <ul className="space-y-1 text-gray-300">
              {project?.projectMembers?.map((member) => (
                <li key={member} className="text-sm sm:text-center">
                  {member}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* Investment Actions */}
        <div className="mt-4">
          <span className="text-[#D175FA] font-semibold text-base">Change My Investment</span>
          <div className="flex items-center gap-3 mt-3 md:mt-4">
            <input
              type="number"
              placeholder="$"
              value={investmentAmount}
              onChange={(e) => setInvestmentAmount(e.target.value)}
              className="p-2 md:p-3 pl-4 font-semibold rounded-md bg-gray-800 text-white"
          />
          </div>
        </div>
        <div>
        <button
            onClick={handleAddInvestmentClick}
            className="px-4 py-2 font-semibold text-sm md:text-base rounded-lg bg-[#3C3064] text-[#D175FA] mr-5"
          >
            Add Investment
          </button>
          <button 
            onClick={handleRetractInvestmentClick}
            className="mt-3 md:mt-0 px-4 py-2 font-semibold rounded-lg text-sm md:text-base bg-[#533939] text-[#FA7575]">
            Retract Investment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
