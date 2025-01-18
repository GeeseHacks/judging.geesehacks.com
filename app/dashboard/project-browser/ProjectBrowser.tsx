'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";    
import { useEffect, useState } from 'react';

interface Project {
  id: number,
  name: string;
  description: string;
  value: string;
  invested: string;
  icon: string;
}

const ProjectBrowser = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("All Projects");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const judgeId = 3;
        const response = await fetch(`/api/judgeProjects?judgeId=${judgeId}`);
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data)
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
      }
    };
  
    fetchProjects();
  }, []);

  // const projects = [
  //     {
  //         id: 1,
  //         name: "Project 1",
  //         description: "This is the project description honk honk honk honk",
  //         value: "$100,000,000",
  //         invested: "$100",
  //         icon: "/static/icons/geesehacks.png",
  //     },
  //     {
  //         id: 2,
  //         name: "Project 2",
  //         description: "Another project description honk honk honk honk",
  //         value: "$50,000,000",
  //         invested: "$500",
  //         icon: "/static/icons/geesehacks.png",
  //     },
  //     {
  //         id: 3,
  //         name: "Project 3",
  //         description: "Another project description honk honk honk honk",
  //         value: "$10",
  //         invested: "$0",
  //         icon: "/static/icons/geesehacks.png",
  //     },
  // ];

  const handleCardClick = (projectID: number) => {
      router.push(`project-browser/${projectID}`);
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="absolute -top-24 -left-36 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-10 blur-3xl z-[-10]"></div>
      <div className="absolute -bottom-20 -right-12 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-10 blur-3xl z-[-10]"></div>
      <div className="px-7 lg:px-2 flex-1 flex flex-col">
        <div className="flex items-center space-x-4">
          <Image
            src="/static/icons/stock-market-title.png"
            alt="Stock Market Title Image"
            width={35}
            height={35}
          />
          <h1 className="text-3xl md:text-4xl font-semibold">Project Browser</h1>
        </div>
        <p className="pb-2 text-md md:text-lg pt-3 text-gray-500">
          Some description here
        </p>

        {/* Tabs */}
        <div className="flex space-x-4 pt-5 text-lg font-semibold">
          <button
            key="All Projects"
            onClick={() => setActiveTab("All Projects")}
            className={`${
              activeTab === "All Projects"
                ? "text-[#D175FA] bg-[#3E2B65]"
                : "text-white"
            } px-4 py-2 rounded-lg`}
          >
            All Projects
          </button>
          <button
            key="My Investments"
            onClick={() => setActiveTab("My Investments")}
            className={`${
              activeTab === "My Investments"
                ? "text-[#D175FA] bg-[#3E2B65]"
                : "text-white"
            } px-4 py-2 rounded-lg`}
          >
            My Investments
          </button>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 mt-6 w-full">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              className="bg-opacity-5 bg-gradient-to-r from-[#815CD1]/5 to-[#6F9297]/5 p-6 sm:p-8 md:p-10 rounded-lg shadow-lg relative flex flex-col w-full max-w-full"
            >
              {/* <div className="absolute top-1 right-4 m-5 w-10 h-10">
                <Image
                  src={project.icon}
                  alt={`${project.name} Icon`}
                  width={40}
                  height={40}
                />
              </div> */}
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <p className="text-gray-300 mt-10">{project.description}</p>
              <div className="flex justify-between items-center mt-5">
                <div className="font-semibold">
                  <span className="text-purple-400">Value</span> <br />
                  <span className="text-white">{project.value}</span>
                </div>
                <div className="font-semibold">
                  <span className="text-purple-400">You Invested</span> <br />
                  <span className="text-white">{project.invested}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectBrowser;
