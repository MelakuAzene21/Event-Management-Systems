import Title from "./Title";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <Title title={"Not found Page"} />
            <div className="text-center">
                <h2 className="text-9xl font-bold text-blue-600 mb-4">404</h2>
                <h3 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h3>
                <p className="text-lg text-gray-500">
                    Sorry, the page you're looking for doesn't exist.
                </p>
            </div>
        </div>
    );
}
