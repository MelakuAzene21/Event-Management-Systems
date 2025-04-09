// import { useEffect, useRef, useState } from "react";
// import axios from 'axios';
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from 'react-redux';
// import { logout as logoutAction } from '../features/slices/authSlice';
// import { RxExit } from 'react-icons/rx';
// import { BsBell, BsCalendar, BsClock, BsFillCaretDownFill, BsPerson, BsTicket, BsBookmark, BsPersonCircle } from 'react-icons/bs';
// import { IoLogInOutline } from 'react-icons/io5';
// import { toast } from "react-toastify";

// export default function Header() {
//     const dispatch = useDispatch();
//     const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//     const [events, setEvents] = useState([]);
//     const [searchQuery, setSearchQuery] = useState("");
//     const searchInputRef = useRef();
//     const user = useSelector((state) => state.auth.user);
//     const notifications = useSelector((state) => state.notifications.notifications);

//     useEffect(() => {
//         axios.get("http://localhost:5000/api/events/getEvent")
//             .then((response) => {
//                 setEvents(response.data);
//             })
//             .catch((error) => {
//                 console.error("Error fetching events:", error);
//             });
//     }, []);

//     useEffect(() => {
//         const handleDocumentClick = (event) => {
//             if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
//                 setSearchQuery("");
//             }
//         };
//         document.addEventListener("click", handleDocumentClick);
//         return () => {
//             document.removeEventListener("click", handleDocumentClick);
//         };
//     }, []);

//     const handleLogout = async () => {
//         try {
//             await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
//             dispatch(logoutAction());
//             toast.success('Logout Successfully');
//             setIsProfileMenuOpen(false);
//             setIsMobileMenuOpen(false);
//         } catch (err) {
//             console.error('Failed to log out:', err);
//             toast.error('Logout error', err);
//         }
//     };

//     const handleSearchInputChange = (event) => {
//         setSearchQuery(event.target.value);
//     };

//     return (
//         <div>
//             <header className="fixed top-0 left-0 w-full flex py-1 px-4 sm:px-6 justify-between items-center bg-gray-100 z-50 shadow-md">
//                 {/* Logo */}
//                 <Link to={'/'} className="flex items-center">
//                     <h2 className="text-gray-800 font-serif text-2xl font-bold tracking-tight">EBMS</h2>
//                 </Link>

//                 {/* Search Bar */}
//                 <div className='flex bg-white rounded-lg py-2 px-4 w-1/3 gap-3 items-center shadow-sm border border-gray-200'>
//                     <button>
//                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
//                         </svg>
//                     </button>
//                     <div ref={searchInputRef}>
//                         <input
//                             type="text"
//                             placeholder="Search events..."
//                             value={searchQuery}
//                             onChange={handleSearchInputChange}
//                             className='text-sm text-gray-800 outline-none w-full placeholder-gray-400'
//                         />
//                     </div>
//                 </div>

//                 {/* Search Results */}
//                 {searchQuery && (
//                     <div className="p-3 w-144 z-10 absolute rounded-lg left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-white shadow-lg border border-gray-200">
//                         {events
//                             .filter((event) =>
//                                 (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
//                                 (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
//                                 (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
//                                 (event.location.name && event.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
//                             )
//                             .map((event) => (
//                                 <div key={event._id} className="p-2 hover:bg-gray-50 rounded-lg transition">
//                                     <Link to={`/events/${event._id}`}>
//                                         <div className="text-gray-800 text-base font-medium">{event.title}</div>
//                                     </Link>
//                                 </div>
//                             ))}
//                     </div>
//                 )}

//                 {/* Desktop Menu (Visible on lg and above) */}
//                 <div className='hidden lg:flex gap-4 text-sm items-center'>
//                     <Link to={'/wallet'}>
//                         <div className='flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all'>
//                             <BsTicket className="h-6 w-6 mb-1" />
//                             <div className="text-sm font-medium">Ticket</div>
//                         </div>
//                     </Link>

//                     <Link to={'/calendar'}>
//                         <div className='flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all'>
//                             <BsCalendar className="h-6 w-6 mb-1" />
//                             <div className="text-sm font-medium">Calendar</div>
//                         </div>
//                     </Link>

//                     <Link to={'/show-not'} className="relative">
//                         <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
//                             <BsBell className="h-6 w-6 mb-1" />
//                             {notifications.filter(notif => !notif.isRead).length > 0 && (
//                                 <span className="absolute top-0 right-2 -mt-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                                     {notifications.filter(notif => !notif.isRead).length}
//                                 </span>
//                             )}
//                             <div className="text-sm font-medium">Notification</div>
//                         </div>
//                     </Link>

//                     <Link to={'/booked'}>
//                         <div className='flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all'>
//                             <BsClock className="h-6 w-6 mb-1" />
//                             <div className="text-sm font-medium">Booked</div>
//                         </div>
//                     </Link>

//                     <Link to={'/bookmarked'}>
//                         <div className='flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all'>
//                             <BsBookmark className="h-6 w-6 mb-1" />
//                             <div className="text-sm font-medium">Bookmarked</div>
//                         </div>
//                     </Link>
//                 </div>

//                 {/* User Section */}
//                 <div className="relative flex items-center gap-2">
//                     {user ? (
//                         <>
//                             {/* User Icon and Chevron */}
//                             <div className="flex items-center gap-2">
//                                 <div
//                                     className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all"
//                                     onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                                 >
//                                     <BsPerson className="text-blue-600 w-6 h-6" />
//                                 </div>
//                                 <BsFillCaretDownFill
//                                     className={`h-5 w-5 text-gray-600 transition-transform duration-200 ease-in-out lg:hidden ${isMobileMenuOpen ? 'rotate-180' : ''}`}
//                                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                                 />
//                             </div>

//                             {/* Profile Dropdown (Profile/Logout) */}
//                             {isProfileMenuOpen && (
//                                 <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
//                                     <Link
//                                         to="/useraccount"
//                                         className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
//                                         onClick={() => setIsProfileMenuOpen(false)}
//                                     >
//                                         <BsPersonCircle className="h-5 w-5 text-blue-600" />
//                                         <span className="text-sm font-medium">Profile</span>
//                                     </Link>
//                                     <button
//                                         onClick={handleLogout}
//                                         className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
//                                     >
//                                         <RxExit className="h-5 w-5 text-red-500" />
//                                         <span className="text-sm font-medium">Logout</span>
//                                     </button>
//                                 </div>
//                             )}

//                             {/* Mobile Menu (Visible on smaller screens) */}
//                             {isMobileMenuOpen && (
//                                 <div className="absolute right-0 top-12 w-56 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50 lg:hidden">
//                                     <nav className="flex flex-col text-[15px]">
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/wallet'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsTicket className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Ticket</span>
//                                         </Link>
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/calendar'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsCalendar className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Calendar</span>
//                                         </Link>
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/show-not'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsBell className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Notification</span>
//                                             {notifications.filter(notif => !notif.isRead).length > 0 && (
//                                                 <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                                                     {notifications.filter(notif => !notif.isRead).length}
//                                                 </span>
//                                             )}
//                                         </Link>
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/booked'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsClock className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Booked</span>
//                                         </Link>
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/bookmarked'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsBookmark className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Bookmarked</span>
//                                         </Link>
//                                         <Link
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
//                                             to={'/useraccount'}
//                                             onClick={() => setIsMobileMenuOpen(false)}
//                                         >
//                                             <BsPersonCircle className="h-5 w-5 text-blue-600" />
//                                             <span className="text-gray-700 font-medium">Profile</span>
//                                         </Link>
//                                         <button
//                                             className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg w-full text-left"
//                                             onClick={handleLogout}
//                                         >
//                                             <RxExit className="h-5 w-5 text-red-500" />
//                                             <span className="text-gray-700 font-medium">Logout</span>
//                                         </button>
//                                     </nav>
//                                 </div>
//                             )}
//                         </>
//                     ) : (
//                         <Link to={'/login'}>
//                             <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
//                                 <IoLogInOutline className="h-5 w-5" />
//                                 <span className="text-sm font-medium">Log in</span>
//                             </button>
//                         </Link>
//                     )}
//                 </div>
//             </header>
//         </div>
//     );
// }

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../features/slices/authSlice';
import { RxExit } from 'react-icons/rx';
import {
    BsBell,
    BsCalendar,
    BsClock,
    BsFillCaretDownFill,
    BsPerson,
    BsTicket,
    BsBookmark,
    BsPersonCircle,
} from 'react-icons/bs';
import { IoLogInOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';

export default function Header() {
    const dispatch = useDispatch();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef();
    const user = useSelector((state) => state.auth.user);
    const notifications = useSelector((state) => state.notifications.notifications);

    useEffect(() => {
        axios
            .get('http://localhost:5000/api/events/getEvent')
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error('Error fetching events:', error);
            });
    }, []);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setSearchQuery('');
            }
        };
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            dispatch(logoutAction());
            toast.success('Logout Successfully');
            setIsProfileMenuOpen(false);
            setIsMobileMenuOpen(false);
        } catch (err) {
            console.error('Failed to log out:', err);
            toast.error('Logout error', err);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div>
            <header className="fixed top-0 left-0 w-full flex py-1 px-4 sm:px-6 justify-between items-center bg-gray-100 z-50 shadow-md">
                {/* Logo */}
                <Link to={'/'} className="flex items-center">
                    <h2 className="text-gray-800 font-serif text-2xl font-bold tracking-tight">EBMS</h2>
                </Link>

                {/* Search Bar */}
                <div className="flex bg-white rounded-lg py-2 px-4 w-1/3 gap-3 items-center shadow-sm border border-gray-200">
                    <button>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-gray-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </button>
                    <div ref={searchInputRef}>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                            className="text-sm text-gray-800 outline-none w-full placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Search Results */}
                {searchQuery && (
                    <div className="p-3 w-144 z-10 absolute rounded-lg left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-white shadow-lg border border-gray-200">
                        {events
                            .filter(
                                (event) =>
                                    (event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    (event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                    (event.location.name && event.location.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map((event) => (
                                <div key={event._id} className="p-2 hover:bg-gray-50 rounded-lg transition">
                                    <Link to={`/events/${event._id}`}>
                                        <div className="text-gray-800 text-base font-medium">{event.title}</div>
                                    </Link>
                                </div>
                            ))}
                    </div>
                )}

                {/* Desktop Menu (Visible on lg and above) */}
                <div className="hidden lg:flex gap-4 text-sm items-center">
                    <Link to={'/wallet'}>
                        <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <BsTicket className="h-6 w-6 mb-1" />
                            <div className="text-sm font-medium">Ticket</div>
                        </div>
                    </Link>

                    <Link to={'/calendar'}>
                        <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <BsCalendar className="h-6 w-6 mb-1" />
                            <div className="text-sm font-medium">Calendar</div>
                        </div>
                    </Link>

                    <Link to={'/show-not'} className="relative">
                        <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <BsBell className="h-6 w-6 mb-1" />
                            {notifications.filter((notif) => !notif.isRead).length > 0 && (
                                <span className="absolute top-0 right-2 -mt-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.filter((notif) => !notif.isRead).length}
                                </span>
                            )}
                            <div className="text-sm font-medium">Notification</div>
                        </div>
                    </Link>

                    <Link to={'/booked'}>
                        <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <BsClock className="h-6 w-6 mb-1" />
                            <div className="text-sm font-medium">Booked</div>
                        </div>
                    </Link>

                    <Link to={'/bookmarked'}>
                        <div className="flex flex-col items-center py-2 px-3 rounded-lg cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all">
                            <BsBookmark className="h-6 w-6 mb-1" />
                            <div className="text-sm font-medium">Bookmarked</div>
                        </div>
                    </Link>
                </div>

                {/* User Section */}
                <div className="relative flex items-center gap-2">
                    {user ? (
                        <>
                            {/* User Icon and Chevron */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md hover:border-gray-300"
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <BsPerson
                                            className="text-blue-600 w-6 h-6 transition-transform duration-200 hover:scale-110"
                                        />
                                    )}
                                    {/* Optional: Online status dot */}
                                    {user.isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>

                                <BsFillCaretDownFill
                                    className={`h-5 w-5 text-gray-600 cursor-pointer transition-all duration-200 ease-in-out lg:hidden ${isMobileMenuOpen ? 'rotate-180 text-blue-600' : ''
                                        }`}
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                />
                            </div>

                            {/* Profile Dropdown (Profile/Logout) */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 top-12 w-48 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
                                    <Link
                                        to="/useraccount"
                                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                        onClick={() => setIsProfileMenuOpen(false)}
                                    >
                                        <BsPersonCircle className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-medium">Profile</span>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        <RxExit className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                </div>
                            )}

                            {/* Mobile Menu (Visible on smaller screens) */}
                            {isMobileMenuOpen && (
                                <div className="absolute right-0 top-12 w-56 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50 lg:hidden">
                                    <nav className="flex flex-col text-[15px]">
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/wallet'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsTicket className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Ticket</span>
                                        </Link>
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/calendar'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsCalendar className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Calendar</span>
                                        </Link>
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/show-not'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsBell className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Notification</span>
                                            {notifications.filter((notif) => !notif.isRead).length > 0 && (
                                                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                    {notifications.filter((notif) => !notif.isRead).length}
                                                </span>
                                            )}
                                        </Link>
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/booked'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsClock className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Booked</span>
                                        </Link>
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/bookmarked'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsBookmark className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Bookmarked</span>
                                        </Link>
                                        <Link
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg"
                                            to={'/useraccount'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <BsPersonCircle className="h-5 w-5 text-blue-600" />
                                            <span className="text-gray-700 font-medium">Profile</span>
                                        </Link>
                                        <button
                                            className="flex items-center gap-3 hover:bg-gray-100 py-3 pl-6 pr-8 rounded-lg w-full text-left"
                                            onClick={handleLogout}
                                        >
                                            <RxExit className="h-5 w-5 text-red-500" />
                                            <span className="text-gray-700 font-medium">Logout</span>
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link to={'/login'}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                                <IoLogInOutline className="h-5 w-5" />
                                <span className="text-sm font-medium">Log in</span>
                            </button>
                        </Link>
                    )}
                </div>
            </header>
        </div>
    );
}