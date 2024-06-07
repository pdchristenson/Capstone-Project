/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import Dropdown from '../../components/dropdown';
import { facilityTypes } from '../../constants/facilityTypes';
import { datasets } from '../../constants/datasets';
import { DatabaseIcon, OfficeBuildingIcon, SaveIcon, CogIcon, AdjustmentsIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';
import DateRangePicker from '../AdvancedSearch/dateRangePicker';
import Input from '../../components/input';
import LocationPicker from '../AdvancedSearch/locationPicker';

const SearchParamNavbar = ({
    newDataset, setNewDataset, newFacility, setNewFacility, handleSecondSearch,
    handleSaveOptions, toggleMoreOptions, toggleSettings, showMoreOptions,
    reqBody, geoJsonData
}) =>
{
    const [dataset, setDataset] = useState('');
    const [facilityType, setFacilityType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [radius, setRadius] = useState('');
    const [locationName, setLocationName] = useState(reqBody?.locations?.split(', ') || '');
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });

    const moreOptionsRef = useRef();


    const handleLocationSelect = (locations) =>
    {
        const locationString = locations.join(', ');
        setLocationName(locationString);
    };

    const handleCoordinatesSelect = (coords) =>
    {
        setCoordinates(coords);
    };


    const downloadGeoJson = () =>
    {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoJsonData));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "geoData.json");
        document.body.appendChild(downloadAnchorNode); // required for Firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    const handleSearchClick = () =>
    {
        // dataset: reqBody.dataset,
        // location_name: reqBody.locations,
        // facility_type: reqBody.facility,
        // start_date: dayjs(reqBody.startDate).format("YYYY-MM-DD"),
        // end_date: dayjs(reqBody.endDate).format("YYYY-MM-DD"),
        // radius: reqBody.radius,
        // longitude: reqBody?.coordinates?.longitude,
        // latitude: reqBody?.coordinates?.latitude,

        // console.log(dataset, newDataset, reqBody)

        const updatedReqBody = {
            dataset: dataset,
            locations: locationName,
            facility: facilityType || newFacility,
            startDate: startDate,
            endDate: endDate,
            radius: radius,
            coordinates: {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude
            }
        };

        reqBody.dataset = dataset;
        // reqBody.locations = locationName;
        reqBody.facility = facilityType || newFacility;
        reqBody.startDate = startDate;
        reqBody.endDate = endDate;
        reqBody.radius = radius;



        console.log(updatedReqBody);

        handleSecondSearch(updatedReqBody);
    };

    useEffect(() =>
    {
        if (reqBody)
        {
            setDataset(newDataset || reqBody.dataset);
            setFacilityType(newFacility || reqBody.facility_type);
            setStartDate(reqBody.startDate || '2000-01-01');
            setEndDate(reqBody.endDate || '2024-01-01');
            setRadius(reqBody.radius || 25);
            setLocationName(reqBody.locations || '');
            setCoordinates({
                latitude: reqBody.latitude || 0,
                longitude: reqBody.longitude || 0
            });
        }
    }, [reqBody, newDataset, newFacility]);

    useEffect(() =>
    {
        const handleClickOutside = (event) =>
        {
            if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target))
            {
                toggleMoreOptions(false);
            }
        };

        if (showMoreOptions)
        {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () =>
        {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showMoreOptions, toggleMoreOptions]);

    return (
        <div className="absolute top-0 left-0 right-0 z-10 flex p-3 bg-gray-800" style={{ marginTop: '4.5rem' }}>
            <button onClick={toggleSettings} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 mr-auto">
                <CogIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
            <Dropdown options={datasets} selected={dataset} onSelect={setDataset} icon={DatabaseIcon} label="Dataset" />
            <span className='ml-4'>
                <Dropdown options={facilityTypes} selected={facilityType} onSelect={setFacilityType} icon={OfficeBuildingIcon} allowFreeform={true} placeholder='Facility Type' />
            </span>
            <button onClick={toggleMoreOptions} className="ml-4 border border-gray-300 rounded-md shadow-sm bg-gray-800 text-white flex justify-between items-center">
                More Options
                <ChevronDownIcon className="w-5 h-5 ml-2" />
            </button>
            <button onClick={handleSearchClick} className="flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white ml-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
            </button>
            <button onClick={downloadGeoJson} className="flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white ml-5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 mr-2">
                    <path fillRule="evenodd" d="M4 3a1 1 0 00-1 1v11a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H4zm2 8a1 1 0 112 0v2a1 1 0 11-2 0v-2zm3-4a1 1 0 100 2 1 1 0 000-2zm3 4a1 1 0 112 0v2a1 1 0 11-2 0v-2zm3-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                </svg>
                Download GeoJSON
            </button>
            <button onClick={handleSaveOptions} className="flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white ml-5">
                <SaveIcon className="h-5 w-5 text-white mr-2" />
                Save Options
            </button>
            {
                showMoreOptions && (
                    <div
                        ref={moreOptionsRef}
                        className="absolute right-0 mt-14 mr-20 bg-gray-700 shadow-lg z-50 rounded-md overflow-hidden transition-opacity duration-300 ease-out"
                        style={{ width: '60%', maxWidth: '1000px' }}
                    >
                        <div className="px-10 py-6">
                            <DateRangePicker label="Start Date" defaultValue={reqBody.startDate} onChange={setStartDate} />
                            <DateRangePicker label="End Date" defaultValue={reqBody.endDate} onChange={setEndDate} />
                            <div className='max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg'>
                                <LocationPicker onSelectLocations={handleLocationSelect} onSelectCoordinates={handleCoordinatesSelect} initialLocations={locationName.locations?.split(', ')} />
                            </div>
                            <Input type='text' value={radius.toString()} onChange={(e) => setRadius(e.target.value)} icon={AdjustmentsIcon} placeholder='Search Radius' unit='km' />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default SearchParamNavbar;