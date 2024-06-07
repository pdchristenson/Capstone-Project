from fastapi import APIRouter, HTTPException
from models.models import Query
from models.error_types import ExternalServiceFailed
from nlp.prompt import gemini_nlp
from dependencies import facility_query_service

router = APIRouter()

#below is an example of a query object that can be used to test the /execute-query endpoint in Swagger
# {
#         "location_name": "tuscaloosa", 
#         "facility_type": "airport", 
#         "start_date": "2010-01-01", 
#         "end_date": "2013-01-01", 
#         "latitude": 0.0, 
#         "longitude": 0.0, 
#         "radius": 80.4672, 
#         "dataset": "NAIP: National Agriculture Imagery Program"
# }
@router.post('/execute-query')
async def execute_query(request: Query):
    log_request(request, '/execute-query')
    try:
        result = facility_query_service.get_facilities(query=request) 
        return result
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

#below is an example of a query object that can be used to test the /find-critical-infrastructure endpoint in Swagger
# {
#         "location_name": "tuscaloosa", 
#         "facility_type": "airport", 
#         "start_date": "2010-01-01", 
#         "end_date": "2013-01-01", 
#         "latitude": 0.0, 
#         "longitude": 0.0, 
#         "radius": 80.4672, 
#         "dataset": "NAIP: National Agriculture Imagery Program"
# }
#TODO not used due to slow performance 
@router.post('/find-critical-infrastructure')
async def find_places(request: Query):
    log_request(request, '/find-critical-infrastructure')
    try:
        critical_infrastructure = facility_query_service.get_critical_infrastructure(query=request)
        return critical_infrastructure
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

#below is an example of a query object that can be used to test the /simple-search endpoint in Swagger
#find airports within 50 miles of tuscaloosa from january 1st 2010 to january 1st 2013  
@router.post('/simple-search')
async def simple_search(request: str):
    print(f"Request successfully posted to /simple-search.\nQuery: {request}")
    try:
        search_params = gemini_nlp(request)

        if search_params is None or len(search_params) == 0:
            e = ExternalServiceFailed(class_name=simple_search.__name__, method_name='gemini_nlp()')
            raise HTTPException(status_code=e.status_code, detail=e.detail)

        return search_params
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
def log_request(request: Query, endpoint: str):
    print(f"Request successfully posted to {endpoint}.\nQuery: {request.to_string()}")