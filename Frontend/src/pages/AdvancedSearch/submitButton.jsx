/* eslint-disable react/prop-types */


const SubmitButton = ({ handleSearch }) =>
{
    return (
        <button
            onClick={handleSearch}
            className="flex items-center justify-center px-4 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none text-white"
        >
            <svg
                className="h-5 w-5 text-white mr-2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M15.3 14.3l5.7 5.7M10 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8z"></path>
            </svg>
            Search
        </button>);
}

export default SubmitButton;