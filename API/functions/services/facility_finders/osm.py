import requests
from typing import List
from config.facility_keys import facility_tags
from functions.footprints.h3index import get_h3_index
from functions.services.coordinates import CoordinateFinder
from functions.services.error_handler import ErrorHandler
from interfaces.facilityfinder import FacilityFinder
from models.error_types import InternalServiceFailed, UnsupportedFacilityError

class OSMFacilityFinder(FacilityFinder): 
    """
    Primary accessor of facility data (using location services, Overpass, and Google Maps API).
    """
    def __init__(self, locator: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(locator, error_handler)
    
    #returns address of facility and facility name 
    def find_facilities(self, latitude: float, longitude: float, facility_type: str, radius: float = 0.0, region: str = None) -> List:
        """
        Find facilities using Overpass API and Overpass Query language. OSM key/values are in the config and can be updated 
        for a wide variety of facilities.
        """
        if facility_type not in facility_tags:
            e = UnsupportedFacilityError(class_name=self.__class__.__name__, facility_type=facility_type)
            self.error_handler.handle_exception(e)

        if radius == 0.0:
                radius = 10
        radius *= 1000

        print(f'Searching for {facility_type} within {radius} meters of {latitude}, {longitude}...\n')

        try: 
            #overpass query
            osm_key, osm_value = facility_tags[facility_type]
            overpass_url = "http://overpass-api.de/api/interpreter"
            overpass_query = f"""
            [out:json];
            (
            node["{osm_key}"="{osm_value}"](around:{radius},{latitude},{longitude});
            way["{osm_key}"="{osm_value}"](around:{radius},{latitude},{longitude});
            rel["{osm_key}"="{osm_value}"](around:{radius},{latitude},{longitude});
            );
            out center;
            """
            
            #currently, this method returns Turin Italy if the query fails
            response = requests.get(overpass_url, params={'data': overpass_query})  
            data = response.json()

            count = 1
            facilities = []
            for element in data['elements']:
                # Depending on the type of element, the coordinates are in different places
                if element['type'] == 'node':
                    lat = float(element['lat'])
                    lon = float(element['lon'])
                elif element['type'] == 'way':
                    lat = float(element['center']['lat'])
                    lon = float(element['center']['lon'])
                elif element['type'] == 'relation':
                    lat = float(element['center']['lat'])
                    lon = float(element['center']['lon'])
                else:
                    lat, lon = 0, 0 #TODO This may be where location errors originate

                h3_index = get_h3_index(lat=lat, lon=lon, radius=radius)

                #assuming the frontend needs the h3 index, otherwise comment out the following three lines
                if h3_index == -1:
                    e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="get_h3_index")
                    self.error_handler.handle_exception(e)

                tags = element.get('tags', {})

                address_parts = [
                    tags.get('addr:housenumber', ''),
                    tags.get('addr:street', ''),
                    tags.get('addr:city', ''),
                    tags.get('addr:state', ''),
                    tags.get('addr:postcode', '')
                ]
                address = ' '.join(part for part in address_parts if part)

                facility_info = {
                    'type': facility_type,
                    'name': element.get('tags', {}).get('name', 'N/A'),
                    'latitude': lat,
                    'longitude': lon,
                    'h3_index': h3_index,
                    'address': address
                }
                print(f'OSM Result {count}: {facility_info["name"]}')

                facilities.append(facility_info)
                count += 1

            print('\n')
            return facilities 
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="requests.get()")
            self.error_handler.handle_exception(e)