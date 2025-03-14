import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../features/slices/authSlice';
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { useSelector } from "react-redux";
import { useState } from 'react';
import { toast } from 'react-toastify';
export default function Logout() {
    const dispatch = useDispatch(); // Initialize useDispatch
       const [isMenuOpen, setisMenuOpen] = useState(false);
   
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate()
    
    const notifications = useSelector((state) => state.notifications.notifications);


   
    //! Logout Function --------------------------------------------------------
    const handleLogout = async () => {
        try {
            // Call the API to log the user out with credentials
            await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });

            // Dispatch the logout action to update Redux state
            dispatch(logoutAction());
            toast.success(' logged out successfully');
            // Optionally, redirect the user to the login page or homepage
             navigate('/login');
        } catch (err) {
            console.error('Failed to log out:', err);
        }
    };
    
    return (
        <div>
            <header className="  top-0 right-0 w-full flex py-2 px-6 sm:px-6 justify-end gap-4 items-center pt-4 mt-0">
               

                


                {/* Notifications Icon with Badge */}
                <div className="relative">
                    <Link to="/show-not" className="text-gray-700 hover:text-black">
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
                    </Link>
                    {notifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {notifications.length}
                        </span>
                    )}
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

                

                
                {/* -------------------IF user is Logged DO this Main-------------------- */}
                

                

                {/* -------------------IF user is Logged DO this Mobile -------------------- */}
                {!!user && (
                    //w-auto flex flex-col absolute bg-white pl-2 pr-6 py-5 gap-4 rounded-xl
                    <div className="absolute z-10 mt-64 flex flex-col w-48 bg-white right-2 md:right-[160px] rounded-lg shadow-lg">
                        {/* TODO: */}
                        <nav className={`block ${isMenuOpen ? 'block' : 'hidden'} `}>
                            <div className="flex flex-col font-semibold text-[16px]">
                                <Link className="flex hover:bg-background hover:shadow py-2 pt-3 pl-6 pr-8 rounded-lg" to={'/create-event'} >
                                    Create Event
                                </Link>

                                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/wallet'}>
                                    <div>Ticket</div>
                                </Link>

                                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/myEvent'}>
                                    <div>My Event</div>
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