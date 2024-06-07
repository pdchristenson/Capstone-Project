from typing import List, Dict, Any

from models.models import Query
from models.error_types import UnsupportedFacilityError, InternalServiceFailed
from interfaces.querywrapper import QueryWrapper
from functions.services.error_handler import ErrorHandler
from functions.services.facility_finders.osm import OSMFacilityFinder
from functions.services.facility_finders.mongo_db import MongoDbFacilityFinder
from functions.services.coordinates import CoordinateFinder
from functions.footprints.polygon import get_polygon
from config.facility_keys import mongo_facilities

class FacilityQueryWrapper(QueryWrapper):
    def __init__(self, location_service: CoordinateFinder, 
                 osm_facility_service: OSMFacilityFinder, 
                 mongo_facility_service: MongoDbFacilityFinder, 
                 error_handler: ErrorHandler):
        super().__init__(location_service, error_handler)
        self.osm_facility_service = osm_facility_service
        self.mongo_facility_service = mongo_facility_service
        
    def get_data(self, query: Query):
        if query.query_type == 'facility':
            return self.get_facilities(query)
        elif query.query_type == 'critical_infrastructure':
            return self.get_critical_infrastructure(query)
        elif query.query_type == 'polygon':
            return self.get_polygons(query)
        else:
            return None
        
    
    def get_facilities(self, query: Query) -> List:
        """
        Queries OSM for specific facilities using Overpass API and returns in dict form.
        Can add capability for more facilities by updating key:value pairs in facility_keys.py
        """
        if query.needs_geocoding():
            query.latitude, query.longitude = self.location_service.get_coordinates(location_name=query.location_name)

        try:
            result: List[Dict[str, Any]] = self.osm_facility_service.find_facilities(latitude=query.latitude, 
                                                                 longitude=query.longitude, 
                                                                 facility_type=query.facility_type, 
                                                                 radius=query.radius)
            
            responses = []
            for facility in result:
                response = {
                    'type': query.facility_type,
                    'name': facility['name'], 
                    'latitude': facility['latitude'], 
                    'longitude': facility['longitude'], 
                    'h3_index': facility['h3_index'],
                    "address": facility["address"]
                }
                responses.append(response)

            return responses
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name='osm_facility_service()')
            self.error_handler.handle_exception(e)

    def get_critical_infrastructure(self, query: Query) -> List:
        """
        Queries OSM and MongoDB for multiple types of facilities, all of which are considered critical infrastructure.
        """
        if query.needs_geocoding():
            query.latitude, query.longitude = self.location_service.get_coordinates(location_name=query.location_name)

        try:
            results = []

            osm_facilities = ['port', 'train station']
            for facility in osm_facilities:
                print('The following results are for: ',facility)
                results.append(self.osm_facility_service.find_facilities(latitude=query.latitude, 
                                                                        longitude=query.longitude, 
                                                                        facility_type=facility, 
                                                                        radius=query.radius))
                
            for facility in mongo_facilities:
                print('The following results are for: ',facility)
                results.append(self.mongo_facility_service.find_facilities(latitude=query.latitude, 
                                                                          longitude=query.longitude, 
                                                                          facility_type=facility, 
                                                                          radius=query.radius, 
                                                                          region=query.location_name))
            
            return results
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name='osm_facility_service(), mongo_facility_service')
            self.error_handler.handle_exception(e)

    # returns polygon coords as well as h3 index
    #TODO not used
    def get_polygons(self, query: Query) -> List:
        if query.needs_geocoding():
            query.latitude, query.longitude = self.location_service.get_coordinates(location_name=query.location_name)

        try:
            response = get_polygon(lat=query.latitude, 
                                   lon=query.longitude, 
                                   radius=query.radius)
            return response
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name='get_polygon()')
            self.error_handler.handle_exception(e)

    def get_geoJSON_data(self, query: Query):
        try: 
            response = self.mongo_facility_service.download_geojson(latitude=query.latitude, 
                                                                    longitude=query.longitude, 
                                                                    query_type=query.query_type, 
                                                                    radius=query.radius, 
                                                                    region=query.location_name)
            return response
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name='download_geojson()')
            self.error_handler.handle_exception(e)