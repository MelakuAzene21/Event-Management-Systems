import React, { useState } from "react";

const MyEvents = () => {
  const [activeTab, setActiveTab] = useState("upcoming"); // Default to upcoming events

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Tab Buttons (Upcoming on Left, Past on Right) */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === "upcoming"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming Events
        </button>
        <button
          className={`px-4 py-2 font-semibold rounded-lg ${
            activeTab === "past"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "upcoming" ? (
          <div className="text-gray-700 text-center">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <p>List of events where you will provide service.</p>
          </div>
        ) : (
          <div className="text-gray-700 text-center">
            <h2 className="text-xl font-bold mb-4">Past Events</h2>
            <p>List of past events where you provided service.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
