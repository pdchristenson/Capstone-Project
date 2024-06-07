from typing import List
from pymongo.collection import Collection
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder
from interfaces.disaster import NaturalDisaster
from models.error_types import InternalServiceFailed

class Earthquakes(NaturalDisaster):
    """
    Primary accessor of earthquake data in MongoDBAtlas
    """
    def __init__(self, collection: Collection, locator: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(collection, locator, error_handler)
    
    def get_disasters(self, longitude: float, latitude: float, radius: float, start_date: str, end_date: str, region: str = None) -> List:
        """
        Accesses MongoDB and returns major earthquakes (magnitude of 5.5 or greater);
        due to 5.5 being the approximated magnitude of beginning to cause damage to 
        buildings and various critical infrastructure, from 2000-01-01 -> 2024-03-25,
        that have coordinates within a specified radius and date range.
        """
        try:
            if latitude == 0.0 and longitude == 0.0:
                latitude, longitude = self.locator.get_coordinates(region)

            region_coords = [longitude, latitude]
            radius *= 1000 #convert to km
            radius_in_radians = radius/6378100 #approximate earth radius in meters
            
            query = {
                'type': 'earthquake',
                'location': {
                    '$geoWithin': {
                        '$centerSphere': [region_coords, radius_in_radians]
                    }
                },
                'date': {  #
                    '$gte': start_date,  # Greater than or equal to start_date
                    '$lte': end_date  # Less than or equal to end_date
                }
            }
            
            earthquake_objects = self.collection.find(query)
            earthquake_list = []
            for obj in earthquake_objects:
                earthquake_obj = {
                    'type': obj['type'],
                    'date': obj['date'],
                    'time': obj['time'],
                    'region': obj['region'],
                    'epicenter_latitude': obj['location']['coordinates'][1],
                    'epicenter_longitude': obj['location']['coordinates'][0],
                    'magnitude': obj['magnitude'],
                    'magnitude_type': obj['magnitudeType']
                }
                earthquake_list.append(earthquake_obj)
                
            return earthquake_list
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="collection.find()")
            self.error_handler.handle_exception(e)
