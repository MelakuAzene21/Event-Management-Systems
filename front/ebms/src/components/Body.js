import React from "react";

const Body = () => {
  return (
    <div className="min-h-[80vh] flex flex-col r px-4 text-center bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-xl shadow-md mt-2">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
        Welcome to Your Vendor Dashboard 
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-6">
        Manage your events, showcase your portfolio, and grow your business with ease. Stay connected with organizers and never miss an opportunity.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-64 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-indigo-600 mb-2">📅 Upcoming Events</h2>
          <p className="text-gray-600">Keep track of the events you've been hired for.</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 w-64 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-green-600 mb-2">🛠️ Portfolio</h2>
          <p className="text-gray-600">Showcase your best work to impress potential clients.</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 w-64 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">⭐ Reviews</h2>
          <p className="text-gray-600">Build your credibility with client feedback.</p>
        </div>
      </div>
    </div>
  );
};

export default Body;
