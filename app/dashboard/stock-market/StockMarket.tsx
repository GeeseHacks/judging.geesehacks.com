"use client";

import React, { useState } from "react";
import Image from "next/image";

import LeaderBoard from "./LeaderBoard";
import MyInvestments from "./MyInvestments";

const categories = [
  { name: "General", component: <LeaderBoard /> },
  { name: "Category 1", component: <LeaderBoard /> },
  { name: "Category 2", component: <LeaderBoard /> },
  { name: "Category 3", component: <LeaderBoard /> },
  { name: "My Investments", component: <MyInvestments /> },
];

const StockMarket: React.FC = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="relative flex h-full overflow-hidden">
      <div className="absolute top-24 left-80 w-[500px] h-[500px] rounded-full bg-[#7D14D0] opacity-15 blur-3xl z-[-10]"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#119FCC] opacity-15 blur-3xl z-[-10]"></div>
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
        <div className="flex space-x-4 pb-8 text-lg font-semibold">
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
              {category.name}
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
