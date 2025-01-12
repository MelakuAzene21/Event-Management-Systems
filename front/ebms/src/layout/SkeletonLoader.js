// SkeletonLoader.jsx
export default function SkeletonLoader() {
    return (
        <div className="animate-pulse p-4">
            <div className="bg-gray-300 h-48 w-full rounded-md mb-4"></div>
            <div className="bg-gray-300 h-6 w-3/4 rounded-md mb-2"></div>
            <div className="bg-gray-300 h-4 w-1/2 rounded-md mb-2"></div>
            <div className="bg-gray-300 h-4 w-full rounded-md"></div>
        </div>
    );
}
