from abc import ABC, abstractmethod
from typing import List
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder

class FacilityFinder(ABC):
    def __init__(self, locator: CoordinateFinder, error_handler: ErrorHandler):
        self.error_handler = error_handler
        self.locator = locator
        
    @abstractmethod
    def find_facilities(self, latitude: float, longitude: float, facility_type: str, radius: float, region: str = None) -> List:
        pass