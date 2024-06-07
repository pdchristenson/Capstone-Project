/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CoordinatesTable from './table';
import MapComponent from './baseMap';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { UseGetSearchCenter } from './hooks/UseGetSearchCenter';
import { handleSearch } from './functions/HandleSearch';
import { handlePictureSearch } from './functions/HandlePictureSearch';

import { toggleImageVisibility } from './functions/ToggleImageVisibilty';
import SearchParamNavbar from './searchParamNavbar';
import Spinner from '../../components/spinner';



const SearchResults = () =>
{
    const isMock = false;
    const [isLoading, setIsLoading] = useState(true);

    const [isTableVisible, setIsTableVisible] = useState(true);
    const [hoveredH3Index, setHoveredH3Index] = useState(null);
    const [hoveredFacility, setHoveredFacility] = useState(null);


    const [hexagonsVisible, setHexagonsVisible] = useState(true);
    const [selectedHexIndex, setSelectedHexIndex] = useState(null);
    const [filters, setFilters] = useState({ tornado: true, earthquake: true });

    const [tornadoData, setTornadoData] = useState([]);
    const [tornadoVisible, setTornadoVisible] = useState(false);

    const [earthquakeData, setEarthquakeData] = useState([]);
    const [earthquakeVisible, setEarthquakeVisible] = useState(false);
    const [geoJsonData, setGeoJsonData] = useState([]);

    const [showSettings, setShowSettings] = useState(false);

    const [showMoreOptions, setShowMoreOptions] = useState(false);

    const toggleMoreOptions = () =>
    {
        setShowMoreOptions(!showMoreOptions);
    }

    const handleHexagonClick = (h3Index) =>
    {
        setSelectedHexIndex(h3Index);
    };

    const toggleSettings = () =>
    {
        setShowSettings(!showSettings);
    };

    const location = useLocation();
    const reqBody = location.state;

    const [newDataset, setNewDataset] = useState(reqBody.dataset);
    const [newFacility, setNewFacility] = useState(reqBody.facility);


    const [searchParams, setSearchParams] = useState({
        dataset: reqBody.dataset,
        facility: reqBody.facility,
        radius: reqBody.radius,
        startDate: reqBody.startDate,
        endDate: reqBody.endDate,
        locations: reqBody.locations.split(', '),
        coordinates: reqBody.coordinates,
    });


    const [searchRadius, setSearchRadius] = useState(reqBody.radius);

    const handleSecondSearch = (newReqBody) =>
    {
        setSearchRadius(newReqBody.radius);
        handleSearch(isMock, setSearchResults, newReqBody, setHoveredH3Index, hoveredH3Index, setTornadoData, setEarthquakeData, setGeoJsonData);
        console.log(geoJsonData)
    };

    const handleUpdateSearchParams = (updatedParams) =>
    {
        setSearchParams(prevParams => ({ ...prevParams, ...updatedParams }));
    };

    const [searchResults, setSearchResults] = useState([]);
    const hexagonData = searchResults.map((result) => result.h3_index);

    const [searchCenter, setSearchCenter] = useState({ lat: 0, lng: 0 });

    const [selectedLocation, setSelectedLocation] = useState(null);



    const handleFacilityHover = (facility) =>
    {
        if (facility && facility.images && facility.images.some(image => image.bbox))
        {
            setHoveredFacility(facility);
        } else
        {
            setHoveredFacility(null);
        }
    };

    const toggleTornadoVisibility = () =>
    {
        setTornadoVisible(!tornadoVisible)
    }

    const toggleEarthquakeVisibility = () =>
    {
        setEarthquakeVisible(!earthquakeVisible)
    }

    const toggleHexagonsVisibility = () =>
    {
        setHexagonsVisible(!hexagonsVisible);
    };

    const handleSaveOptions = () =>
    {
        const searchId = `search-${Date.now()}`;

        const searchOptions = {
            id: searchId,
            ...reqBody
        };

        const savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];

        savedSearches.push(searchOptions);

        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));

    };

    UseGetSearchCenter(searchResults, setSearchCenter);


    const toggleFilter = (type) =>
    {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [type]: !prevFilters[type],
        }));
    };

    useEffect(() =>
    {
        setIsLoading(true);

        const timeoutId = setTimeout(() =>
        {
            setIsLoading(false);
        }, 10000); // 10 second fallback for if it doesn't return

        handleSearch(isMock, setSearchResults, reqBody, setHoveredH3Index, hoveredH3Index, setTornadoData, setEarthquakeData, setGeoJsonData)
            .finally(() =>
            {
                clearTimeout(timeoutId);
                setIsLoading(false);
            });

        return () => clearTimeout(timeoutId);
    }, []);


    const handleRowClick = (latitude, longitude) =>
    {
        setSelectedLocation({ lat: latitude, lng: longitude });
    };

    const resetHexagonFilter = () =>
    {
        setSelectedHexIndex(null);
    };



    return (
        <div className="relative min-h-screen bg-gray-900 text-white" >
            {isLoading && <Spinner />}
            <span className=''>
                <SearchParamNavbar
                    newDataset={newDataset}
                    setNewDataset={setNewDataset}
                    newFacility={newFacility}
                    setNewFacility={setNewFacility}
                    showMoreOptions={showMoreOptions}
                    handleSecondSearch={handleSecondSearch}
                    handleSaveOptions={handleSaveOptions}
                    toggleMoreOptions={toggleMoreOptions}
                    showSettings={showSettings}
                    toggleSettings={toggleSettings}
                    searchParams={searchParams}
                    updateSearchParams={handleUpdateSearchParams}
                    reqBody={reqBody}
                    geoJsonData={geoJsonData}
                />
            </span>

            <div className="absolute inset-0 z-0">
                <MapComponent
                    isTableVisible={isTableVisible}
                    h3Indexes={hexagonData}
                    searchCenter={searchCenter}
                    searchRadius={searchRadius}
                    searchResults={searchResults}
                    selectedLocation={selectedLocation}
                    hexagonsVisible={hexagonsVisible}
                    onHexagonClick={handleHexagonClick}
                    selectedHexIndex={selectedHexIndex}
                    toggleImageVisibility={toggleImageVisibility}
                    hoveredFacility={hoveredFacility}
                    setSearchResults={setSearchResults}
                    tornadoData={tornadoVisible ? tornadoData : []}
                    earthquakeData={earthquakeVisible ? earthquakeData : []}
                />
            </div>
            <div
                className={`absolute top-16 transition-transform duration-300 ${isTableVisible ? "left-0" : "-translate-x-full"
                    } flex items-center`}
                style={{ width: "30%" }}
            >
                <div className="overflow-auto scrollbar-hide" style={{ maxHeight: 'calc(100vh - 4rem)', marginTop: '4.3rem' }}>
                    <CoordinatesTable
                        data={searchResults}
                        onRowClick={handleRowClick}
                        handlePictureSearch={handlePictureSearch}
                        toggleHexagonsVisibility={toggleHexagonsVisibility}
                        selectedHexIndex={selectedHexIndex}
                        resetHexagonFilter={resetHexagonFilter}
                        toggleFilter={toggleFilter}
                        filters={filters}
                        toggleImageVisibility={toggleImageVisibility}
                        onFacilityHover={handleFacilityHover}
                        reqBody={reqBody}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}
                        toggleTornadoVisibility={toggleTornadoVisibility}
                        toggleEarthquakeVisibility={toggleEarthquakeVisibility}
                        showSettings={showSettings}
                        toggleSettings={toggleSettings}
                        selectedLocation={selectedLocation}
                    />
                </div>

                <button
                    onClick={() => setIsTableVisible(!isTableVisible)}
                    className="p-0 bg-gray-800 h-full py-6 "
                >
                    <ChevronLeftIcon className="w-5 h-5 text-white" />
                </button>
            </div>
            {!isTableVisible && (
                <div className="absolute top-16 left-0 flex items-center h-[calc(100vh-4rem)]">
                    <button
                        onClick={() => setIsTableVisible(!isTableVisible)}
                        className="p-0 bg-gray-800  py-6"
                    >
                        <ChevronRightIcon className="w-5 h-5 text-white" />
                    </button>
                </div>
            )}
        </div>

    );
};
export default SearchResults;
