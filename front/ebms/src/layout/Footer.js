import { FaCopyright } from "react-icons/fa";

export default function Footer() {
    return (
        <div className="w-full bg-black  mt-12  bottom-0">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
                {/* Left section for copyright */}
                <div className="flex items-center space-x-2">
                    <FaCopyright className="h-5" />
                    <span className="text-sm">Evento LEMS</span>
                </div>
            </div>

            {/* Small screen view: Centered text */}
            <div className="text-center text-sm mt-4 text-gray-400">
                <p>&copy; 2024 Evento EMS. All rights reserved.</p>
                <p className="itallic text-white font-mono">Developed by Melaku</p>
            </div>
        </div>
    );
}
