from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from io import BytesIO
from models.models import Query
from dependencies import facility_query_service

router = APIRouter()

#below is an example of a query object that can be used to test the /get-image-data endpoint in Swagger
# {
#         "location_name": "tuscaloosa", 
#         "facility_type": "airport", 
#         "start_date": "2010-01-01", 
#         "end_date": "2013-01-01", 
#         "latitude": 0.0, 
#         "longitude": 0.0, 
#         "radius": 80.4672, 
#         "dataset": "NAIP: National Agriculture Imagery Program",
#         "query_type": "airport" 
# }
@router.post("/download-geojson")
async def download_geojson(request: Query):
    log_request(request, "/download-geojson")
    try:
        geojson_content = facility_query_service.get_geoJSON_data(request)

        # Convert the GeoJSON string to bytes
        geojson_bytes = geojson_content.encode()

        # Create a streaming response, setting the filename and media type
        return StreamingResponse(BytesIO(geojson_bytes), media_type="application/geo+json", headers={"Content-Disposition": 'attachment; filename="data.geojson"'})
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
def log_request(request: Query, endpoint: str):
    print(f"Request successfully posted to {endpoint}.\nQuery: {request.to_string()}")