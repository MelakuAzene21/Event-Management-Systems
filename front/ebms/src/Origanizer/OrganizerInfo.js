
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setFollowedOrganizers } from "../features/slices/authSlice";
import { useGetOrganizerFollowersQuery, useFollowOrganizerMutation } from "../features/api/authApi";

// Helper to get initials from name
const getInitials = (name) => {
    const nameArray = name.split(" ");
    return nameArray.map((word) => word.charAt(0).toUpperCase()).join("");
};

const OrganizerFollowCard = ({ event }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const organizerId = event.organizer._id;

    // Fetch followers using RTK Query
    const { data, isLoading, isError, error } = useGetOrganizerFollowersQuery(organizerId, {
        refetchOnMountOrArgChange: true,
    });

    // Debug data
    console.log("Followers data:", data);

    // Handle followers data
    const followers = Array.isArray(data?.followers) ? data.followers : [];
    const followersCount = followers?.length;

    // Check if user is following
    const isFollowing = user?._id && followers.includes(user._id);

    // Follow organizer mutation
    const [followOrganizer] = useFollowOrganizerMutation();

    const handleFollowOrganizer = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (isFollowing) {
            toast.info(`You are already following ${event.organizer.name}`);
            return;
        }

        try {
            const response = await followOrganizer({ userId: user._id, organizerId }).unwrap();
            dispatch(setFollowedOrganizers(response));
            toast.success(`You're now following ${event.organizer.name}!`);
        } catch (err) {
            console.error("Error following organizer:", err);
            toast.error("Failed to follow organizer");
        }
    };

    // Handle loading and error states
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        console.error("Error fetching followers:", error);
        return <div>Error loading followers: {error?.status || "Unknown error"}</div>;
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Organizer</h2>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to={`/organizers/${organizerId}`} className="hover:opacity-80 transition">
                        {event.organizer.avatar ? (
                            <img
                                src={event.organizer?.avatar}
                                alt={event.organizer.name}
                                className="w-12 h-12 rounded-full border border-gray-300"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                                {getInitials(event.organizer.name)}
                            </div>
                        )}
                    </Link>

                    <div>
                       
                        <h3 className="text-lg font-semibold text-gray-800">{event.organizer.name}</h3>
                        <p className="text-sm text-gray-500">
                            {event.organizer.organizationName ? event.organizer.organizationName : "Tech conferences organizing since 2010"}
                        </p>
                        <p className="text-gray-500 text-sm sm:text-base">
                            {followersCount} followers
                        </p>
                    </div>
                </div>

                {!isFollowing ? (
                    <button
                        onClick={handleFollowOrganizer}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 flex items-center"
                    >
                        Follow
                    </button>
                ) : (
                    <span className="flex items-center text-green-600 font-semibold">
                        <FaCheckCircle className="mr-2" />
                        Following
                    </span>
                )}
            </div>
        </div>
    );
};

export default OrganizerFollowCard;