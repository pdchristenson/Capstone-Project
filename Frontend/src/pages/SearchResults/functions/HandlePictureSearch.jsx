

export const handlePictureSearch = async (facilityId, setSearchResults, searchResults, reqBody) =>
{
    const currentItem = searchResults.find(item => `${item.latitude}-${item.longitude}-${item.name.replace(/\s+/g, '')}` === facilityId);
    if (currentItem)
    {
        try
        {
            const response = await fetch('http://localhost:8000/get-image-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: currentItem.latitude,
                    longitude: currentItem.longitude,
                    start_date: reqBody.startDate,
                    end_date: reqBody.endDate,
                    dataset: reqBody.dataset,
                    locations: reqBody.locations,
                    facility_type: reqBody.facility,
                }),
            });
            const data = await response.json();
            if (data && data.urls)
            {
                setSearchResults(currentResults =>
                    currentResults.map((item) =>
                        item.facilityId === facilityId ? {
                            ...item,
                            images: data.urls.map((url) => ({
                                url,
                                bbox: data.bbox,
                                visible: false
                            })),
                            tifs: data.download_url.map((url) => ({
                                url
                            }))
                        } : item
                    )
                );
            }
        } catch (error)
        {
            console.error('Failed to fetch image data:', error);
        }
    }
}