import React, { useState, useEffect } from "react";
import { FaClock, FaFolderOpen, FaUser, FaMapMarkerAlt, FaDollarSign, FaEdit, FaStar, FaPlus } from "react-icons/fa";
import EditPhotoModal from "./EditPhotoModal";
import EditServicesModal from "./EditServicesModal";
import ProfileModal from "./ProfileModal";
import EditVendorAvailabilityModal from "./EditVendorAvailabilityModal";
import EditLocationModal from "./EditLocationModal";
import EditPriceModal from "./EditPriceModal";
import Portfolio from "./Portfolio"; // Import the Portfolio component
import { useDispatch, useSelector } from 'react-redux'; // Import Redux hooks
import { setVendorData } from '../features/slices/vendorSlice'; // Import the action

const VendorProfile = () => {
  const [availability, setAvailability] = useState("Full-time");
  const [price, setPrice] = useState("$50/hr");
  const [location, setLocation] = useState("New York, USA");
  const [services, setServices] = useState([
  ""
  ]);
  const [portfolio, setPortfolio] = useState([
    {
      id: 1,
      title: "Online form filling Data entry",
      image: "https://via.placeholder.com/150",
      showMenu: false,
    },
    {
      id: 2,
      title: "Image to Text Data Entry",
      image: "https://via.placeholder.com/150",
      showMenu: false,
    },
    {
      id: 3,
      title: "Market Research & Data Collection",
      image: "https://via.placeholder.com/150",
      showMenu: false,
    },
  ]);
  const [rating, setRating] = useState(4.5);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false); // State for Price Modal

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user from Redux

  useEffect(() => {
    // Dispatch the action to set the vendor data in Redux when the profile loads
    const vendorData = {
      name: "John Doe",
      location: "New York, USA",
      services: services,
      price: price,
      availability: availability,
      portfolio: portfolio,
    };
    
    dispatch(setVendorData(vendorData)); // Dispatching the action
  }, [dispatch, services, price, availability, portfolio]); // Dependencies to update when any state changes

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      {/* First Row - Centered Profile Section */}
      <div className="flex flex-col items-center border-b pb-4">
        <div className="relative">
          <img
         src={`http://localhost:5000${user.avatar}`} // If backend runs on port 5000

             alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div
            className="absolute bottom-0 right-0 w-8 h-8 border-2 border-gray-500 rounded-full flex items-center justify-center bg-white cursor-pointer"
            onClick={() => setIsPhotoModalOpen(true)}
          >
            <FaEdit className="text-gray-500" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mt-2">{user.name}</h2>
        <p className="text-gray-600 flex items-center gap-2">
          <FaMapMarkerAlt
            className="text-gray-500 cursor-pointer"
            onClick={() => setIsLocationModalOpen(true)} // Open Location Modal
          />{" "}
          {user.location}
        </p>
      </div>

      {/* Second Row - Services Offered & Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-4">
        {/* Services Offered */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Services Offered
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsServicesModalOpen(true)}
            />
          </h3>
          <ul className="list-disc list-inside text-gray-600 mt-2">
            {services.map((service, index) => (
              <li key={index}>{user.
                serviceProvided}</li>
            ))}
          </ul>
        </div>

        {/* Project Overview (Updated Title) */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            profile Overview
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsProfileModalOpen(true)}
            />
          </h3>
          <p className="text-gray-600 mt-2">
            Experienced web developer specializing in modern and scalable
            solutions.
          </p>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Location
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsLocationModalOpen(true)} // Open Location Modal
            />
          </h3>
          <p className="text-gray-600 mt-2">{user.location}</p>
        </div>

        {/* Upload CV */}
        <div>
          <h3 className="text-lg font-semibold">Upload CV</h3>
          <input
            type="file"
            className="mt-2"
            accept=".pdf,.doc,.docx"
            onChange={(e) => console.log(e.target.files[0])}
          />
        </div>
      </div>

      {/* Third Row - Availability & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
        <div className="flex items-center gap-2">
          <FaClock className="text-gray-500" />
          <span>
            Availability: {user.availability}{" "}
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsAvailabilityModalOpen(true)} // Open Availability Modal
            />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaDollarSign className="text-gray-500" />
          <span>
            Price: {user.price}
            <FaEdit
              className="text-gray-500 cursor-pointer"
              onClick={() => setIsPriceModalOpen(true)} // Open Price Modal
            />
          </span>
        </div>
      </div>

      {/* Portfolio Section */}
      <Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />

      {/* Modals */}
      <EditPhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
      />
      <EditServicesModal
        isOpen={isServicesModalOpen}
        onClose={() => setIsServicesModalOpen(false)}
      />
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <EditVendorAvailabilityModal
        isOpen={isAvailabilityModalOpen}
        onClose={() => setIsAvailabilityModalOpen(false)}
      />
      <EditLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
      <EditPriceModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />
    </div>
  );
};

export default VendorProfile;
