"use client";

import Link from "next/link";
import { FaAngleRight } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface JudgeData {
  name: string;
}

const Home: React.FC = () => {
  const { data: session, status } = useSession();
  const [judgeData, setJudgeData] = useState<JudgeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJudgeData = async () => {
      try {
        const response = await fetch(`/api/judges/${session?.user?.id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJudgeData(data);
      } catch (err) {
        console.error("Failed to fetch judge data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    if (session?.user?.id) {
      fetchJudgeData();
    }
  }, [session?.user?.id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Unauthorized: Please log in</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!judgeData) {
    return <p>Loading judge data...</p>;
  }

  return (
    <>
      <div>
        <h1 className="text-4xl mt-5 mb-2">Welcome, Judge {judgeData.name}</h1>
        <p className="text-gray-500">
          Here&apos;s everything you&apos;ll need for the event!
        </p>
      </div>

      {/* Application Status */}
      <div className="bg-gradient-to-r from-darkpurple to-darkteal p-8 lg:p-12 rounded-xl w-full min-h-56 h-2/6 space-y-4 relative overflow-hidden hover:scale-102 transition-transform duration-300 hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)] flex flex-col justify-center">
        <Image
          src="/static/images/status-notsubmitted.png"
          alt="Not Submitted"
          layout="fill"
          objectFit="cover"
          className="absolute right-0 -top-10 z-0"
        />
        <h2 className="font-light text-lg drop-shadow-[0_0px_5px_rgba(0,0,0,0.5)]">
          Application Status
        </h2>
        <h2 className="font-semibold text-4xl drop-shadow-[0_0px_10px_rgba(0,0,0,0.5)]">
          NOT SUBMITTED
        </h2>
        <a
          href="/apply"
          className="mt-2 bg-transparent py-2 flex items-center z-10 cursor-pointer"
        >
          Apply
          <FaAngleRight size={22} className="ml-1" />
        </a>
      </div>

      {/* Links to Other Sections */}
      <div className="grid lg:grid-cols-2 gap-8 max-h-4/6 lg:min-h-48 mb-8">
        <Link
          href="https://geesehacks.com#faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="bg-gradient-to-r from-darkpurple to-darkteal p-8 lg:p-12 rounded-xl relative overflow-hidden hover:scale-102 transition-transform duration-300 hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)]">
            <Image
              src="/static/images/faq.png"
              alt="FAQ"
              layout="fill"
              objectFit="cover"
              className="absolute -right-8 bottom-0 z-0 scale-75"
            />
            <h2 className="text-[30px] font-semibold">FAQ</h2>
            <p className="text-white-500">Common Questions</p>
          </div>
        </Link>

        <Link href="/qr-code">
          <div className="bg-gradient-to-r from-darkpurple to-darkteal p-8 lg:p-12 rounded-xl relative overflow-hidden hover:scale-102 transition-transform duration-800 hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)]">
            <Image
              src="/static/images/CameraFrame.png"
              alt="QR Code"
              layout="fill"
              objectFit="cover"
              className="absolute right-4 z-0 scale-75 top-1/2 transform -translate-y-1/2"
            />
            <h2 className="text-[30px] font-semibold">QR Code</h2>
            <p className="text-white-500">Your ID at Geesehacks</p>
          </div>
        </Link>
      </div>
    </>
  );
};

export default Home;
