import React, { useState,useEffect } from "react";
import MyEventsPage from "./MyEvent"; // Import your MyEventsPage component
import Logout from "../auth/Logout";
import BookingDetail from "./BookingDetail"; // Import your BookingDetail component 
import Reports from "./Reports";
import OriganizerTicketPage from "./OrgTickets";
import OrganizerEventReviews from "./OriganizerReview";
import axios from "axios";
const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");


    const [myEvents, setMyEvents] = useState([]); // Store events here

    useEffect(() => {
        axios.get('http://localhost:5000/api/events/myEvent', { withCredentials: true })
            .then((response) => {
                const events = Array.isArray(response.data) ? response.data : [];
                setMyEvents(events);
            })
            .catch((error) => {
                console.error("Error fetching my events:", error);
                setMyEvents([]); // Ensure it doesn't stay undefined
            });
    }, []);



    // Render content based on active tab
    const renderContent = () => {
        switch (activeTab) {
            case "events":
                return <MyEventsPage />; // Display MyEventsPage when "events" tab is clicked
          
            case "tickets":
                return <OriganizerTicketPage/>; // Display OriganizerTicketPage when "tickets" tab is clicked
            case "booking":
                return <BookingDetail />; // Display BookingDetail when "booking" tab is clicked
            case "reports":
                return <Reports events={myEvents} />; // Display Reports when "reports" tab is clicked
            case "reviews":
                return <OrganizerEventReviews />; // Display OrganizerEventReviews when "reviews" tab is clicked
            case "settings":
                return <div className="p-4">Adjust your settings here.</div>;
            case "chatting":
                return <div className="p-4">Adjust your Chatting here.</div>;
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
                            onClick={() => setActiveTab("reviews")}
                            className={`p-3 cursor-pointer ${activeTab === "reviews" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Reviews
                        </li>


                        <li
                            onClick={() => setActiveTab("settings")}
                            className={`p-3 cursor-pointer ${activeTab === "settings" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Settings
                        </li>

                        <li
                            onClick={() => setActiveTab("chatting")}
                            className={`p-3 cursor-pointer ${activeTab === "chatting" ? "bg-gray-500" : "hover:bg-gray-500"}`}
                        >
                            Chattings
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
