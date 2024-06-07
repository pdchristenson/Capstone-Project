from fastapi import HTTPException
from typing import List
from interfaces.querywrapper import QueryWrapper
from models.models import Query
from models.error_types import InternalServiceFailed
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder
from interfaces.disaster import NaturalDisaster

class NaturalDisasterQueryWrapper(QueryWrapper):
    def __init__(self, disaster_service: NaturalDisaster, location_service: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(location_service, error_handler)
        self.disaster_service = disaster_service

    def get_data(self, query: Query):
        if query.query_type == 'natural_disaster':
            return self.get_natural_disasters(query)
        else:
            return None
    
    #do we need to check if the query needs geocoding?
    def get_natural_disasters(self, query: Query) -> List:
        """
        Get natural disaster data for a specific location and time period.
        """
        try:
            natural_disasters = self.disaster_service.get_disasters(query.longitude, 
                                                            query.latitude,
                                                            query.radius,
                                                            query.start_date,
                                                            query.end_date,
                                                            query.location_name)
            return natural_disasters
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name='disaster_service()')
            self.error_handler.handle_exception(e)        