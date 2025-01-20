"use client";

import React, { useState } from "react";
import SideNav from "../../../../components/nav/SideNav";
import Image from "next/image";

import LeaderBoard from "./LeaderBoard";
import StockGraph from "./StockGraph";
import MyInvestments from "./MyInvestments";

const chartData = [
  { time: "11:00 AM", value: 186 },
  { time: "11:15 AM", value: 305 },
  { time: "11:30 AM", value: 305 },
  { time: "11:45 AM", value: 305 },
  { time: "12:00 PM", value: 237 },
  { time: "12:15 PM", value: 237 },
  { time: "12:30 PM", value: 73 },
  { time: "12:45 PM", value: 237 },
  { time: "1:00 PM", value: 209 },
  { time: "1:15 PM", value: 209 },
  { time: "1:30 PM", value: 214 },
];

const categories = [
  { name: "General", component: <LeaderBoard category={"General"}/> },
  { name: "Sun Life", component: <LeaderBoard category={"Sun Life"}/> },
  { name: "TeejLab", component: <LeaderBoard category={"TeejLab"}/> },
  { name: "CS-CAN", component: <LeaderBoard category={"CS-CAN"}/> },
  { name: "My Investments", component: <MyInvestments /> },
];

const StockMarket: React.FC = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="relative flex flex-col h-full">
      <div className="absolute -top-24 -left-36 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-10 blur-3xl z-[-10]"></div>
      <div className="absolute -bottom-20 -right-10 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-10 blur-3xl z-[-10]"></div>
      <div className="px-7 lg:px-2 flex-1 flex flex-col">
        <div className="flex items-center space-x-4">
          <Image
            src="/static/icons/stock-market-title.png"
            alt="Stock Market Title Image"
            width={35}
            height={35}
          />
          <h1 className="text-3xl md:text-4xl font-semibold">Stock Market</h1>
        </div>
        <p className="pb-7 text-md md:text-lg pt-3 text-gray-500">
          Some description here
        </p>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pb-8">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveTab(category.name)}
              className={`${
                activeTab === category.name
                  ? "text-[#D175FA] bg-[#3E2B65]"
                  : "text-white"
              } px-4 py-2 rounded-lg`}
            >
              <span className="text-md md:text-lg font-semibold">{category.name}</span>
            </button>
          ))}
        </div>

        <div>
          {categories.map((category) =>
            activeTab === category.name ? (
              <div key={category.name}>{category.component}</div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default StockMarket;