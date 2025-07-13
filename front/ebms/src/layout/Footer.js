import { FaCopyright, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className="w-full bg-gray-900 text-white">
            {/* Main content area above the footer */}
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">EMS</h3>
                    <p className="text-sm text-gray-400">
                        Your premier destination for discovering, creating, and managing unforgettable events. From corporate conferences to virtual events, we make every event extraordinary.
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-gray-400 hover:text-white"><FaFacebookF /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><FaTwitter /></a>
                        <a href="https://www.instagram.com/melakuaz_21/" className="text-gray-400 hover:text-white"><FaInstagram /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><FaYoutube /></a>
                    </div>
                </div>

                {/* Events Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Events</h3>
                    <ul className="text-sm text-gray-400 space-y-2">
                        <li><a href="/" className="hover:text-white">Browse Events</a></li>
                        <li><a href="#" className="hover:text-white">Create Event</a></li>
                        <li><a href="#" className="hover:text-white">Virtual Events</a></li>
                        <li><a href="#" className="hover:text-white">Corporate Events</a></li>
                        <li><a href="#" className="hover:text-white">Event Categories</a></li>
                        <li><a href="#" className="hover:text-white">Event Calendar</a></li>
                    </ul>
                </div>

                {/* Support Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Support</h3>
                    <ul className="text-sm text-gray-400 space-y-2">
                        <li><a href="#" className="hover:text-white">Help Center</a></li>
                        <li><a href="#" className="hover:text-white">Event Organizer Guide</a></li>
                        <li><a href="#" className="hover:text-white">Attendee Support</a></li>
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">Community Forum</a></li>
                        <li><a href="#" className="hover:text-white">API Documentation</a></li>
                    </ul>
                </div>

                {/* Newsletter and Contact Section */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
                    <p className="text-sm text-gray-400 mb-4">
                        Subscribe to our newsletter for the latest events and exclusive offers.
                    </p>
                    <div className="flex space-x-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                        />
                        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Subscribe
                        </button>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Contact Info</h3>
                        <p className="text-sm text-gray-400">📞 +251918219856</p>
                        <p className="text-sm text-gray-400">✉️ melakuazene23@gmail.com</p>
                        <p className="text-sm text-gray-400">📍 123 Event Street, Bole, Addis Abeba</p>
                    </div>
                </div>
            </div>

            {/* Footer Bottom Section */}
            <hr className="border-gray-700" />
            <footer className="w-full bg-gray-900 text-white py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
                    {/* Left Section: Copyright */}
                    <div className="flex items-center space-x-2">
                        <FaCopyright className="h-4 text-gray-400" />
                        <span className="text-gray-400">
                            © {new Date().getFullYear()} EMS. All rights reserved.
                        </span>
                    </div>

                    {/* Center Section: Links */}
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
                        <a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a>
                        <a href="#" className="text-gray-400 hover:text-white">Accessibility</a>
                    </div>

                    {/* Right Section: Status */}
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <span className="text-gray-400">Trusted by 10,000+ event organizers</span>
                        <span className="flex items-center text-green-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                            All systems operational
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}