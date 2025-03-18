import { FaUserPlus, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFollowedOrganizers } from "../features/slices/authSlice";

// Helper function to get the initials from the organizer's name
const getInitials = (name) => {
    const nameArray = name.split(" ");
    const initials = nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
    return initials;
};

const OrganizerFollowCard = ({ event }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [followed, setFollowed] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);

    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/auth/organizers/${event.organizer._id}/followers`, {
                withCredentials: true,
            })
            .then((response) => {
                setFollowersCount(response.data.followers);

                const isFollowing = response.data.followers.includes(user._id);
                setFollowed(isFollowing);
            })
            .catch((error) => {
                console.error("Error fetching followers count:", error);
            });
    }, [event.organizer._id, user._id, followed]);

    const handleFollowOrganizer = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        axios
            .post(
                "http://localhost:5000/api/auth/organizers/follow",
                {
                    userId: user._id,
                    organizerId: event.organizer._id,
                },
                {
                    withCredentials: true,
                }
            )
            .then((response) => {
                setFollowed(true);
                dispatch(setFollowedOrganizers(response.data));
                setFollowersCount((prevCount) => prevCount + 1);
                toast.success(`You're now following ${event.organizer.name}!`);
            })
            .catch((error) => {
                console.error("Error following organizer:", error);
                toast.error("Failed to follow organizer");
            });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3">
                <Link to={`/organizers/${event.organizer._id}`} className="hover:opacity-80 transition">
                    {/* If there's no avatar, show initials */}
                    {event.organizer.avatar ? (
                        <img
                            src={event.organizer.avatar}
                            alt={event.organizer.name}
                            className="w-16 h-16 sm:w-12 sm:h-12 rounded-full border border-gray-300"
                        />
                    ) : (
                        <div className="w-16 h-16 sm:w-12 sm:h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(event.organizer.name)}
                        </div>
                    )}
                </Link>
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-600 transition duration-300">
                        {event.organizer.name}
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">{followersCount} followers</p>
                </div>
            </div>

            {/* Follow Button or Following Text */}
            {!followed ? (
                <button
                    onClick={handleFollowOrganizer}
                    className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
                >
                    <FaUserPlus className="mr-2" />
                    Follow
                </button>
            ) : (
                <span className="flex items-center text-green-600 font-semibold w-full sm:w-auto">
                    <FaCheckCircle className="mr-2" />
                    Following
                </span>
            )}
        </div>
    );
};

export default OrganizerFollowCard;
