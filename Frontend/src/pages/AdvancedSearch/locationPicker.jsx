/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { XIcon, LocationMarkerIcon, GlobeAltIcon } from '@heroicons/react/outline';

const LocationPicker = ({ onSelectLocations, onSelectCoordinates, initialLocations, initialCoordinates }) =>
{
    const [inputValue, setInputValue] = useState('');
    const [locations, setLocations] = useState([]);
    const [useCoordinates, setUseCoordinates] = useState(false);
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const inputRef = useRef(null);

    useEffect(() =>
    {
        if (initialLocations && initialLocations.length > 0)
        {
            setLocations(initialLocations);
            setUseCoordinates(false);
        } else if (initialCoordinates && (initialCoordinates.longitude || initialCoordinates.latitude))
        {
            setLongitude(initialCoordinates.longitude);
            setLatitude(initialCoordinates.latitude);
            setUseCoordinates(true);
        }
    }, [initialLocations, initialCoordinates]);

    const toggleCoordinates = () =>
    {
        setUseCoordinates(!useCoordinates);
        if (!useCoordinates)
        {
            setLocations([]);
            onSelectLocations([]);
        } else
        {
            onSelectCoordinates(null, null);
        }
    };

    const handleInputChange = (event) =>
    {
        setInputValue(event.target.value);
    };

    const handleCoordinateChange = () =>
    {
        onSelectCoordinates({ longitude: longitude, latitude: latitude });
    };

    const handleInputKeyDown = (event) =>
    {
        if (event.key === 'Enter' && inputValue.trim() !== '' && !useCoordinates)
        {
            event.preventDefault();
            const newLocations = [...locations, inputValue.trim()];
            setLocations(newLocations);
            onSelectLocations(newLocations);
            setInputValue('');
        } else if (event.key === 'Backspace' && inputValue.trim() === '' && locations.length > 0 && !useCoordinates)
        {
            const newLocations = locations.slice(0, -1);
            setLocations(newLocations);
            onSelectLocations(newLocations);
        }
    };

    const handleDeleteLocation = (indexToDelete) =>
    {
        const newLocations = locations.filter((_, index) => index !== indexToDelete);
        setLocations(newLocations);
        onSelectLocations(newLocations);
    };

    return (
        <div className="relative w-full" ref={inputRef}>
            <div className="flex items-center mb-2">
                <button
                    onClick={toggleCoordinates}
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
                    title={useCoordinates ? "Switch to location input" : "Switch to coordinates input"}
                >
                    <GlobeAltIcon className={`w-5 h-5 ${useCoordinates ? 'text-blue-500' : 'text-gray-400'}`} />
                </button>
                <span className="ml-2 text-white">{useCoordinates ? 'Enter Coordinates' : 'Enter Locations'}</span>
            </div>

            {useCoordinates ? (
                <div className="flex space-x-2">
                    <div className="w-1/2">
                        <label className="block text-white text-sm font-bold mb-2">Longitude</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) =>
                            {
                                setLongitude(e.target.value)
                                handleCoordinateChange()
                            }
                            }
                            className="bg-gray-800 text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            placeholder="Enter longitude..."
                        />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-white text-sm font-bold mb-2">Latitude</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) =>
                            {
                                setLatitude(e.target.value)
                                handleCoordinateChange()
                            }
                            } className="bg-gray-800 text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            placeholder="Enter latitude..."
                        />
                    </div>
                </div>
            ) : (
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-gray-800 p-1 hover:border-midgard-orange" style={{ minHeight: '2.5rem', alignItems: 'flex-start' }}>
                    <div className="flex items-center flex-grow">
                        <LocationMarkerIcon className="w-5 h-5 text-white mr-2 ml-2" />
                        {locations.map((location, index) => (
                            <div key={index} className="flex items-center bg-gray-500 text-white text-xs font-medium px-2 py-0.5 my-1 rounded-full ml-1">
                                {location}
                                <button onClick={() => handleDeleteLocation(index)} className="flex items-center justify-center bg-transparent p-0.5 rounded-full ml-1 hover:bg-blue-500">
                                    <XIcon className="w-3 h-3 text-white" />
                                </button>
                            </div>
                        ))}

                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Enter location and press Enter..."
                            className="bg-transparent text-white focus:outline-none p-1"
                            style={{ flex: '1', minWidth: '6rem' }}
                            disabled={useCoordinates}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;