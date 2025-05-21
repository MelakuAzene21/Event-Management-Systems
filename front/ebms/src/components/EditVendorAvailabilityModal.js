import React, { useState } from "react";

const EditVendorAvailabilityModal = ({
  isOpen,
  onClose,
  availability,
  setAvailability,
}) => {
  const [selectedOption, setSelectedOption] = useState(
    availability || "as-needed"
  );
  const [contractToHire, setContractToHire] = useState(false);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSave = () => {
    setAvailability(selectedOption);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 lg:w-[500px]">
        <h2 className="text-xl font-semibold">Availability</h2>

        <p className="text-gray-600 text-sm mt-2">
          Let clients know when you're available to provide your services.
        </p>

        {/* Availability Options */}
        <div className="mt-4 space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="full-time"
              checked={selectedOption === "full-time"}
              onChange={() => handleOptionChange("full-time")}
              className="form-radio text-green-500"
            />
            <span>Full-time</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="part-time"
              checked={selectedOption === "part-time"}
              onChange={() => handleOptionChange("part-time")}
              className="form-radio text-green-500"
            />
            <span>Part-time</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="weekends-only"
              checked={selectedOption === "weekends-only"}
              onChange={() => handleOptionChange("weekends-only")}
              className="form-radio text-green-500"
            />
            <span>Weekends only</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="evenings-only"
              checked={selectedOption === "evenings-only"}
              onChange={() => handleOptionChange("evenings-only")}
              className="form-radio text-green-500"
            />
            <span>Evenings only</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="availability"
              value="as-needed"
              checked={selectedOption === "as-needed"}
              onChange={() => handleOptionChange("as-needed")}
              className="form-radio text-green-500"
            />
            <span>As needed - open to offers</span>
          </label>
        </div>

        {/* Contract-to-Hire Option */}
        <div className="mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={contractToHire}
              onChange={() => setContractToHire(!contractToHire)}
              className="form-checkbox text-green-500"
            />
            <span>I'm open to contract-to-hire opportunities</span>
          </label>
          <p className="text-gray-500 text-sm">
            This means you'll start with a contract and may later explore a
            full-time option.
          </p>
        </div>

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

export default EditVendorAvailabilityModal;
