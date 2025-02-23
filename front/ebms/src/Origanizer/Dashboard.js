import React, { useState } from "react";
import {useNavigate} from "react-router-dom";
const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");
const navigate=useNavigate();
    const renderContent = () => {
        switch (activeTab) {
            case "events":
                // navigate('/myEvent')    
                return <div className="p-4">View and manage your events.</div>;
            break; 
 case "attendees":
                return <div className="p-4">View attendees for each event.</div>;
            case "tickets":
                return <div className="p-4">Manage ticketing for your events.</div>;
            case "reports":
                return <div className="p-4">View reports and analytics.</div>;
            case "settings":
                return <div className="p-4">Adjust your settings here.</div>;
            default:
                return <div className="p-4">Select a tab from the sidebar.</div>;
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/5 bg-gray-800 text-white">
                <div className="p-4 font-bold text-lg">EventPro</div>
                <ul className="space-y-4 mt-8">
                    <li
                        onClick={() => setActiveTab("events")}
                        className={`p-3 cursor-pointer ${activeTab === "events" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                    >
                        Events
                    </li>
                    <li
                        onClick={() => setActiveTab("attendees")}
                        className={`p-3 cursor-pointer ${activeTab === "attendees" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                    >
                        Attendees
                    </li>
                    <li
                        onClick={() => setActiveTab("tickets")}
                        className={`p-3 cursor-pointer ${activeTab === "tickets" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                    >
                        Tickets
                    </li>
                    <li
                        onClick={() => setActiveTab("reports")}
                        className={`p-3 cursor-pointer ${activeTab === "reports" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                    >
                        Reports
                    </li>
                    <li
                        onClick={() => setActiveTab("settings")}
                        className={`p-3 cursor-pointer ${activeTab === "settings" ? "bg-gray-700" : "hover:bg-gray-700"
                            }`}
                    >
                        Settings
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-gray-100">
                <div className="p-4 text-xl font-bold">Dashboard</div>
                <div>{renderContent()}</div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;
