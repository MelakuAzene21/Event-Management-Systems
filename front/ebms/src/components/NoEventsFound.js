import { BsArrowRightShort } from "react-icons/bs";
import { MdEventBusy } from "react-icons/md";

function NoEventsFound({ resetFilters }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
            <MdEventBusy className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Available</h3>
            <p className="text-gray-500 text-center max-w-md">
                It looks like there are no events matching your current filters. Try adjusting your category or time preferences to discover more exciting events!
            </p>
            <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
                Reset Filters
                <BsArrowRightShort className="w-5 h-5" />
            </button>
        </div>
    );
}

export default NoEventsFound;