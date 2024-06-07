import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SubmitButton from './submitButton';
import DateRangePicker from './dateRangePicker';
import Dropdown from '../../components/dropdown';
import Input from '../../components/input';
import LocationPicker from './locationPicker';
import { AdjustmentsIcon, DatabaseIcon, OfficeBuildingIcon } from '@heroicons/react/outline';
import { datasets } from '../../constants/datasets';
import { facilityTypes } from '../../constants/facilityTypes';
import { handleNLP } from './functions/nlpsearch';
import Spinner from '../../components/spinner';

const AdvancedSearchPage = () =>
{
    const [selectedDataset, setSelectedDataset] = useState('NAIP: National Agriculture Imagery Program');

    const [facilityType, setFacilityType] = useState('');

    const [searchRadius, setSearchRadius] = useState(25);

    const [selectedLocations, setSelectedLocations] = useState([]);

    const [selectedCoordinates, setSelectedCoordinates] = useState({ longitude: 0, latitude: 0 });

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [pastSearches, setPastSearches] = useState([]);

    const navigate = useNavigate();

    const [nlpResults, setNlpResults] = useState([]);

    const location = useLocation();
    const query = location.state;

    const [isLoading, setIsLoading] = useState(true);



    useEffect(() =>
    {
        const savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
        setPastSearches(savedSearches);
        handleNLP(query, setNlpResults);
        console.log(nlpResults);


    }, []);

    // const downloadSearchesAsJson = () =>
    // {
    //     const savedSearches = localStorage.getItem('savedSearches');
    //     const blob = new Blob([savedSearches], { type: 'application/json' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'savedSearches.json';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    // };
    const downloadSearchAsJson = (search) =>
    {
        const searchJson = JSON.stringify(search);
        const blob = new Blob([searchJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${search.dataset.replace(/ /g, '_')}_${search.id}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    useEffect(() =>
    {
        if (nlpResults.length > 0)
        {
            setIsLoading(true)
            const cleanResults = nlpResults
                .replace(/^python\s+/, '')
                .replace(/^PYTHON\s+/, '')
                .replace(/^json\s+/, '')
                .replace(/^JSON\s+/, '')
                .split('\n')  // Split by new line to process each line
                .filter(line => !line.trim().startsWith('#'))  // Remove lines that start with #
                .join('\n')  // Rejoin the filtered lines
                .replace(/'/g, '"')  // Replace single quotes with double quotes
                .replace(/None/g, 'null')  // Replace Python's None with null
                .replace(/(\w+):/g, '"$1":')  // Ensure property names are double-quoted
                .replace(/([{,]\s*)([^"{\s]+)\s*:/g, '$1"$2":')
                .trim();
            try
            {
                const result = JSON.parse(cleanResults);
                setSelectedDataset(result.dataset || 'NAIP: National Agriculture Imagery Program');
                setFacilityType(result.facility_type || 'airport');
                setSearchRadius(result.radius || 25);

                const locations = result.location_name ? [result.location_name] : [];
                setSelectedLocations(locations);


                setStartDate(result.start_date || "");
                setEndDate(result.end_date || "");


            } catch (error)
            {
                console.error("Error parsing NLP results: ", error);
            } finally
            {
                setIsLoading(false)
            }

        }
        setIsLoading(false);
    }, [nlpResults]);
    const handleSearch = () =>
    {
        const reqBody = {
            dataset: selectedDataset,
            facility: facilityType,
            radius: Math.abs(searchRadius),
            locations: selectedLocations.join(', '),
            coordinates: selectedCoordinates,
            startDate,
            endDate
        };

        navigate('/results', { state: reqBody });

    };

    const loadPastSearch = (search) =>
    {
        setSelectedDataset(search.dataset);
        setFacilityType(search.facility);
        setSearchRadius(search.radius);
        setSelectedLocations(search.locations ? search.locations.split(', ') : []);
        setSelectedCoordinates(search.coordinates || { longitude: 0, latitude: 0 });
        setStartDate(search.startDate);
        setEndDate(search.endDate);
    };


    return (

        <div className="bg-[#121212] h-screen flex flex-col justify-center items-center px-4 h-full"
            style={{ backgroundImage: 'url(src/assets/background.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
        >
            {isLoading && <Spinner />}
            <h1 className="text-5xl font-bold text-white mb-8">Advanced Search</h1>

            <div className="container mx-auto p-4 bg-midgard-gray shadow rounded-lg max-w-4xl">
                <div className="flex space-x-4">
                    <Dropdown
                        options={datasets}
                        selected={selectedDataset}
                        onSelect={setSelectedDataset}
                        icon={DatabaseIcon}
                    />
                    <Dropdown
                        options={facilityTypes}
                        selected={facilityType}
                        onSelect={setFacilityType}
                        icon={OfficeBuildingIcon}
                        allowFreeform={true}
                        placeholder='Facility Type'
                    />

                    <Input
                        type='text'
                        value={searchRadius}
                        onChange={(e) => setSearchRadius(e.target.value)}
                        icon={AdjustmentsIcon}
                        placeholder='Search Radius'
                        unit='km'
                    />
                </div>
                <div className='flex justify-center mt-6'>
                    <LocationPicker onSelectLocations={setSelectedLocations} onSelectCoordinates={setSelectedCoordinates} initialLocations={selectedLocations} initialCoordinates={selectedCoordinates} />
                </div>

                <div className="flex space-x-4 mt-4">
                    <DateRangePicker
                        label="Start Date"
                        value={startDate}
                        defaultValue={startDate}
                        onChange={setStartDate}
                    />
                    <DateRangePicker
                        label="End Date"
                        value={endDate}
                        defaultValue={endDate}
                        onChange={setEndDate}
                    />
                </div>

                <br />
                <div className='flex justify-center'>
                    <SubmitButton handleSearch={handleSearch} />
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="past-searches" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 pt-8">Load or Download Past Search:</label>
                <div className="space-y-2">
                    {pastSearches.map((search) => (
                        <div key={search.id} className="flex items-center space-x-2">
                            <button
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-midgard-orange focus:border-midgard-orange py-2 px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-midgard-orange"
                                onClick={() => loadPastSearch(search)}
                            >
                                Load {search.dataset}
                            </button>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => downloadSearchAsJson(search)}
                            >
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default AdvancedSearchPage;
