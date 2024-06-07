from dependencies import genai

def gemini_nlp(query: str): 
    """
    Sends a query to Google Gemini-Pro API to paramaterize the user NLP search on simple search page
    Returns a JSON object with information about the query, which then auto populates on the advanced search page.
    Can refine prompt if needed.
    """
    model = genai.GenerativeModel('gemini-pro')


    prompt = f'Please catergorize the following query and determine what type of facility the user is searching for (power plant, airport, port, train station, critical facilities), etc., '\
    f'the span of dates in which they are searching through (default to 2000-01-01 as the start and todays date as the end date), an approximate radius in kilometers (if it is given not in '\
    f'kilometers, miles for example, do the conversion to kilometers and return radius in kilometers) they are trying to search'\
    f'whether they are searching for natural diasters, and the general location they are searching around. Return the results in a json object where there is a value for'\
    f'radius, start_date, end_date, location_name, facility_type, and what type of natural disaster if any they are searching for. Do not include any comments, '\
    f'Do not include any preceding or trailing words to the JSON object. Here is the query : {query}'
    response = model.generate_content(prompt)

    cleaned_response = response.text.strip("`")
    return cleaned_response