from geopy.geocoders import OpenCage as oc
from functions.services.error_handler import ErrorHandler
from models.error_types import RequiredParameterError, InternalServiceBadReturnError, InternalServiceFailed

class CoordinateFinder:
    """
    Primary accessor of coordinate data (using OpenCage API).
    """ 
    def __init__(self, geolocator: oc, error_handler: ErrorHandler):
        self.geolocator = geolocator
        self.error_handler = error_handler

    # get coordinates from location string - OpenCage API
        
    def get_coordinates(self, location_name: str) -> tuple[float, float]:
        """
        Get coordinates from OpenCage using location string.
        """
        if location_name is None or location_name == "":    
            e = RequiredParameterError(class_name=self.__class__.__name__, parameter_name="location_name")
            self.error_handler.handle_exception(e)
        
        location = self.geolocator.geocode(location_name)

        if location is None:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="OpenCage.geocode()") 
            self.error_handler.handle_exception(e)

        lat  = float(location.latitude)
        lon = float(location.longitude)

        if lat == 0 and lon == 0:
            e = InternalServiceBadReturnError(class_name=self.__class__.__name__, method_name="OpenCage.geocode()")
            self.error_handler.handle_exception(e)

        return lat, lon