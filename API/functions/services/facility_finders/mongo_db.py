import json
from typing import List
from pymongo.collection import Collection
from functions.services.coordinates import CoordinateFinder
from functions.services.error_handler import ErrorHandler
from interfaces.facilityfinder import FacilityFinder
from config.facility_keys import mongo_facilities
from models.error_types import UnsupportedFacilityError, InternalServiceFailed

 
class MongoDbFacilityFinder(FacilityFinder):
    def __init__(self, collection: Collection, locator: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(locator, error_handler)
        self.collection = collection
    
    def find_facilities(self, latitude: float, longitude: float, facility_type: str, radius: float = 0.0, region: str = None) -> List:
        """
            Queries the MongoDB Atlas database for facilities based on a given set of coordinates or a loaction/region name.
            Needs coordinates or location name, facility type, and search radius. 
        """
        if facility_type not in mongo_facilities:
            e = UnsupportedFacilityError(class_name=self.__class__.__name__, facility_type=facility_type)
            self.error_handler.handle_exception(e)
        
        try:
            if latitude == 0.0 and longitude == 0.0:
                latitude, longitude = self.locator.get_coordinates(region)

            region_coords = [longitude, latitude]
            radius *= 1000 #convert to km
            radius_in_radians = radius/6378100 #approximate earth radius in meters

            if facility_type != 'bridge':
                mongo_query = {
                    'type': facility_type,
                    'location': {
                        '$geoWithin': {
                            '$centerSphere': [region_coords, radius_in_radians]
                        }
                    }
                }
                infrasture_objects = self.collection.find(mongo_query, {'_id': 0})
            elif facility_type == 'bridge':
                pipeline = [
                    {'$match': {
                        'type': facility_type,
                        'location': {'$geoWithin': {'$centerSphere': [region_coords, radius_in_radians]}}
                    }},
                    {'$addFields': {
                        'length_as_number': {'$toDouble': '$length_in_meters'}
                    }},
                    {'$match': {
                        'length_as_number': {'$gt': 250}
                    }},
                    {'$project': {  # Exclude the _id field
                        '_id': 0
                    }}
                ]
                infrasture_objects = self.collection.aggregate(pipeline)

            count = 1
            infrastructure_list = []
            for obj in infrasture_objects:
                print(f"MongoDB Result {count}: {obj.get('name', '(bridge)')}")
                infrastructure_list.append(obj)
                count += 1

            print('\n') 
            return infrastructure_list
        except:
            e =  InternalServiceFailed(class_name=self.__class__.__name__, method_name="collection.find(), collection.aggregate()")
            self.error_handler.handle_exception(e)

    def download_geojson(self, latitude: float, longitude: float, query_type: str, radius: float,  region: str = None):
        """
        Returns the GeoJSON of a specified facility type (query_type) within a given region (or set of coordinates) and radius.
        Is then downloadable on the front end.
        """
        try:
            if latitude == 0.0 and longitude == 0.0:
                latitude, longitude = self.locator.get_coordinates(region)

            region_coords = [longitude, latitude]
            radius *= 1000 #convert to km
            radius_in_radians = radius/6378100 #approximate earth radius in meters

            query = {
                'type': query_type,
                'location': {
                    '$geoWithin': {
                        '$centerSphere': [region_coords, radius_in_radians]
                    }
                }
            }
            projection = {'_id': 0} #exclude obj ID's from mongo
            objects = self.collection.find(query, projection)

            geojson_features = []

            # Iterate through cursor and build GeoJSON features
            for obj in objects:
            # Extract relevant properties for GeoJSON Feature
                properties = {key: value for key, value in obj.items() if key != 'location'}
                geometry = {"type": "Point", "coordinates": obj['location']['coordinates']}

                # Create a GeoJSON feature object
                feature = {"type": "Feature", "properties": properties, "geometry": geometry}

                # Add the feature to the feature collection
                geojson_features.append(feature)

            # Write GeoJSON text to a file
            return json.dumps({"type": "FeatureCollection", "features": geojson_features}, indent=2)
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="collection.find()")
            self.error_handler.handle_exception(e)

    