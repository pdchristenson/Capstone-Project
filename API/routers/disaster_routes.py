from fastapi import APIRouter, HTTPException
from models.models import Query
from dependencies import tornado_finder_service, earthquake_finder_service

router = APIRouter()

#below is an example of a query object that can be used to test the /find-tornadoes endpoint in Swagger
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
@router.post('/find-tornadoes')
async def find_tornadoes(request: Query):
    log_request(request, '/find-tornadoes')
    try:
        tornadoes = tornado_finder_service.get_natural_disasters(query=request)
        return tornadoes
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

#let's put an example query object here for users to test in Swagger
# {
#         "location_name": "los angeles",
#         "facility_type": "airport",
#         "start_date": "2000-01-01",
#         "end_date": "2023-03-07",
#         "latitude": 0.0,
#         "longitude": 0.0,
#         "radius": 100.0,
#         "dataset": "NAIP: National Agriculture Imagery Program"
# }
@router.post('/find-earthquakes')
async def find_earthquakes(request: Query):
    log_request(request, '/find-earthquakes')
    try:
        earthquakes = earthquake_finder_service.get_natural_disasters(query =request)
        return earthquakes
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

#TODO not used
@router.post('/find-disasters')
async def find_disasters(request: Query):
    log_request(request, '/find-disasters')
    try:
        earthquakes = earthquake_finder_service.get_natural_disasters(query= request)
        tornadoes = tornado_finder_service.get_natural_disasters(query=request)

        disasters = {
            'earthquakes': earthquakes,
            'tornadoes': tornadoes
        }

        return disasters
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
def log_request(request: Query, endpoint: str):
    print(f"Request successfully posted to {endpoint}.\nQuery: {request.to_string()}")