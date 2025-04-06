import { FaCopyright } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="w-full bg-gray-50 text-black py-6 shadow-lg">
            <hr className="border-gray-300" />
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
                {/* Left section for copyright */}
                <div className="flex items-center space-x-2">
                    <FaCopyright className="h-5 text-gray-600" />
                    <span className="text-sm text-gray-700">EMS</span>
                </div>

                {/* Small screen view: Centered text */}
                <div className="text-center mt-4 md:mt-0">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} EMS. All rights reserved.
                    </p>
                    <p className="italic text-gray-600 font-mono mt-1">
                        Developed by Melaku
                    </p>
                </div>
            </div>
        </footer>
    );
}