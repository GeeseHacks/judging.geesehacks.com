"use client"
import { FaAngleRight } from "react-icons/fa";


const Home: React.FC = () => {
  return (
    <>
      {/* Glow Effect (Currently extremely laggy performance on Safari due to "4xl" */}
      {/* <div className="absolute inset-0 -z-50">
        <div className="absolute top-48 left-48 m-20 w-1/4 h-1/4 bg-purple-700 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-48 right-48 m-20 w-1/4 h-1/4 bg-teal-700 rounded-full blur-3xl opacity-5"></div>
      </div> */}
      
      {/* Home Content */}
      <div>
        <h1 className="text-4xl mt-5 mb-2">Home</h1>
        <p className="text-gray-500">Welcome fellow Geese. Here's everything you'll need for the event!</p>
      </div>

      <div className="
          bg-gradient-to-r from-darkpurple to-darkteal 
          p-8 lg:p-12 rounded-xl w-full min-h-56 h-2/6 space-y-4 
          relative overflow-hidden 
          hover:scale-102 transition-transform duration-300 
          hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)]
          flex flex-col justify-center
        ">
        <img src="/static/images/status-notsubmitted.png" alt="Not Submitted" className="absolute right-0 -top-10 z-0" />
        <h2 className="font-light text-lg drop-shadow-[0_0px_5px_rgba(0,0,0,0.5)]">Application Status</h2>
        <h2 className="font-semibold text-4xl drop-shadow-[0_0px_10px_rgba(0,0,0,0.5)]">NOT SUBMITTED</h2>
        <button className="mt-2 bg-transparent py-2 flex items-center z-10">
          Apply
          <FaAngleRight size={22} className="ml-1" />
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-h-4/6 lg:min-h-48 mb-8">
        <div className="
            bg-gradient-to-r from-darkpurple to-darkteal 
            p-8 lg:p-12 rounded-xl
            relative overflow-hidden 
            hover:scale-102 transition-transform duration-300 
            hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)]
          ">
          <img src="/static/images/faq.png" alt="FAQ" className="absolute -right-8 bottom-0 z-0 scale-75" />
          <h2 className="text-[30px] font-semibold">FAQ</h2>
          <p className="text-white-500">Common Questions</p>
        </div>
        <div className="
            bg-gradient-to-r from-darkpurple to-darkteal 
            p-8 lg:p-12 rounded-xl
            relative overflow-hidden 
            hover:scale-102 transition-transform duration-800
            hover:drop-shadow-[0_0px_15px_rgba(48,133,159,0.5)]
          ">
          <img src="/static/images/CameraFrame.png" alt="QR Code" className="absolute right-4 z-0 scale-75 top-1/2 transform -translate-y-1/2" />
          <h2 className="text-[30px] font-semibold">QR Code</h2>
          <p className="text-white-500">Your ID at Geesehacks</p>
        </div>
      </div>
    </>
  );
};

export default Home;