import React from "react";

const EditPriceModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit Price</h2>
        <input
          type="text"
          placeholder="Enter new price"
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Add logic to save the new price
              onClose();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPriceModal;