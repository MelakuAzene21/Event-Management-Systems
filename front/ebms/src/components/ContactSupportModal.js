import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactSupportMutation } from '../features/api/eventApi'; // Adjust path if needed

const ContactSupportModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [contactSupport, { isLoading }] = useContactSupportMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!message.trim()) errors.message = 'Message is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const firstInvalidField = Object.keys(errors)[0];
      const el = document.querySelector(`[name="${firstInvalidField}"]`);
      if (el) el.focus();
      return;
    }

    try {
      await contactSupport(formData).unwrap();
      onClose(); // Close modal on success
    } catch (err) {
      console.error('Support request failed:', err);
    }
  };

  // Escape key close
  const escHandler = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, [escHandler]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white w-full max-w-3xl p-6 rounded-xl shadow-2xl z-50"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl font-bold"
          >
            ×
          </button>

          {/* Modal Header */}
          <h2 className="text-2xl font-bold mb-2">Tell us about your issue</h2>
          <p className="text-gray-600 mb-6">
            Please describe your issue in detail. The more context you give, the better we can help.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Your name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none ${
                  fieldErrors.name ? 'border-red-500 ring-red-300' : 'focus:ring focus:ring-blue-300'
                }`}
              />
              {fieldErrors.name && <p className="text-sm text-red-600 mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Your email address <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none ${
                  fieldErrors.email ? 'border-red-500 ring-red-300' : 'focus:ring focus:ring-blue-300'
                }`}
              />
              {fieldErrors.email && <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-1">
                How can we help you today? <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none ${
                  fieldErrors.message ? 'border-red-500 ring-red-300' : 'focus:ring focus:ring-blue-300'
                }`}
              />
              {fieldErrors.message && <p className="text-sm text-red-600 mt-1">{fieldErrors.message}</p>}
            </div>

            {/* Submit Button */}
          <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
    className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>            
          </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactSupportModal;
