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
import DashboardOverview from "./DashBoardOverView";
import ChatInterface from '../components/ChatInterface';
import { useSearchParams } from "react-router-dom";


const OrganizerDashboard = () => {
    const [searchParams] = useSearchParams();
       const tabFromQuery = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(tabFromQuery || "Dashboard");
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
            toast.error("Failed to log out");
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case "createEvent": return <CreateEvent />;
            case "Dashboard": return <DashboardOverview />;
            case "events": return <MyEventsPage />;
            case "tickets": return <OriganizerTicketPage />;
            case "booking": return <BookingDetail />;
            case "reports": return <Reports events={myEvents} />;
            case "notifications": return <NotificationsPage />;
            case "reviews": return <OrganizerEventReviews />;
            
            case "vendors": return <GetAllVendor />;
            case "profile": return <UserProfile />;
            
            case "chatting": return <div className="p-6 text-gray-700"><ChatInterface /></div>;
            default: return <div className="p-6 text-gray-700">Select a tab from the sidebar.</div>;
        }
    };
    const tabs = [
        {
            tab: "Dashboard",
            icon: "M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z",
            color: "#6366f1", // Indigo
            ariaLabel: "View your dashboard overview",
        },
        {
            tab: "events",
            icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            color: "#2dd4bf", // Teal
            ariaLabel: "Manage your events",
        },
        {
            tab: "tickets",
            icon: "M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z",
            color: "#f59e0b", // Amber
            ariaLabel: "View and manage tickets",
        },
        {
            tab: "booking",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            color: "#8b5cf6", // Purple
            ariaLabel: "Manage bookings",
        },
        {
            tab: "reports",
            icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
            color: "#3b82f6", // Blue
            ariaLabel: "View reports and analytics",
        },
        {
            tab: "notifications",
            icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11.5a6.5 6.5 0 10-13 0v2.657c0 .597-.237 1.167-.656 1.586L3 17h5m7 0a3.001 3.001 0 01-6 0m6 0H9",
            color: "#ef4444", // Red
            ariaLabel: "View notifications",
        },
        {
            tab: "reviews",
            icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.519-4.674z",
            color: "#eab308", // Yellow
            ariaLabel: "View event reviews",
        },
        {
            tab: "chatting",
            icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.03 9 8z",
            color: "#10b981", // Green
            ariaLabel: "Access chat and messaging",
        },
        {
            tab: "vendors",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            color: "#f97316", // Orange
            ariaLabel: "Manage vendors",
        },
    ];

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 z-50 w-full bg-white shadow-sm flex justify-between items-center px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v18M19 3v18M12 3v18M3 12h18" />
                    </svg>
                    <span className="text-xl font-bold text-indigo-900">EventPro</span>
                </div>
                {user && (
                    <div className="flex items-center gap-4 sm:gap-6">
                        <button
                            onClick={() => {
                                setActiveTab("createEvent");
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
                            title="Create Event"
                        >
                            <FaPlus className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm font-medium">Create Event</span>
                        </button>

                        <button
                            onClick={() => {
                                setActiveTab("vendors");
                                setIsMenuOpen(false);
                            }}
                            className="text-gray-600 hover:text-indigo-900 transition-colors"
                            title="Vendors"
                        >
                            <FaUsers className="w-6 h-6" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => {
                                    setActiveTab("notifications");
                                    setIsMenuOpen(false);
                                }}
                                className="text-gray-600 hover:text-indigo-900 transition-colors"
                                title="Notifications"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
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
                                className="text-gray-600 hover:text-indigo-900 transition-colors"
                                title="Profile"
                            >
                                <RxPerson className="w-6 h-6" />
                            </button>
                            <button
                                className="text-gray-600 hover:text-indigo-900 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                title="Menu"
                            >
                                <BsFillCaretDownFill className="w-4 h-4" />
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg py-2 z-20">
                                    <button
                                        onClick={() => {
                                            setActiveTab("profile");
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2 text-sm"
                                    >
                                        <RxPerson className="w-5 h-5" /> Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 flex items-center gap-2 text-sm"
                                    >
                                        <RxExit className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Sidebar */}
            <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-50 border-r border-gray-200 shadow-sm overflow-y-auto">
                <ul className="space-y-1 px-4 py-6">
                    {tabs.map(({ tab, icon, color, ariaLabel }) => (
                        <li
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            role="button"
                            aria-label={ariaLabel}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${activeTab === tab
                                    ? "bg-gradient-to-r from-indigo-100 to-indigo-50 text-indigo-900 font-medium shadow-sm"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-indigo-900"
                                }`}
                        >
                            <svg className="w-6 h-6" fill={activeTab === tab ? color : "currentColor"} stroke="none" viewBox="0 0 24 24">
                                <path d={icon} />
                            </svg>
                            <span className="text-sm font-medium">
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 h-[calc(100vh-4rem)] overflow-y-auto bg-gray-50 pt-16">
                <div className="p-4 sm:p-6 max-w-7xl mx-auto">
                    <Title title="Dashboard" />
                    <div className="w-full">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

export default OrganizerDashboard;