import dayjs from "dayjs";
import { MOCKDATA } from "../../../constants/mockTable"

export const handleSearch = async (isMock, setSearchResults, reqBody, setHoveredH3Index, hoveredH3Index, setTornadoData, setEarthquakeData, setGeoJsonData) =>
{
    try
    {
        if (isMock)
        {
            setSearchResults(MOCKDATA);
            return;
        } else
        {
            let searchUrl = "http://localhost:8000/execute-query";
            let tornadoUrl = "http://localhost:8000/find-tornadoes";
            let earthquakeUrl = "http://localhost:8000/find-earthquakes";
            let geoJsonUrl = "http://localhost:8000/download-geojson";

            let searchBody = JSON.stringify({
                dataset: reqBody.dataset,
                location_name: reqBody.locations,
                facility_type: reqBody.facility,
                start_date: dayjs(reqBody.startDate).format("YYYY-MM-DD"),
                end_date: dayjs(reqBody.endDate).format("YYYY-MM-DD"),
                radius: reqBody.radius,
                longitude: reqBody?.coordinates?.longitude,
                latitude: reqBody?.coordinates?.latitude,
            });

            const [searchResponse] = await Promise.all([
                fetch(searchUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: searchBody,
                })
            ]);


            fetch(tornadoUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: searchBody,
            }).then((response) => response.json()).then((data) =>
            {
                setTornadoData(data);
            });

            fetch(earthquakeUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: searchBody,
            }).then((response) => response.json()).then((data) =>
            {
                setEarthquakeData(data);
            });

            const newBody = {
                ...JSON.parse(searchBody),
                query_type: searchBody.facility_type
            }


            newBody.query_type = newBody.facility_type;
            console.log(searchBody)

            console.log(newBody)
            fetch(geoJsonUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newBody),
            }).then((response) => response.json()).then((data) =>
            {
                setGeoJsonData(data);
            });



            const searchResults = await searchResponse.json();
            if (searchResponse.ok)
            {
                const processedData = searchResults.map(item => (
                    {
                        ...item,
                        facilityId: `${item.latitude}-${item.longitude}-${item.name.replace(/\s+/g, '')}`
                    }
                ))

                setSearchResults(processedData);
            }

            // const tornadoResults = await tornadoResponse.json();

        }
    } catch (error)
    {
        console.error("Error:", error);
        setSearchResults([]);
        // setTornadoData([]); // Reset tornado data on error
    }
};