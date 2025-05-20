// import React, { useState } from "react";
// import MyEventsPage from "./MyEvent";
// import BookingDetail from "./BookingDetail";
// import Reports from "./Reports";
// import OriganizerTicketPage from "./OrgTickets";
// import OrganizerEventReviews from "./OriganizerReview";
// import Title from "../layout/Title";
// import { useGetMyEventsQuery } from "../features/api/myEventApi";
// import GetAllVendor from '../Vendorpage/GetAllvendor';
// import NotificationsPage from '../pages/NotificationsPage';
// import UserProfile from '../UserPage/Getprofiles';

// const OrganizerDashboard = () => {
//     const [activeTab, setActiveTab] = useState("events");
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile sidebar toggle

//     const {
//         data: myEvents = []
//     } = useGetMyEventsQuery();

//     const renderContent = () => {
//         switch (activeTab) {
//             case "events": return <MyEventsPage />;
//             case "tickets": return <OriganizerTicketPage />;
//             case "booking": return <BookingDetail />;
//             case "reports": return <Reports events={myEvents} />;
//             case "notifications": return <NotificationsPage />
//             case "reviews": return <OrganizerEventReviews />;
//             case "settings": return <div className="p-6 text-gray-700">Adjust your settings here.</div>;
//             case "chatting": return <div className="p-6 text-gray-700">Adjust your chatting here.</div>;
//             case "vendors": return <GetAllVendor />
//             case "profile": return <UserProfile/>
//             case "users": return <div className="p-6 text-gray-700">Adjust your users here.</div>;


//             default: return <div className="p-6 text-gray-700">Select a tab from the sidebar.</div>;
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-gray-50">
           

//             {/* Main Layout */}
//             <div className="flex flex-1 pt-16">
//                 {/* Sidebar - Fixed but Toggleable on Mobile */}
//                 <div
//                     className={`fixed inset-y-0 left-0 w-64 bg-indigo-900 text-white z-20 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
//                         }`}
//                 >
//                     <div className="p-5 font-bold text-2xl border-b border-indigo-800">EventPro</div>
//                     <ul className="space-y-3 mt-6 px-3">
//                         {["events", "tickets", "booking", "reports", "notifications", "reviews", "settings", "chatting", "vendors","profile"].map((tab) => (
//                             <li
//                                 key={tab}
//                                 onClick={() => {
//                                     setActiveTab(tab);
//                                     setIsSidebarOpen(false); // Close sidebar on mobile after selection
//                                 }}
//                                 className={`p-3 cursor-pointer rounded-lg transition-colors duration-200 ${activeTab === tab
//                                         ? "bg-indigo-700 text-white"
//                                         : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
//                                     }`}
//                             >
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Mobile Sidebar Toggle (Hamburger Menu) */}
//                 <button
//                     className="md:hidden fixed top-20 left-4 z-30 p-2 bg-indigo-900 text-white rounded-full shadow-lg"
//                     onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                 >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
//                     </svg>
//                 </button>

//                 {/* Main Content - Covers Entire Right Side */}
//                 <div className="flex-1 ml-0 md:ml-64 p-6 overflow-y-auto overflow-x-hidden bg-gray-50">
//                     <Title title="Dashboard" />
//                     <div className="w-full">{renderContent()}</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrganizerDashboard;








// import React, { useState } from "react";
// import MyEventsPage from "./MyEvent";
// import BookingDetail from "./BookingDetail";
// import Reports from "./Reports";
// import OriganizerTicketPage from "./OrgTickets";
// import OrganizerEventReviews from "./OriganizerReview";
// import Title from "../layout/Title";
// import { useGetMyEventsQuery } from "../features/api/myEventApi";
// import GetAllVendor from "../Vendorpage/GetAllvendor";
// import NotificationsPage from "../pages/NotificationsPage";
// import UserProfile from "../UserPage/Getprofiles";
// import Logout from "../auth/Logout";

// const OrganizerDashboard = () => {
//     const [activeTab, setActiveTab] = useState("events");
//     const { data: myEvents = [] } = useGetMyEventsQuery();

//     const renderContent = () => {
//         switch (activeTab) {
//             case "events": return <MyEventsPage />;
//             case "tickets": return <OriganizerTicketPage />;
//             case "booking": return <BookingDetail />;
//             case "reports": return <Reports events={myEvents} />;
//             case "notifications": return <NotificationsPage />;
//             case "reviews": return <OrganizerEventReviews />;
//             case "settings": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your settings here.</div>;
//             case "chatting": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your chatting here.</div>;
//             case "vendors": return <GetAllVendor />;
//             case "profile": return <UserProfile />;
//             case "users": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your users here.</div>;
//             default: return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Select a tab from the sidebar.</div>;
//         }
//     };

//     return (
//         <div className="min-h-screen flex flex-col bg-white">
//             {/* Header */}
//             <Logout setActiveTab={setActiveTab} />

//             {/* Main Layout */}
//             <div className="flex flex-1 ">
//                 {/* Sidebar - Always Visible */}
//                 <div className="w-56 bg-white text-gray-800 border-r border-gray-200 shadow-sm">
                    
//                     <ul className="space-y-2  px-4">
//                         {[
//                             { tab: "events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
//                             { tab: "tickets", icon: "M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
//                             { tab: "booking", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
//                             { tab: "reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
//                             { tab: "notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.657c0 .597-.237 1.167-.656 1.586L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9" },
//                             { tab: "reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.519-4.674z" },
//                             { tab: "settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
//                             { tab: "chatting", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8z" },
//                             { tab: "vendors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
//                             { tab: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
//                             { tab: "users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }
//                         ].map(({ tab, icon }) => (
//                             <li
//                                 key={tab}
//                                 onClick={() => setActiveTab(tab)}
//                                 className={`p-3 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === tab ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
//                             >
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
//                                 </svg>
//                                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>

//                 {/* Main Content */}
//                 <div className="flex-1  overflow-y-auto bg-white">
//                     <Title title="Dashboard" />
//                     <div className="w-full max-w-7xl mx-auto">{renderContent()}</div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrganizerDashboard;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../features/slices/authSlice";
import { RxExit, RxPerson } from "react-icons/rx";
import { BsFillCaretDownFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { useLogoutMutation } from "../features/api/authApi";
import { FaPlus, FaUsers } from "react-icons/fa";
import MyEventsPage from "./MyEvent";
import BookingDetail from "./BookingDetail";
import Reports from "./Reports";
import OriganizerTicketPage from "./OrgTickets";
import OrganizerEventReviews from "./OriganizerReview";
import Title from "../layout/Title";
import { useGetMyEventsQuery } from "../features/api/myEventApi";
import GetAllVendor from "../Vendorpage/GetAllvendor";
import NotificationsPage from "../pages/NotificationsPage";
import UserProfile from "../UserPage/Getprofiles";
import CreateEvent from "./AddEvent";
const OrganizerDashboard = () => {
    const [activeTab, setActiveTab] = useState("events");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const notifications = useSelector((state) => state.notifications.notifications);
    const [logouting] = useLogoutMutation();
    const { data: myEvents = [] } = useGetMyEventsQuery();

    const handleLogout = async () => {
        try {
            await logouting().unwrap();
            dispatch(logoutAction());
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            console.error("Failed to log out:", err);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "createEvent": return <CreateEvent />;
            case "events": return <MyEventsPage />;
            case "tickets": return <OriganizerTicketPage />;
            case "booking": return <BookingDetail />;
            case "reports": return <Reports events={myEvents} />;
            case "notifications": return <NotificationsPage />;
            case "reviews": return <OrganizerEventReviews />;
            case "settings": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your settings here.</div>;
            case "chatting": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your chatting here.</div>;
            case "vendors": return <GetAllVendor />;
            case "profile": return <UserProfile />;
            case "users": return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Adjust your users here.</div>;
            default: return <div className="p-6 text-gray-600 bg-white rounded-lg shadow-sm">Select a tab from the sidebar.</div>;
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 z-50 w-full bg-white text-gray-800 shadow-sm flex justify-between items-center px-4 sm:px-6 py-4">
                <div className="text-xl font-bold flex items-center gap-3">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v18M19 3v18M12 3v18M3 12h18" />
                    </svg>
                    EventPro
                </div>

                {user && (
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab("createEvent");
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                                title="Create Event"
                            >
                                <FaPlus className="w-6 h-6" />
                                <span className="hidden sm:inline">Create Event</span>
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab("vendors");
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Vendors"
                            >
                                <FaUsers className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab("notifications");
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Notifications"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.657c0 .597-.237 1.167-.656 1.586L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9"
                                    />
                                </svg>
                            </button>
                            {notifications.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                    {notifications.length}
                                </span>
                            )}
                        </div>

                        <div className="relative flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setActiveTab("profile");
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                title="Profile"
                            >
                                <RxPerson className="w-6 h-6" />
                            </button>
                            <button
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                title="Menu"
                            >
                                <BsFillCaretDownFill className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-white shadow-md rounded-lg py-2 z-20 text-gray-700">
                                    <button
                                        onClick={() => {
                                            setActiveTab("profile");
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <RxPerson className="w-5 h-5" /> Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <RxExit className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Sidebar - Fixed with Independent Scroll */}
            <div className="fixed top-16 left-0 w-56 h-[calc(100vh-4rem)] bg-white text-gray-800 border-r border-gray-200 shadow-sm overflow-y-auto">
                <ul className="space-y-2 px-4 py-6">
                    {[
                        { tab: "events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
                        { tab: "tickets", icon: "M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" },
                        { tab: "booking", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
                        { tab: "reports", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                        { tab: "notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.657c0 .597-.237 1.167-.656 1.586L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9" },
                        { tab: "reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.519-4.674z" },
                        { tab: "settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
                        { tab: "chatting", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8z" },
                        { tab: "vendors", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
                        { tab: "profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                        { tab: "users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" }
                    ].map(({ tab, icon }) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`p-3 cursor-pointer rounded-lg transition-all duration-200 flex items-center gap-3 ${activeTab === tab ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                            </svg>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content - Independent Scroll */}
            <div className="ml-56 flex-1 h-[calc(100vh-4rem)] overflow-y-auto bg-white pt-16">
                <div className="p-6 max-w-7xl mx-auto">
                    <Title title="Dashboard" />
                    <div className="w-full">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;