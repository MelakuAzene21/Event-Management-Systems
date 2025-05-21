import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to access Redux state
import { setProfilePhoto } from "../features/slices/authSlice"; // Import the action
const EditPhotoModal = ({ isOpen, onClose, updateProfilePhoto }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch(); // Redux dispatch

  // Use useSelector to get the user object from Redux state (from authSlice)
  const user = useSelector((state) => state.auth.user); // Get the user object from auth slice
  console.log("User in component:", user);

  // const profilePhoto = useSelector((state) => state.auth.user);


  const vendorId = user._id; // Extract _id (vendorId) from the user object
  // console.log("User in component:", vendorId);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Allowed image types
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPG, PNG, and GIF images are allowed.");
        setSelectedFile(null);
        return;
      }

      if (file.size > maxSize) {
        setError("Image exceeds 5MB.");
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError("");
    }
  };

  const handleDropClick = () => {
    document.getElementById("fileInput").click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);
    
    if (!selectedFile)
      console.log("Uploading photo for vendor:", vendorId);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/uploads/upload-avatar/${vendorId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(setProfilePhoto(response.data.photoUrl)); // Update profile image in Redux     
      onClose(); // Close the modal

     
    } catch (error) {
      console.error("Error uploading photo:", error);
      setError("Failed to upload photo. Try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 lg:w-[500px]">
        <h2 className="text-xl font-semibold">Edit Photo</h2>
        <div className="flex flex-col items-center mt-4">
          <input
            type="file"
            id="fileInput"
            accept="image/jpeg, image/png, image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <div
            className="w-40 h-40 border-2 border-dashed border-green-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleDropClick}
          >
            {selectedFile ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-gray-600 text-center">
                Attach or Drop photo here
              </span>
            )}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 text-gray-600" onClick={onClose}>
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md ml-2 ${
              selectedFile
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Attach photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPhotoModal;
