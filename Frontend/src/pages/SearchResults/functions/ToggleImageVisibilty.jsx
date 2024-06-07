export const toggleImageVisibility = (facilityId, imageIndex, searchResults, setSearchResults) =>
{
    const updatedResults = searchResults.map((facility) =>
    {
        const currentFacilityId = `${facility.latitude}-${facility.longitude}-${facility.name.replace(/\s+/g, '')}`;
        if (currentFacilityId === facilityId)
        {
            const updatedImages = facility.images.map((image, idx) => ({
                ...image,
                visible: idx === imageIndex ? !image.visible : false,
            }));
            return { ...facility, images: updatedImages };
        }
        return facility;
    });

    setSearchResults(updatedResults);
};