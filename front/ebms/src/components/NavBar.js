import {  useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/slices/authSlice'; 
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export default function Header() {
    const dispatch = useDispatch(); // Initialize useDispatch
    const [isMenuOpen, setisMenuOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef();
    const user = useSelector((state) => state.auth.user);
    const notifications = useSelector((state) => state.notifications.notifications);

    // const [notifications, setNotifications] = useState([]); // State for notifications

    //! Fetch events from the server -------------------------------------------------
    useEffect(() => {

        axios.get("http://localhost:5000/api/events/getEvent").then((response) => {
            setEvents(response.data);
        }).catch((error) => {
            console.error("Error fetching events:", error);
        });
    }, []);

    // //! Fetch notifications from the server
    // useEffect(() => {
    //     axios
    //         .get("http://localhost:5000/notifications")
    //         .then((response) => {
    //             setNotifications(response.data); // Assume response includes `isRead` property
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching notifications:", error);
    //         });
    // }, []);

    // //! Compute unread notification count
    // const unreadCount = notifications.filter((notification) => !notification.isRead).length;


    //! Search bar functionality----------------------------------------------------
    useEffect(() => {
        const handleDocumentClick = (event) => {
            // Check if the clicked element is the search input or its descendant
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setSearchQuery("");
            }
        };

        // Listen for click events on the entire document
        document.addEventListener("click", handleDocumentClick);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    //! Logout Function --------------------------------------------------------
    const handleLogout = async () => {
        try {
            // Call the API to log the user out with credentials
        await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });

            // Dispatch the logout action to update Redux state
            dispatch(logoutAction());
toast.success('Logout Successfully')
            console.log('User logged out successfully');
            // Optionally, redirect the user to the login page or homepage
            // e.g., navigate('/login');
        } catch (err) {
            console.error('Failed to log out:', err);
            toast.error('logout error',err)
        }
    };
    //! Search input ----------------------------------------------------------------
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div>
            <header className="fixed top-0 left-0 w-full flex py-2 px-6 sm:px-6 justify-between items-center bg-gray-300 z-50 shadow-md">

                <Link to={'/'} className="flex item-center ">
                    {/* <img src="/assets/events.jpg" alt="" className='w-30 h-10 font-bold' /> */}
                    <h2 className="text-slate-800 font-serif">EBMS</h2>
                </Link>
                <div className='flex bg-white rounded py-2.5 px-4 w-1/3 gap-4 items-center shadow-md shadow-gray-200'>

                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </button>
                    <div ref={searchInputRef}>
                        <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} className='text-sm text-black outline-none w-full ' />
                    </div>
                    {/* <div className='text-sm text-gray-300 font-semibold'>Search</div> */}
                </div>

                {searchQuery && (
                    <div className="p-2 w-144 z-10 absolute rounded left-[28.5%] top-14 md:w-[315px] md:left-[17%] md:top-16 lg:w-[540px] lg:left-[12%] lg:top-16 bg-white">
                        {/* Filter events based on the search query in title or category */}
                        {events
                            .filter((event) =>
                                event.title && event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||                               event.category && event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())


                            )
                            .map((event) => (
                                <div key={event._id} className="p-2">
                                    {/* Display event details */}
                                    {/* <Link to={"/events/" + event._id}> */}
                                    <Link to={`/events/${event._id}`}  >
                                        <div className="text-black text-lg w-full">{event.title}</div>
                                    </Link>
                                </div>
                            ))}
                    </div>
                )}


                

                <div className='hidden lg:flex gap-5 text-sm'>
                    <Link to={'/wallet'}> {/*TODO:Route wallet page after creating it */}
                        <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 py-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                            </svg>
                            <div>Ticket</div>
                        </div >
                    </Link>


                   

                    <Link to={'/calendar'}> {/*TODO:Route calendar page after creating it */}
                        <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 py-1">
                                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
                            </svg>
                            <div>Calendar</div>
                        </div>
                    </Link>
                </div>


                <Link to={'/show-not'} className="relative">
                    <div className="flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
                            <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
                        </svg>

                        {/* Notification Badge */}
                        {notifications.filter(notif => !notif.isRead).length > 0 && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.filter(notif => !notif.isRead).length}
                            </span>
                        )}
                    </div>
                </Link>

                <Link to={'/booked'}>
                    <div>
                        <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v4.5a1.5 1.5 0 01-1.5 1.5 1.5 1.5 0 011.5 1.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-6.5A1.5 1.5 0 014.5 11 1.5 1.5 0 013 9.5V5zm4 2a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>

                            Booked
                        </div>
                    </div>
                </Link>

                <Link to={'/bookmarked'}>
                    <div>
                        <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
                                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h14a2 2 0 012 2v4.5a1.5 1.5 0 01-1.5 1.5 1.5 1.5 0 011.5 1.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2v-6.5A1.5 1.5 0 014.5 11 1.5 1.5 0 013 9.5V5zm4 2a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>

                            Bookmarked
                        </div>
                    </div>
                </Link>
                <div className="relative">
                   
                    {/* <Link to="/show-not" className="text-gray-700 hover:text-black">
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

                    </Link> */}

                    {/* {unreadCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )} */}
                </div>

                {/* -------------------IF user is Logged DO this Main-------------------- */}
                {!!user && (

                    <div className="flex flex-row items-center gap-2 sm:gap-8 ">
                        <div className="flex items-center gap-2">
                            <Link to={'/useraccount'}>  {/*TODO: Route user profile page after creating it -> 1.50*/}
                                {user.name.toUpperCase()}

                            </Link>

                            <BsFillCaretDownFill className="h-5 w-5 cursor-pointer hover:rotate-180 transition-all" onClick={() => setisMenuOpen(!isMenuOpen)} />
                        </div>
                        <div className="hidden md:flex">
                            <button onClick={handleLogout} className="secondary">
                                <div>Log out</div>
                                <RxExit />
                            </button>
                        </div>
                    </div>
                )}

                {/* -------------------IF user is not Logged in DO this MAIN AND MOBILE-------------------- */}
                {!user && (
                    <div>


                        <Link to={'/login'} className=" ">
                            <button className="primary">
                                <div>log in  </div>
                            </button>
                        </Link>
                    </div>
                )}

                {/* -------------------IF user is Logged DO this Mobile -------------------- */}
                {!!user && (
                    //w-auto flex flex-col absolute bg-white pl-2 pr-6 py-5 gap-4 rounded-xl
                    <div className="absolute z-10 mt-64 flex flex-col w-48 bg-white right-2 md:right-[160px] rounded-lg shadow-lg">
                        {/* TODO: */}
                        <nav className={`block ${isMenuOpen ? 'block' : 'hidden'} `}>
                            <div className="flex flex-col font-semibold text-[16px]">
                               
                                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/wallet'}>
                                    <div>Ticket</div>
                                </Link>
                            
                                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/calendar'}>
                                    <div>Calendar</div>
                                </Link>

                                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pb-3 pr-8 rounded-lg" onClick={handleLogout}>
                                    Log out
                                </Link>
                            </div>
                        </nav>
                    </div>
                )}

            </header>

        </div>
    )
}