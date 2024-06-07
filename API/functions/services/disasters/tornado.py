from typing import List
from pymongo.collection import Collection
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder
from interfaces.disaster import NaturalDisaster
from models.error_types import InternalServiceFailed

class Tornadoes(NaturalDisaster):
    """
    Primary accessor of tornado data in MongoDBAtlas
    """
    def __init__(self, collection: Collection, locator: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(collection, locator, error_handler)
    
    #make sure to handle if location (region) is none
    def get_disasters(self, longitude: float, latitude: float, radius: float, start_date: str, end_date: str, region: str = None) -> List:
        """
        Accesses MongoDB and returns tornadoes that have both start coords and end coords, 
        ignores all with no end coords.
        """
        try:
            if latitude == 0.0 and longitude == 0.0:
                latitude, longitude = self.locator.get_coordinates(region)

            region_coords = [longitude, latitude]
            radius *= 1000 #convert to km
            radius_in_radians = radius/6378100 #approximate earth radius in meters
            
            query = {
                'type': 'tornado',
                'location': {
                    '$geoWithin': {
                        '$centerSphere': [region_coords, radius_in_radians]
                    }
                },
                
                'end_lat': {
                    '$exists': True,  # Ensure end_lat exists
                    '$ne': '0.0',
                    '$ne': '0'    # Ensure end_lat is not 0.0
                },
                'end_lon': {
                    '$exists': True,  # Ensure end_lon exists
                    '$ne': '0.0',
                    '$ne': '0'  # Ensure end_lon is not 0.0
                },
                'date': {  #
                    '$gte': start_date,  # Greater than or equal to start_date
                    '$lte': end_date  # Less than or equal to end_date
                }
            }
            
            tornado_objects = self.collection.find(query)
            tornado_list = []
            for obj in tornado_objects:
                tornado_obj = {
                    'type': obj['type'],
                    'year': obj['year'],
                    'date': obj['date'],
                    'state': obj['state'],
                    'start_lat': obj['start_lat'],
                    'start_lon': obj['start_lon'],
                    'end_lat': obj['end_lat'],
                    'end_lon': obj['end_lon'],
                    'fatalities': obj['fatalities'],
                    'injuries': obj['injuries'],
                    'geometry': obj['location']['coordinates']
                }
                tornado_list.append(tornado_obj)
                
            return tornado_list
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="collection.find()")
            self.error_handler.handle_exception(e)
    
