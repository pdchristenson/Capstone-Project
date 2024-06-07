from fastapi import APIRouter, HTTPException
from models.models import Query
from functions.images.convert_to_string import image_to_base64
from dependencies import imagery_service

router = APIRouter()

#below is an example of a query object that can be used to test the /get-image-data endpoint in Swagger
# {
#         "location_name": "(empty)",
#         "facility_type": "airport",
#         "start_date": "2000-01-01",
#         "end_date": "2023-03-07",
#         "latitude": 33.9421514,
#         "longitude": -118.4088321,
#         "radius": 0,
#         "dataset": "NAIP: National Agriculture Imagery Program"
# }
@router.post('/get-image-data')
async def get_image_data(request: Query):
    log_request(request, '/get-image-data')
    try:
        images = imagery_service.get_ee_images(query=request)
        return images
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)



def log_request(request: Query, endpoint: str):
    print(f"Request successfully posted to {endpoint}.\nQuery: {request.to_string()}")