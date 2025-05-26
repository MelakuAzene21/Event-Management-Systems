// import { useState } from "react";
// import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
// import { FaFacebook, FaTwitter,  FaWhatsapp, FaTelegram, FaShareAlt } from "react-icons/fa";

// const ShareEventModal = ({ event }) => {
//     const { title, _id } = event;

//     const eventUrl = `https://event-hub-vercel.vercel.app/events/${_id}`;

//     const [open, setOpen] = useState(false);

//     const socialLinks = {
//         facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
//         twitter: `https://twitter.com/intent/tweet?url=${eventUrl}&text=${title}`,
//         whatsapp: `https://api.whatsapp.com/send?text=${title}%20${eventUrl}`,
//         telegram: `https://t.me/share/url?url=${eventUrl}&text=${title}`,
//     };

//     return (
//         <>
//             {/* Share Icon instead of Button */}
//             <FaShareAlt
//                 size={22}
//                 className="text-gray-600 hover:text-gray-800 cursor-pointer"
//                 onClick={() => setOpen(true)}
//             />

//             <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent>
//                     <DialogTitle>Share this event</DialogTitle>
//                     <div className="flex space-x-4 mt-4">
//                         <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
//                             <FaFacebook size={32} className="text-blue-600 hover:text-blue-800" />
//                         </a>
//                         <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
//                             <FaTwitter size={32} className="text-blue-400 hover:text-blue-600" />
//                         </a>
                        
//                         <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
//                             <FaWhatsapp size={32} className="text-green-500 hover:text-green-700" />
//                         </a>
//                         <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
//                             <FaTelegram size={32} className="text-blue-400 hover:text-blue-600" />
//                         </a>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default ShareEventModal;






import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { FaFacebook, FaTwitter, FaWhatsapp, FaTelegram, FaShareAlt } from "react-icons/fa";
import { Calendar, MapPin } from "lucide-react"; // Replace MdLocationPin with MapPin
import { FaHeart } from "react-icons/fa";

const ShareEventModal = ({ event }) => {
    const { title, _id, images, eventDate, location, category, isFree } = event;

    const eventUrl = `https://event-hub-vercel.vercel.app/events/${_id}`;
    const previewImage = images && images.length > 0
        ? images[0]
        : "https://your-default-image-url.com/default.jpg"; // Fallback image
    const categoryName = category?.name
        ? category.name.charAt(0).toUpperCase() + category.name.slice(1)
        : "Uncategorized";

    const [open, setOpen] = useState(false);

    // Share text with more details for WhatsApp and Telegram
    const shareText = `${title}\n📅 ${new Date(eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    })} at ${new Date(eventDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}\n📍 ${location?.name?.split(", ")[0]
        }\n${isFree ? "🎉 Free Event" : "🎟️ Ticketed Event"}\n${eventUrl}\n${previewImage}`;

    const socialLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(title)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        telegram: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(shareText)}`,
    };

    return (
        <>
            <FaShareAlt
                size={22}
                className="text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200"
                onClick={() => setOpen(true)}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-xl bg-white shadow-2xl">
                    <DialogTitle className="text-2xl font-bold text-gray-800">Share This Event</DialogTitle>
                    <div className="mt-4 space-y-4">
                        {/* Event Preview Section */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                            <div className="relative">
                                <img
                                    src={previewImage}
                                    alt={title}
                                    className="w-full h-32 object-cover"
                                />
                                {isFree && (
                                    <div className="absolute top-2 left-2 px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold bg-gradient-to-r from-pink-500 to-red-500 shadow-md">
                                        <FaHeart className="w-4 h-4" />
                                        Free
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 px-3 py-1 rounded-full flex items-center gap-2 text-white text-sm font-semibold backdrop-blur-md bg-black/50 shadow-md">
                                    {categoryName}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">{title.toUpperCase()}</h3>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <Calendar className="w-5 h-5 text-gray-700" />
                                    {new Date(eventDate).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })} at {new Date(eventDate).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "numeric",
                                    })}
                                </p>
                                <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                    <MapPin className="w-5 h-5 text-blue-600" /> {/* Updated to MapPin */}
                                    {location?.name?.split(", ")[0]}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isFree ? "🎉 Free Event" : "🎟️ Ticketed Event"}
                                </p>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex justify-center space-x-6">
                            <a
                                href={socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <FaFacebook size={32} className="text-blue-600 hover:text-blue-800 transition-colors" />
                                <span className="text-xs text-gray-600">Facebook</span>
                            </a>
                            <a
                                href={socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <FaTwitter size={32} className="text-blue-400 hover:text-blue-600 transition-colors" />
                                <span className="text-xs text-gray-600">Twitter</span>
                            </a>
                            <a
                                href={socialLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <FaWhatsapp size={32} className="text-green-500 hover:text-green-700 transition-colors" />
                                <span className="text-xs text-gray-600">WhatsApp</span>
                            </a>
                            <a
                                href={socialLinks.telegram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col items-center gap-1"
                            >
                                <FaTelegram size={32} className="text-blue-400 hover:text-blue-600 transition-colors" />
                                <span className="text-xs text-gray-600">Telegram</span>
                            </a>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShareEventModal;