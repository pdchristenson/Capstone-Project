export const handleNLP = async (query, setNlpResults) =>
{
    try
    {
        console.log(query)
        let searchUrl = new URL("http://localhost:8000/simple-search");
        searchUrl.searchParams.append("request", query.searchQuery);

        const searchResponse = await fetch(searchUrl, {
            method: "POST",
            headers: { "Accept": "application/json" },
        });

        const searchResults = await searchResponse.json();
        if (searchResponse.ok)
        {
            setNlpResults(searchResults);
        } else
        {
            console.error("Server responded with an error:", searchResults.detail);
        }
    } catch (error)
    {
        console.error("Error:", error);
    }
};
