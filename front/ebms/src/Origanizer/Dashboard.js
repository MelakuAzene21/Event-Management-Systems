import React, { useState } from "react";
import MyEventsPage from "./MyEvent";
import Logout from "../auth/Logout";
import BookingDetail from "./BookingDetail";
import Reports from "./Reports";
import OriganizerTicketPage from "./OrgTickets";
import OrganizerEventReviews from "./OriganizerReview";
import Title from "../layout/Title";
import { useGetMyEventsQuery } from "../features/api/myEventApi";
const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

    const {
        data: myEvents = []
    } = useGetMyEventsQuery();

    const renderContent = () => {
        switch (activeTab) {
            case "events": return <MyEventsPage />;
            case "tickets": return <OriganizerTicketPage />;
            case "booking": return <BookingDetail />;
            case "reports": return <Reports events={myEvents} />;
            case "reviews": return <OrganizerEventReviews />;
            case "settings": return <div className="p-6 text-gray-700">Adjust your settings here.</div>;
            case "chatting": return <div className="p-6 text-gray-700">Adjust your chatting here.</div>;
            default: return <div className="p-6 text-gray-700">Select a tab from the sidebar.</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <Logout />

            {/* Main Layout */}
            <div className="flex flex-1 pt-16">
                {/* Sidebar - Fixed but Toggleable on Mobile */}
                <div
                    className={`fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                        }`}
                >
                    <div className="p-5 font-bold text-2xl border-b border-indigo-800">EventPro</div>
                    <ul className="space-y-3 mt-6 px-3">
                        {["events", "tickets", "booking", "reports", "reviews", "settings", "chatting"].map((tab) => (
                            <li
                                key={tab}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                                }}
                                className={`p-3 cursor-pointer rounded-lg transition-colors duration-200 ${activeTab === tab
                                        ? "bg-indigo-700 text-white"
                                        : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Mobile Sidebar Toggle (Hamburger Menu) */}
                <button
                    className="md:hidden fixed top-20 left-4 z-30 p-2 bg-indigo-900 text-white rounded-full shadow-lg"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>

                {/* Main Content - Covers Entire Right Side */}
                <div className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto overflow-x-hidden bg-gray-50">
                    <Title title="Dashboard" />
                    <div className="w-full">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;