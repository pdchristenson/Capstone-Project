import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SimpleSearch = () =>
{
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) =>
    {
        event.preventDefault();
        if (searchTerm.trim() !== '')
        {
            const query = { searchQuery: searchTerm.trim() };
            navigate('/advanced-search', { state: query });
        }
    };

    const handleInputChange = (event) =>
    {
        setSearchTerm(event.target.value);
    };

    const handleKeyDown = (event) =>
    {
        if (event.key === 'Enter' && !event.shiftKey)
        {
            event.preventDefault();
            handleSearch(event);
        }
    };

    return (
        <div className="h-screen flex flex-col justify-center items-center px-4 h-full"
             style={{ backgroundImage: 'url(src/assets/background.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}
        >
            <h1 className="text-6xl font-bold text-white mb-10">Raven Eye</h1>
            <form className="flex rounded-full overflow-hidden shadow-lg w-full max-w-md mx-auto" onSubmit={handleSearch}>
                <textarea
                    className="px-6 py-3 w-full h-12 text-gray-100 leading-tight focus:outline-none resize-none overflow-hidden"
                    id="search"
                    placeholder="What are you looking for?"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows="1"
                />
                <button
                    className="flex items-center justify-center px-4 rounded-r-full bg-midgard-blue focus:outline-none"
                    type="submit"
                >
                    <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M15.3 14.3l5.7 5.7M10 18c4.4 0 8-3.6 8-8s-3.6-8-8-8-8 3.6-8 8 3.6 8 8 8z"></path>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default SimpleSearch;