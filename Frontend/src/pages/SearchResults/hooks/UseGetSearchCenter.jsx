import { useEffect } from 'react';

export const UseGetSearchCenter = (searchResults, setSearchCenter) =>
{

    useEffect(() =>
    {
        if (searchResults.length > 0)
        {
            const { lat, lng } = searchResults.reduce((acc, { latitude, longitude }) => ({
                lat: acc.lat + latitude,
                lng: acc.lng + longitude,
            }), { lat: 0, lng: 0 });

            const center = { lat: lat / searchResults.length, lng: lng / searchResults.length };
            setSearchCenter(center);
        }
    }, [searchResults, setSearchCenter]);

};