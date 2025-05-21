import React, { useState } from "react";

const EditLocationModal = ({ isOpen, onClose, onSave, currentLocation }) => {
  const [location, setLocation] = useState(currentLocation);

  const handleSave = () => {
    onSave(location);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Location</h2>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter new location"
        />
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 mr-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditLocationModal;
