import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const VendorProfile = () => {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docType, setDocType] = useState(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/vendor/${id}`);
                const data = await response.json();
                if (response.ok) {
                    setVendor(data);
                } else {
                    console.error('Error fetching vendor:', data.error);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    const detectFileType = async (url) => {
        console.log('Detecting file type for:', url);
        if (/\.(jpg|jpeg|png|webp|avif)$/i.test(url)) {
            console.log('Detected as image by extension');
            return 'image';
        }
        if (/\.pdf$/i.test(url)) {
            console.log('Detected as PDF by extension');
            return 'pdf';
        }

        // Test with .pdf for raw/upload URLs
        if (url.includes('/raw/upload/')) {
            const testUrl = url.endsWith('.pdf') ? url : `${url}.pdf`;
            try {
                const response = await fetch(testUrl, { method: 'HEAD' });
                const contentType = response.headers.get('Content-Type');
                console.log('Content-Type for test URL:', contentType);
                if (contentType && contentType.includes('pdf')) {
                    return 'pdf';
                }
            } catch (error) {
                console.error('Error testing PDF URL:', error);
            }
        }

        // Fallback to original URL
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            console.log('Content-Type for original URL:', contentType);
            if (contentType) {
                if (contentType.includes('image')) return 'image';
                if (contentType.includes('pdf')) return 'pdf';
            }
            return 'unknown';
        } catch (error) {
            console.error('Error detecting file type:', error);
            return 'unknown';
        }
    };

    const openModal = async (doc) => {
        const type = await detectFileType(doc);
        console.log('Opening modal for:', doc, 'Type:', type);
        setSelectedDoc(doc);
        setDocType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setDocType(null);
    };

    if (loading) return <p className="text-center py-8 text-gray-600">Loading...</p>;
    if (!vendor) return <p className="text-center py-8 text-red-600">Vendor not found.</p>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 font-inter bg-gray-50">
            <Link
                to={`/vendors`}
                className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition-colors duration-200"
            >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Vendors
            </Link>

            <div className="flex flex-col md:flex-row gap-8 mb-10 bg-white rounded-xl p-6 shadow-lg">
                <div className="flex-shrink-0">
                    <img
                        src={vendor.avatar || '/default.jpg'}
                        alt="Vendor Avatar"
                        className="h-32 w-32 rounded-full object-cover shadow-md ring-2 ring-indigo-100"
                    />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
                        <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                            {vendor.status || 'Active'}
                        </span>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center">
                            <FiMapPin className="text-gray-500 mr-2" />
                            <span className="text-gray-600">{vendor.location || 'No location specified'}</span>
                        </div>
                        <div className="flex items-center">
                            <FiCalendar className="text-gray-500 mr-2" />
                            <span className="text-gray-600">{vendor.availability || 'Daily appointments'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <FaStar
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(vendor.rating || 4.9) ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="ml-2 text-gray-600">({vendor.rating || '4.9'})</span>
                        </div>
                        <span className="text-gray-600 font-medium">{vendor.price || '2,500 birr per session'}</span>
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-200 mb-8 bg-white rounded-t-xl shadow-sm">
                <nav className="flex space-x-6 px-6">
                    {['about', 'portfolio', 'documents'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-3 px-2 text-base font-medium transition-colors duration-200 ${activeTab === tab
                                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                                    : 'text-gray-500 hover:text-indigo-600'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    {activeTab === 'about' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                {vendor.description ||
                                    'Professional vendor with expertise in their field. Committed to delivering high-quality services tailored to your needs.'}
                            </p>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Service Provided</h3>
                            <p className="text-gray-600">{vendor.serviceProvided || 'Service Provider'}</p>
                        </div>
                    )}

                    {activeTab === 'portfolio' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio</h2>
                            {vendor.portfolio && vendor.portfolio.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {vendor.portfolio.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <img
                                                src={item.image || '/default-portfolio.jpg'}
                                                alt={item.title}
                                                className="h-48 w-full object-cover"
                                            />
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                                <p className="text-gray-600 mt-1">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No portfolio uploaded.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Documents</h2>
                            {vendor.docs && vendor.docs.length > 0 ? (
                                <div className="space-y-4">
                                    {vendor.docs.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                                        >
                                            <span className="font-medium text-gray-700">
                                                Document {index + 1}
                                            </span>
                                            <button
                                                onClick={() => openModal(doc)}
                                                className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No documents uploaded.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:w-1/3 space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-gray-600">
                                <span className="font-medium">Email:</span>
                                <span>{vendor.email}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span className="font-medium">Role:</span>
                                <span>{vendor.role || 'Vendor'}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span className="font-medium">Status:</span>
                                <span className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                                    {vendor.status || 'Active'}
                                </span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                            Contact Vendor
                        </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
                        <p className="text-2xl font-bold text-gray-900 mb-2">
                            {vendor.price || '2,500 birr per session'}
                        </p>
                        <p className="text-gray-600 mb-4">{vendor.serviceProvided || 'Service Provider'}</p>
                        <button className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                            Book Now
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <motion.div
                            className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 relative shadow-2xl overflow-hidden"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Document Preview</h3>
                            <div className="relative w-full h-[70vh] bg-gray-50 rounded-xl overflow-auto p-4">
                                {selectedDoc && docType ? (
                                    docType === 'image' ? (
                                        <img
                                            src={selectedDoc}
                                            alt="Document Preview"
                                            className="max-w-full max-h-full object-contain mx-auto rounded-lg shadow-md"
                                            onError={(e) => console.error(`Image load error: ${selectedDoc}`, e)}
                                        />
                                    ) : docType === 'pdf' ? (
                                        <iframe
                                            src={`${selectedDoc}?inline=true#toolbar=0&navpanes=0&scrollbar=0`}
                                            className="w-full h-full rounded-lg border border-gray-200"
                                            title="Document Preview"
                                            onError={(e) => console.error(`PDF load error: ${selectedDoc}`, e)}
                                        />
                                    ) : (
                                        <p className="text-gray-600 text-center">
                                            Preview not available for this file type.
                                        </p>
                                    )
                                ) : (
                                    <p className="text-gray-600 text-center">Unable to load document.</p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorProfile;