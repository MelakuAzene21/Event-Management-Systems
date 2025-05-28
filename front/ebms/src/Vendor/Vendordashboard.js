import React from "react";
import { Outlet } from "react-router-dom";
import Top from "../components/Top";
import ChatWidget from "../components/ChatWidget";

const Vendordashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation - Includes Sidebar */}
      <div className="w-full  top-0">
        <Top />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 mt-20">
        <div className="w-full p-4 overflow-y-auto">
          <Outlet /> {/* Allows nested routes */}
        </div>
      </div>

      {/* Chat Widget - Stays at the bottom right corner */}
      <div className="fixed bottom-4 right-4">
        <ChatWidget />
      </div>
    </div>
  );
};

export default Vendordashboard;
