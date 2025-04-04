// import React, { useState,useEffect } from "react";
// import MyEventsPage from "./MyEvent"; // Import your MyEventsPage component
// import Logout from "../auth/Logout";
// import BookingDetail from "./BookingDetail"; // Import your BookingDetail component
// import Reports from "./Reports";
// import OriganizerTicketPage from "./OrgTickets";
// import OrganizerEventReviews from "./OriganizerReview";
// import axios from "axios";
// import Title from "../layout/Title";
// const OrganizerDashboard = () => {
//     const [activeTab, setActiveTab] = useState("events");


//     const [myEvents, setMyEvents] = useState([]); // Store events here

//     useEffect(() => {
//         axios.get('http://localhost:5000/api/events/myEvent', { withCredentials: true })
//             .then((response) => {
//                 const events = Array.isArray(response.data) ? response.data : [];
//                 setMyEvents(events);
//             })
//             .catch((error) => {
//                 console.error("Error fetching my events:", error);
//                 setMyEvents([]); // Ensure it doesn't stay undefined
//             });
//     }, []);



//     // Render content based on active tab
//     const renderContent = () => {
//         switch (activeTab) {
//             case "events":
//                 return <MyEventsPage />; // Display MyEventsPage when "events" tab is clicked
          
//             case "tickets":
//                 return <OriganizerTicketPage/>; // Display OriganizerTicketPage when "tickets" tab is clicked
//             case "booking":
//                 return <BookingDetail />; // Display BookingDetail when "booking" tab is clicked
//             case "reports":
//                 return <Reports events={myEvents} />; // Display Reports when "reports" tab is clicked
//             case "reviews":
//                 return <OrganizerEventReviews />; // Display OrganizerEventReviews when "reviews" tab is clicked
//             case "settings":
//                 return <div className="p-4">Adjust your settings here.</div>;
//             case "chatting":
//                 return <div className="p-4">Adjust your Chatting here.</div>;
//             default:
//                 return <div className="p-4">Select a tab from the sidebar.</div>;
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen ">
//             {/* Header (Logout Component) */}
//             <div className="w-full bg-gray-300  shadow-md px-6 flex justify-end ">
//                 <Logout />
//             </div>
// <Title title={"Dashboard"}/>
//             <div className="flex flex-1">
//                 {/* Sidebar */}
//                 <div className="w-1/6 bg-gray-400 text-black">
//                     <div className="p-4 font-bold text-lg">EventPro</div>
//                     <ul className="space-y-4 mt-8">
//                         <li
//                             onClick={() => setActiveTab("events")}
//                             className={`p-3 cursor-pointer ${activeTab === "events" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Events
//                         </li>
                      
//                         <li
//                             onClick={() => setActiveTab("tickets")}
//                             className={`p-3 cursor-pointer ${activeTab === "tickets" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Tickets
//                         </li>
//                         <li
//                             onClick={() => setActiveTab("booking")}
//                             className={`p-3 cursor-pointer ${activeTab === "booking" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Booking
//                         </li>
//                         <li
//                             onClick={() => setActiveTab("reports")}
//                             className={`p-3 cursor-pointer ${activeTab === "reports" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Reports
//                         </li>
//                         <li
//                             onClick={() => setActiveTab("reviews")}
//                             className={`p-3 cursor-pointer ${activeTab === "reviews" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Reviews
//                         </li>


//                         <li
//                             onClick={() => setActiveTab("settings")}
//                             className={`p-3 cursor-pointer ${activeTab === "settings" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Settings
//                         </li>

//                         <li
//                             onClick={() => setActiveTab("chatting")}
//                             className={`p-3 cursor-pointer ${activeTab === "chatting" ? "bg-gray-500" : "hover:bg-gray-500"}`}
//                         >
//                             Chattings
//                         </li>
//                     </ul>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1 bg-gray-100 p-4">
//                     {renderContent()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrganizerDashboard;

import React, { useState, useEffect } from "react";
import MyEventsPage from "./MyEvent";
import Logout from "../auth/Logout";
import BookingDetail from "./BookingDetail";
import Reports from "./Reports";
import OriganizerTicketPage from "./OrgTickets";
import OrganizerEventReviews from "./OriganizerReview";
import axios from "axios";
import Title from "../layout/Title";

const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");
    const [myEvents, setMyEvents] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/events/myEvent', { withCredentials: true })
            .then((response) => {
                const events = Array.isArray(response.data) ? response.data : [];
                setMyEvents(events);
            })
            .catch((error) => {
                console.error("Error fetching my events:", error);
                setMyEvents([]);
            });
    }, []);

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