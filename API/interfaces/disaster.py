from typing import List
from abc import ABC, abstractmethod
from pymongo.collection import Collection
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder

class NaturalDisaster(ABC):
    def __init__(self, collection: Collection, locator: CoordinateFinder, error_handler: ErrorHandler):
        self.error_handler = error_handler
        self.collection = collection
        self.locator = locator
    
    @abstractmethod
    def get_disasters(self, longitude: float, latitude: float, radius: float, start_date: str, end_date: str, region: str = None) -> List:
        pass