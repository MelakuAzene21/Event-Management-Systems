import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { FiMapPin, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addChat } from '../features/slices/chatSlice';
import { toast } from 'react-toastify';

const VendorDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const chats = useSelector((state) => state.chats.chats);
    const { user } = useSelector((state) => state.auth);
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [docType, setDocType] = useState(null);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/vendor/${id}`, {
                    credentials: 'include'
                });
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

    const openModal = (doc) => {
        setSelectedDoc(doc);
        setDocType(doc.type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoc(null);
        setDocType(null);
    };

    const handleContactVendor = async () => {

        if (!user) {
            toast.error('Please log in to start chatting');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/chats/newchat', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receiverId: id,
                }),
            });
        
            const data = await response.json();
            console.log(data);
        
            if (response.ok) {
                // Handle both new and existing chat correctly
                const chat = data._id ? data : data.chat;
        
                // ✅ Check if chat already exists in Redux store
                const existingChat = chats.find((c) => c._id === chat._id);
        
                if (!existingChat) {
                    // If not exists, add to the Redux store
                    dispatch(addChat(chat));
                }
        
                // Always navigate to it
                navigate(`/organizer-dashboard?tab=chatting&chatId=${chat._id}`);
                if (!existingChat) {
                    toast.success('Chat started successfully');
                }
            } else {
                console.error('Failed to create chat:', data.message || data.error);
                toast.error(data.message || 'Failed to start chat');
            }
        } catch (error) {
            console.error('Error creating chat:', error);
            toast.error('Connection error. Please try again.');
        }
        

        
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
                            <div className="space-y-4">
                                {vendor.documents && vendor.documents.length > 0 ? (
                                    vendor.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl">
                                            <span className="text-gray-600">{doc.name}</span>
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800"
                                                onClick={() => openModal(doc)}
                                            >
                                                View
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No documents uploaded.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="md:w-1/3">
                    <div className="bg-indigo-600 text-white rounded-xl p-6">
                        <h3 className="text-xl font-semibold">Contact Vendor</h3>
                        <p className="text-gray-200 my-4">Message {vendor.name} directly for more details.</p>
                        <button
                            onClick={handleContactVendor}
                            className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded-full w-full"
                        >
                            Start Chat
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50"
                    >
                        <div className="bg-white p-8 rounded-xl max-w-xl w-full">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold">View {docType === 'image' ? 'Image' : 'Document'}</h2>
                                <button onClick={closeModal} className="text-gray-600">
                                    <FaTimes />
                                </button>
                            </div>
                            {docType === 'image' && <img src={selectedDoc.url} alt={selectedDoc.name} className="w-full" />}
                            {docType === 'pdf' && (
                                <embed
                                    src={selectedDoc.url}
                                    type="application/pdf"
                                    className="w-full h-96"
                                />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorDetail;