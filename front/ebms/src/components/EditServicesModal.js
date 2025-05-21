import React, { useState } from "react";

const EditServicesModal = ({ isOpen, onClose, services, setServices }) => {
  const [newServices, setNewServices] = useState(services || []);
  const [inputValue, setInputValue] = useState("");
  const maxServices = 3;

  const handleAddService = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (newServices.length < maxServices) {
        setNewServices([...newServices, inputValue.trim()]);
        setInputValue(""); // Clear input after adding
      }
    }
  };

  const handleRemoveService = (index) => {
    const updatedServices = newServices.filter((_, i) => i !== index);
    setNewServices(updatedServices);
  };

  const handleSave = () => {
    setServices(newServices);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 lg:w-[500px]">
        <h2 className="text-xl font-semibold">Edit Services</h2>

        {/* Services Display */}
        <div className="flex flex-wrap gap-2 mt-4 border p-2 rounded">
          {newServices.map((service, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-200 px-2 py-1 rounded-full"
            >
              <span className="text-sm">{service}</span>
              <button
                onClick={() => handleRemoveService(index)}
                className="ml-2 text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Input Field (Disabled if max reached) */}
          {newServices.length < maxServices && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleAddService}
              placeholder="Add Services"
              className="outline-none text-gray-600"
            />
          )}
        </div>

        {/* Max Services Message */}
        <p className="text-gray-500 text-sm mt-2">
          Max services allowed: {maxServices}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 text-gray-600" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md ml-2"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditServicesModal;
