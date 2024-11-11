import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
//import { signOutAction } from "@/utils/signOutAction";
import { Button } from "@/components/ui/button";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Add icon library
import { sideNavLinks, SideNavProps } from "./SideNav";


const Hamburger: React.FC<SideNavProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the menu is open

  const shouldShowStockMarketLink = () => {
    const now = new Date();
    const targetDate = new Date(2024, 8, 2, 16, 20, 0); // Modify with the exact time and date
    return now >= targetDate;
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger Button for Mobile View */}
      <div className="lg:hidden fixed top-8 right-4 z-50">
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
        </button>
      </div>

      {/* Side Navigation */}
      <nav
        className={`bg-gray-950 bg-opacity-95 h-screen w-screen xl:w-96 overflow-y-auto fixed z-40 top-0 transition-transform transform pb-8 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:relative lg:block ${className}`}
      >
        <div className="flex flex-col items-center justify-center px-20 xl:px-32 py-2 h-full space-y-4 w-full">
          {/* Nav Logo */}
          <div className="flex items-center space-x-3 h-1/5">
            <Image
              src="/static/icons/geesehacks.png"
              height={38}
              width={38}
              alt="Geese Logo"
            />
            <div className="text-3xl font-semibold">GeeseHacks</div>
          </div>

          {/* Nav Content */}
          <div className="flex flex-col grow w-full font-light space-y-10 text-lg">
            {sideNavLinks.map((link) => (
              <Link
                className="flex space-x-8 hover:opacity-35"
                key={link.name}
                href={link.href}
              >
                <Image
                  src={link.icon}
                  height={0}
                  width={0}
                  sizes="100vw"
                  alt={link.name}
                  style={{ height: 24, width: "auto" }}
                />
                <h2>{link.name}</h2>
              </Link>
            ))}

            {/* Conditionally render the Stock Market link */}
            {shouldShowStockMarketLink() && (
              <Link
                className="flex space-x-8 hover:opacity-35"
                key="Stock Market"
                href="/dashboard/stock-market"
              >
                <Image
                  src="/static/icons/stock-market.png"
                  height={0}
                  width={0}
                  sizes="100vw"
                  alt="Stock Market"
                  style={{ height: 24, width: "auto" }}
                />
                <h2>Stock Market</h2>
              </Link>
            )}
          </div>

          {/* Log Out Button */}
          {/* <div className="h-1/6 flex-shrink-0 flex flex-col justify-center">
            <form action={signOutAction}>
              <Button className="flex w-36 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-300 via-pink-500 to-red-400 p-3 text-sm font-medium text-white shadow-lg transition duration-200 ease-in-out hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-600 hover:to-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Sign Out
              </Button>
            </form>
          </div> */}
        </div>
      </nav>

      {/* Overlay for when menu is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default Hamburger;
