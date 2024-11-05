"use client";
import Hamburger from "@/components/nav/Hamburger";
import SideNav from "@/components/nav/SideNav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="h-screen w-screen flex overflow-y-scroll">
    {/* SideNav */}
    <div className="flex">
      <SideNav />
      <Hamburger />
    </div>

    <div className="flex flex-col p-8 md:p-12 lg:py-20 space-y-10 lg:px-12 xl:px-32 min-h-screen w-full">
      {children}
    </div>



    {/* Glow Effect */}
    <div className="fixed inset-0 -z-50">
      <div className="absolute top-60 left-60 m-20 w-1/2 h-1/2 bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 rounded-full blur-4xl opacity-25"></div>
      <div className="absolute bottom-60 right-60 m-20 w-1/2 h-1/2 bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 rounded-full blur-4xl opacity-20"></div>
    </div>

    <div className="absolute inset-0 -z-50">
      {[...Array(120)].map((_, i) => {
        const size = `${Math.random() + 1}px`;
        return (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-35"
            style={{
              width: size,
              height: size,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px 2px rgba(255, 255, 255, 0.1)`,
            }}
          ></div>
        );
      })}
    </div>
  </div>
}