import { useEffect, useState } from 'react';
import axios from 'axios';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Navigation bar component
const Nav = () => {
    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm mb-6">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-xl font-bold text-indigo-600">EventZone</Link>
                <div className="space-x-6 hidden md:flex">
                    <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">Home</Link>
                    <Link to="/vendors" className="text-gray-600 hover:text-indigo-600 transition">Vendors</Link>
                    <Link to="/organizer-dashboard" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
                </div>
            </div>
        </nav>
    );
};

const AllVendors = () => {
    const [vendors, setVendors] = useState([]);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        service: 'all',
        minRating: 0,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const vendorsPerPage = 9;
    const baseUrl =
        process.env.NODE_ENV === 'production'
            ? 'https://event-management-systems-gj91.onrender.com'
            : 'http://localhost:5000';
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await axios.get(`${baseUrl}/api/auth/vendors`);
                setVendors(data.vendors);
                setFilteredVendors(data.vendors);
            } catch (error) {
                console.error('Failed to fetch vendors:', error);
            }
        };
        fetchVendors();
    }, []);

    useEffect(() => {
        let result = [...vendors];

        if (searchTerm) {
            result = result.filter(
                (vendor) =>
                    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    vendor.serviceProvided.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.status !== 'all') {
            result = result.filter((vendor) => vendor.status === filters.status);
        }
        if (filters.service !== 'all') {
            result = result.filter((vendor) => vendor.serviceProvided === filters.service);
        }
        if (filters.minRating > 0) {
            result = result.filter((vendor) => vendor.rating >= filters.minRating);
        }

        setFilteredVendors(result);
        setCurrentPage(1);
    }, [searchTerm, filters, vendors]);

    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);
    const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const uniqueServices = [...new Set(vendors.map((vendor) => vendor.serviceProvided))];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 font-inter">
            {/* <Link
                to={`/organizer-dashboard`}
                className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition-colors duration-200"
            >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Link> */}

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <Link
                    to={`/organizer-dashboard`}
                    className="text-indigo-600 hover:text-indigo-800 flex items-center mb-6 transition-colors duration-200"
                >
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Vendors</h1>
                    <p className="text-gray-600 mt-2 leading-relaxed">
                        Browse and manage all vendors in the system
                    </p>
                </div>

                <div className="mb-6 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search by name, email, or service..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                        <select
                            value={filters.service}
                            onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Services</option>
                            {uniqueServices.map((service) => (
                                <option key={service} value={service}>
                                    {service}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.minRating}
                            onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value={0}>Any Rating</option>
                            <option value={1}>1+ Stars</option>
                            <option value={2}>2+ Stars</option>
                            <option value={3}>3+ Stars</option>
                            <option value={4}>4+ Stars</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentVendors.map((vendor) => (
                        <Link to={`/vendors/${vendor._id}`} key={vendor._id} className="block group">
                            <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={vendor.avatar || '/default-avatar.png'}
                                        alt={vendor.name}
                                        className="w-14 h-14 rounded-full object-cover bg-gray-200 shadow-sm"
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                                            {vendor.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">{vendor.email}</p>
                                        <p className="text-sm text-gray-600 font-medium">
                                            {vendor.serviceProvided}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${vendor.status === 'active'
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-700">
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < Math.floor(vendor.rating) ? '#FBBF24' : 'none'}
                                                stroke={i < Math.ceil(vendor.rating) ? '#FBBF24' : '#D1D5DB'}
                                                className="transition-colors duration-200"
                                            />
                                        ))}
                                        <span className="text-gray-600 ml-1">
                                            ({vendor.rating?.toFixed(1) || 'N/A'})
                                        </span>
                                    </div>
                                    <div className="text-right font-medium text-gray-900">
                                        {vendor.price || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredVendors.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">No vendors found.</p>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                )}

                {filteredVendors.length > vendorsPerPage && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => paginate(page)}
                                className={`px-4 py-2 rounded-lg ${currentPage === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 disabled:opacity-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllVendors;
