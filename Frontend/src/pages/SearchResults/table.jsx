/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronRightIcon, MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { useCart } from "../../contexts/cartContext";

const CoordinatesTable = ({
    data,
    onRowClick,
    handlePictureSearch,
    toggleHexagonsVisibility,
    selectedHexIndex,
    resetHexagonFilter,
    toggleTornadoVisibility,
    toggleEarthquakeVisibility,
    toggleImageVisibility,
    onFacilityHover,
    reqBody,
    searchResults,
    setSearchResults,
    showSettings,
    toggleSettings,
    selectedLocation
}) =>
{
    const { addToCart, removeFromCart, cartItems } = useCart();
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [selectedFacilityId, setSelectedFacilityId] = useState(null);
    const [imagePreviewsVisible, setImagePreviewsVisible] = useState(false);

    const getFacilityId = (facility) => `${facility.latitude}-${facility.longitude}-${facility.name.replace(/\s+/g, '')}`;

    const handleExpandRow = (facilityId) =>
    {
        const newExpandedRows = new Set(expandedRows);
        newExpandedRows.has(facilityId) ? newExpandedRows.delete(facilityId) : newExpandedRows.add(facilityId);
        setExpandedRows(newExpandedRows);
    };

    useEffect(() =>
    {
        if (selectedLocation)
        {
            const selectedFacility = data.find(facility =>
                facility.latitude === selectedLocation.lat && facility.longitude === selectedLocation.lng
            );
            if (selectedFacility)
            {
                setSelectedFacilityId(getFacilityId(selectedFacility));
            }
        }
    }, [selectedLocation, data]);

    const renderImagePreviews = (result, facilityId) =>
    {
        if (!result.images || result.images.length === 0)
        {
            return null;
        }

        return (
            <div className="flex flex-wrap -m-1">
                {result.images.map((image, imageIndex) =>
                {
                    const cartItemIdentifier = `${facilityId}-${imageIndex}`;
                    const isInCart = cartItems.has(cartItemIdentifier);
                    const tifImage = result.tifs ? result.tifs[imageIndex] : null;

                    return (
                        <div key={imageIndex} className="p-1 relative">
                            <img
                                src={image.url}
                                alt={`Preview ${imageIndex}`}
                                className="object-cover w-12 h-12"
                                onClick={(e) =>
                                {
                                    e.stopPropagation();
                                    toggleImageVisibility(facilityId, imageIndex, searchResults, setSearchResults);
                                }}
                                style={{ border: image.visible ? '2px solid #f3952f' : 'none', padding: image.visible ? '2px' : '4px' }}
                            />
                            <button
                                className={`absolute top-0 right-0 p-1 ${isInCart ? 'bg-red-500' : 'bg-blue-500'} text-white rounded-full`}
                                onClick={(e) =>
                                {
                                    console.log(image);
                                    e.stopPropagation();
                                    if (isInCart)
                                    {
                                        removeFromCart(cartItemIdentifier);
                                    } else
                                    {
                                        addToCart({
                                            id: cartItemIdentifier,
                                            image,
                                            tif: tifImage,
                                            latitude: result.latitude,
                                            longitude: result.longitude
                                        });
                                    }
                                }}
                                style={{ marginTop: '-0.2rem', marginRight: '-0.2rem' }}
                            >
                                {isInCart ? <MinusIcon className="h-2 w-2" /> : <PlusIcon className="h-2 w-2" />}
                            </button>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderFacilityDetails = (result, facilityId) =>
    {
        const hasImages = result.images && result.images.length > 0;
        const showRequestImageryButton = !hasImages;

        return (
            <div className="text-md">
                <div className="flex justify-between">
                    <div>
                        Facility Type: {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        <br />
                        {result.address ? (
                            <>
                                Address: {result.address}
                            </>
                        ) : (
                            <>
                                Coordinates: ({result.latitude.toFixed(4)}, {result.longitude.toFixed(4)})
                            </>
                        )}
                    </div>
                    {showRequestImageryButton && (
                        <button onClick={(e) =>
                        {
                            e.stopPropagation();
                            handlePictureSearch(facilityId, setSearchResults, searchResults, reqBody);
                        }}
                            className="text-blue-500 hover:text-blue-700 px-2">
                            Request Imagery
                        </button>
                    )}
                </div>
                {imagePreviewsVisible && hasImages && (
                    <div className="mt-2">{renderImagePreviews(result, facilityId)}</div>
                )}
            </div>
        );
    };

    const filteredData = selectedHexIndex ? data.filter(x => x.h3_index === selectedHexIndex) : data;

    useEffect(() =>
    {
        const handleClickOutside = (event) =>
        {
            const modal = document.getElementById("settings-modal");
            if (showSettings && modal && !modal.contains(event.target))
            {
                toggleSettings();
            }
        };

        if (showSettings)
        {
            document.addEventListener("mousedown", handleClickOutside);
        } else
        {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSettings, toggleSettings]);

    return (
        <div className="relative overflow-x-auto w-full scrollbar-hide" style={{ paddingTop: '0.5rem', maxHeight: 'calc(100vh - 8.3rem)', overflowY: 'auto' }}>
            <table className="min-w-full leading-normal">
                {showSettings && (
                    <div id="modal-content" className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                        <div id="settings-modal" className="bg-white p-5 rounded-lg shadow-lg text-gray-700">
                            <h3 className="text-xl mb-4">Settings</h3>
                            <div className="flex flex-col">
                                <button onClick={toggleHexagonsVisibility} className="flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white">Toggle Hexagons</button>
                                <button onClick={toggleTornadoVisibility} className="mt-4 flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white">Toggle Tornadoes</button>
                                <button onClick={toggleEarthquakeVisibility} className="mt-4 flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white">Toggle Earthquakes</button>
                                <button onClick={resetHexagonFilter} className="mt-4 flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white">Reset Filter</button>
                                <button onClick={() => setImagePreviewsVisible(prev => !prev)} className="mt-4 flex items-center justify-center px-4 rounded-full bg-blue-800 hover:bg-blue-700 focus:outline-none text-white">
                                    {imagePreviewsVisible ? 'Hide Image Previews' : 'Show Image Previews'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <tbody className="text-white">
                    {filteredData.map((result) =>
                    {
                        const facilityId = getFacilityId(result);
                        const isSelected = facilityId === selectedFacilityId;
                        return (
                            <React.Fragment key={facilityId}>
                                <tr
                                    className={`border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${isSelected ? 'text-orange-500' : ''}`}
                                    onClick={() => onRowClick(result.latitude, result.longitude)}
                                    onMouseEnter={() => onFacilityHover(result)}
                                    onMouseLeave={() => onFacilityHover(null)}>
                                    <td className="px-5 py-2 bg-gray-800">{result.name}</td>
                                    <td className="px-5 py-2 bg-gray-800 text-right relative">
                                        <div className="inline-block relative">
                                            <button onClick={(e) => { e.stopPropagation(); handleExpandRow(facilityId); }}
                                                className="text-blue-500 hover:text-blue-700 relative z-10">
                                                {expandedRows.has(facilityId) ? <ChevronDownIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
                                            </button>
                                            {result?.images?.length > 0 && (
                                                <span className="absolute top-0 right-0 z-10 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                                                    {result?.images?.length}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                                {expandedRows.has(facilityId) && (
                                    <tr className="border-b border-gray-700 bg-gray-700">
                                        <td colSpan="3" className="px-5 py-2">
                                            <div className="text-md">
                                                <div className="mt-2 flex flex-wrap">{renderFacilityDetails(result, facilityId)}</div>
                                                {/* {
                                                    imagePreviewsVisible && result?.images.length > 0 &&
                                                } */}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default CoordinatesTable;