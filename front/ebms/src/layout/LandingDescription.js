import React from "react";
import { motion } from "framer-motion";

const LandingDescription = () => {
    return (
        <section
            className="relative bg-cover bg-center text-white py-16 px-6 flex items-center justify-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80')",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Content */}
            <motion.div
                className="relative max-w-5xl mx-auto text-center px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Main Title */}
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold leading-tight mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    Plan, Discover & Experience <br />
                    <span className="text-yellow-400">Unforgettable Events</span>
                </motion.h1>

                {/* Short & Engaging Description */}
                <motion.p
                    className="text-md md:text-lg text-gray-200 max-w-3xl mx-auto mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Welcome to <span className="font-semibold text-white">Event Hub</span> –
                    your **ultimate platform** to seamlessly organize, manage, and attend
                    **extraordinary events**.
                </motion.p>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <div className="bg-white bg-opacity-10 backdrop-blur-md p-5 rounded-lg shadow-lg hover:bg-opacity-20 transition">
                        <h2 className="text-xl font-semibold mb-2 text-yellow-400">
                            For Organizers
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Create, promote, and manage events while engaging your audience.
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-md p-5 rounded-lg shadow-lg hover:bg-opacity-20 transition">
                        <h2 className="text-xl font-semibold mb-2 text-green-400">
                            For Vendors
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Showcase your services, connect with event planners, and grow your business.
                        </p>
                    </div>
                    <div className="bg-white bg-opacity-10 backdrop-blur-md p-5 rounded-lg shadow-lg hover:bg-opacity-20 transition">
                        <h2 className="text-xl font-semibold mb-2 text-blue-400">
                            For Attendees
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Discover and book the best events, tailored to your interests.
                        </p>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <button className="bg-yellow-400 text-gray-900 font-semibold py-2 px-5 rounded-full text-md shadow-md hover:bg-yellow-500 transition">
                        Get Started
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default LandingDescription;
