import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaTelegram, FaShareAlt } from "react-icons/fa";

const ShareEventModal = ({ event }) => {
    const { title, _id } = event;

    const eventUrl = `https://event-hub-vercel.vercel.app/${_id}`;

    const [open, setOpen] = useState(false);

    const socialLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${eventUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${eventUrl}&text=${title}`,
        linkedin: `https://www.linkedin.com/shareArticle?url=${eventUrl}&title=${title}`,
        whatsapp: `https://api.whatsapp.com/send?text=${title}%20${eventUrl}`,
        telegram: `https://t.me/share/url?url=${eventUrl}&text=${title}`,
    };

    return (
        <>
            {/* Share Icon instead of Button */}
            <FaShareAlt
                size={22}
                className="text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setOpen(true)}
            />

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogTitle>Share this event</DialogTitle>
                    <div className="flex space-x-4 mt-4">
                        <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={32} className="text-blue-600 hover:text-blue-800" />
                        </a>
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={32} className="text-blue-400 hover:text-blue-600" />
                        </a>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={32} className="text-blue-500 hover:text-blue-700" />
                        </a>
                        <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={32} className="text-green-500 hover:text-green-700" />
                        </a>
                        <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer">
                            <FaTelegram size={32} className="text-blue-400 hover:text-blue-600" />
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShareEventModal;
