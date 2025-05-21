import React, { useState } from "react";
import { FaEllipsisH, FaPlus, FaSort, FaTimes, FaUpload } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  togglePortfolioMenu
} from "../features/slices/authSlice";

const Portfolio = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const portfolioItems = user.portfolio || [];

  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newPortfolio, setNewPortfolio] = useState({ 
    title: "", 
    description: "", 
    image: null 
  });
  const [editPortfolio, setEditPortfolio] = useState({ 
    index: null, 
    title: "", 
    description: "", 
    image: null 
  });
  const [errors, setErrors] = useState({ title: false, description: false });

  const toggleMenu = (index) => {
    dispatch(togglePortfolioMenu(index));
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleEditThumbnail = (index) => {
    const item = portfolioItems[index];
    if (item) {
      setEditPortfolio({
        index,
        title: item.title,
        description: item.description,
        image: item.image,
      });
      setShowEditModal(true);
    }
  };

  const handleDelete = (index) => {
    setEditPortfolio(prev => ({ ...prev, index }));
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch(deletePortfolioItem(editPortfolio.index));
    setShowDeleteConfirm(false);
    setEditPortfolio({ index: null, title: "", description: "", image: null });
  };

  const handleAddPortfolio = () => {
    if (!newPortfolio.title.trim()) {
      setErrors({ title: true, description: false });
      return;
    }

    dispatch(addPortfolioItem({
      title: newPortfolio.title || "50 birr per hour",
      description: newPortfolio.description || "50 birr per hour",
      image: newPortfolio.image
    }));

    setNewPortfolio({ title: "", description: "", image: null });
    setErrors({ title: false, description: false });
    setShowModal(false);
  };

  const handleUpdatePortfolio = () => {
    if (editPortfolio.index === null) return;

    dispatch(updatePortfolioItem({
      index: editPortfolio.index,
      title: editPortfolio.title || "50 birr per hour",
      description: editPortfolio.description || "50 birr per hour",
      image: editPortfolio.image
    }));

    setEditPortfolio({ index: null, title: "", description: "", image: null });
    setShowEditModal(false);
  };

  return (
    <div className="border-b pb-4 px-4">
      <h3 className="text-xl font-semibold mb-4">Portfolio</h3>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {portfolioItems.map((item, index) => (
          <div key={index} className="rounded-lg shadow-sm border relative">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-32 object-cover rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => handleImageClick(item.image)}
              />
            )}
            <div className="p-2">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>

            <div
              className="absolute top-2 right-2 cursor-pointer bg-white p-1 rounded-full shadow border border-green-500"
              onClick={() => toggleMenu(index)}
            >
              <FaEllipsisH className="text-green-600" />
            </div>

            {item.showMenu && (
              <div className="absolute top-10 right-2 bg-white shadow-lg rounded-md p-2 flex flex-col text-sm border w-40">
                <button
                  className="text-gray-800 hover:bg-gray-100 px-4 py-2 text-left"
                  onClick={() => handleEditThumbnail(index)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600 hover:bg-gray-100 px-4 py-2 text-left"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <button
          className="bg-green-600 text-white p-2 rounded-full shadow"
          onClick={() => setShowModal(true)}
        >
          <FaPlus />
        </button>
        <button className="bg-gray-200 p-2 rounded-full shadow">
          <FaSort />
        </button>
      </div>

      {/* Add Portfolio Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-160">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Portfolio Item</h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Service Title"
              className={`w-full border p-2 rounded mb-3 ${errors.title ? "border-red-500" : ""}`}
              value={newPortfolio.title}
              onChange={(e) => {
                setNewPortfolio({ ...newPortfolio, title: e.target.value });
                setErrors({ title: false, description: false });
              }}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-3">Title is required.</p>
            )}
            <textarea
              placeholder="Service Description"
              className="w-full border p-2 rounded mb-3"
              value={newPortfolio.description}
              onChange={(e) => {
                setNewPortfolio({ ...newPortfolio, description: e.target.value });
              }}
            />
            <div className="border p-4 rounded mb-3 flex flex-col items-center justify-center cursor-pointer bg-gray-100">
              <label htmlFor="file-upload" className="cursor-pointer">
                <FaUpload className="text-gray-500 text-2xl" />
                <p className="text-sm text-gray-600 mt-2">Upload Image</p>
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setNewPortfolio({ ...newPortfolio, image: imageUrl });
                  }
                }}
              />
              {newPortfolio.image && (
                <p className="text-sm mt-2">Image selected</p>
              )}
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={handleAddPortfolio}
            >
              Add Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Edit Portfolio Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-160">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Portfolio Item</h2>
              <button onClick={() => setShowEditModal(false)}>
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Service Title"
              className="w-full border p-2 rounded mb-3"
              value={editPortfolio.title}
              onChange={(e) => {
                setEditPortfolio({ ...editPortfolio, title: e.target.value });
              }}
            />
            <textarea
              placeholder="Service Description"
              className="w-full border p-2 rounded mb-3"
              value={editPortfolio.description}
              onChange={(e) => {
                setEditPortfolio({ ...editPortfolio, description: e.target.value });
              }}
            />
            <div className="border p-4 rounded mb-3 flex flex-col items-center justify-center cursor-pointer bg-gray-100">
              <label htmlFor="edit-file-upload" className="cursor-pointer">
                <FaUpload className="text-gray-500 text-2xl" />
                <p className="text-sm text-gray-600 mt-2">Upload New Image</p>
              </label>
              <input
                id="edit-file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const imageUrl = URL.createObjectURL(file);
                    setEditPortfolio({ ...editPortfolio, image: imageUrl });
                  }
                }}
              />
              {editPortfolio.image && (
                <p className="text-sm mt-2">
                  {typeof editPortfolio.image === 'string' ? "Current Image" : "New Image Selected"}
                </p>
              )}
            </div>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded w-full"
              onClick={handleUpdatePortfolio}
            >
              Update Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 px-4 py-2 rounded"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-full max-w-6xl">
            <button 
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>
            <div className="w-full h-[80vh] flex items-center justify-center">
              <img 
                src={selectedImage} 
                alt="Portfolio preview" 
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;