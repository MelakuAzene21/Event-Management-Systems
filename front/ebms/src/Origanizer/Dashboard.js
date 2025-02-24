import React, { useState } from "react";
import MyEventsPage from "./MyEvent"; // Import your MyEventsPage component
import Logout from "../auth/Logout";

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");

    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "events":
                return <MyEventsPage />; // Display MyEventsPage when "events" tab is clicked
            case "attendees":
                return <div className="p-4">View attendees for each event.</div>;
            case "tickets":
                return <div className="p-4">Manage ticketing for your events.</div>;
            case "booking":
                return <div className="p-4">Manage booking for your events.</div>;
            case "reports":
                return <div className="p-4">View reports and analytics.</div>;
            case "settings":
                return <div className="p-4">Adjust your settings here.</div>;
            default:
                return <div className="p-4">Select a tab from the sidebar.</div>;
        }
    };

    return (
        <div className="flex flex-col h-screen ">
            {/* Header (Logout Component) */}
            <div className="w-full bg-gray-300  shadow-md px-6 flex justify-end ">
                <Logout />
            </div>

            <div className="flex flex-1">
                {/* Sidebar */}
                <div className="w-1/6 bg-gray-400 text-black">
                    <div className="p-4 font-bold text-lg">EventPro</div>
                    <ul className="space-y-4 mt-8">
                        <li
                            onClick={() => setActiveTab("events")}
                            className={`p-3 cursor-pointer ${activeTab === "events" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Events
                        </li>
                        <li
                            onClick={() => setActiveTab("attendees")}
                            className={`p-3 cursor-pointer ${activeTab === "attendees" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Attendees
                        </li>
                        <li
                            onClick={() => setActiveTab("tickets")}
                            className={`p-3 cursor-pointer ${activeTab === "tickets" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Tickets
                        </li>
                        <li
                            onClick={() => setActiveTab("booking")}
                            className={`p-3 cursor-pointer ${activeTab === "booking" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Booking
                        </li>
                        <li
                            onClick={() => setActiveTab("reports")}
                            className={`p-3 cursor-pointer ${activeTab === "reports" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Reports
                        </li>
                        <li
                            onClick={() => setActiveTab("settings")}
                            className={`p-3 cursor-pointer ${activeTab === "settings" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Settings
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-gray-100 p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
