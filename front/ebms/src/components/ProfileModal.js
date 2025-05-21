import React, { useState } from "react";

const ProfileModal = ({ isOpen, onClose }) => {
  const [profileOverview, setProfileOverview] = useState(
    "I'm a data entry professional with 4 years of experience. I'm fast and accurate and have a keen eye for detail. I'm also experienced in data mining and web research..."
  );
  const maxCharacters = 1000; // Updated character limit
  const charactersLeft = maxCharacters - profileOverview.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4">Profile Overview</h2>
        <p className="text-gray-600 mb-4">
          Use this space to show clients you have the skills and experience
          they're looking for.
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>Describe your strengths and skills</li>
          <li>Highlight projects, accomplishments, and education</li>
          <li>Keep it short and make sure it's error-free</li>
        </ul>

        {/* Profile Overview Textarea */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          rows="8"
          value={profileOverview}
          onChange={(e) => {
            // Allow typing only if the character limit is not exceeded
            if (e.target.value.length <= maxCharacters) {
              setProfileOverview(e.target.value);
            }
          }}
          placeholder="Describe your profile..."
        />
        <p className="text-gray-500 text-sm mb-4">
          {charactersLeft} characters left
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => {
              // Handle save logic here
              console.log("Profile Overview Saved:", profileOverview);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
