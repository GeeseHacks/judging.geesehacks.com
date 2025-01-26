"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectBrowserHeader from "@/components/ProjectBrowserHeader";
import { useSession } from "next-auth/react";

interface Project {
  id: number;
  name: string;
  description: string;
  value: string;
  invested: string;
  icon: string;
}

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

const ProjectBrowser = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (status === "loading") return; // Wait until session is loaded
      if (!session?.user?.id) {
        setError("Unauthorized: Please log in.");
        return;
      }

      try {
        const judgeId = session.user.id; // Dynamically get judgeId from session
        const response = await fetch(`/api/allProjects?judgeId=${judgeId}`);
        if (!response.ok) {
          throw new Error(`Error fetching projects: ${response.status}`);
        }

        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch project data:", err);
        setError("Failed to load projects. Please try again later.");
      }
    };

    fetchProjects();
  }, [session, status]);

  const handleCardClick = (projectID: number) => {
    router.push(`project-browser/${projectID}`);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (

    
    <div className="relative flex flex-col h-full">
      <div className="absolute -top-24 -left-36 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-10 blur-3xl z-[-10]"></div>
      <div className="absolute -bottom-20 -right-12 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-10 blur-3xl z-[-10]"></div>
      <div className="px-7 lg:px-2 flex-1 flex flex-col">
      <ProjectBrowserHeader currentTab="all" />

        {/* Project Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-5 mt-6 w-full mb-10">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project.id)}
              className="hover:cursor-pointer hover:bg-[#3e2b655f] bg-opacity-5 bg-gradient-to-r from-[#815CD1]/5 to-[#6F9297]/5 p-6 sm:p-8 md:p-10 rounded-lg shadow-lg relative flex flex-col w-full max-w-full h-full"
            >
              <h2 className="text-2xl font-semibold">{project.name}</h2>
              <p className="text-gray-300 mt-5 text-sm">{truncateText(project.description, 10)}</p>
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
