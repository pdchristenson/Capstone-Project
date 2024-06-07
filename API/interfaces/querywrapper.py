from abc import ABC, abstractmethod
from typing import List
from models.models import Query
from functions.services.error_handler import ErrorHandler
from functions.services.coordinates import CoordinateFinder

class QueryWrapper(ABC):
    def __init__(self, location_service: CoordinateFinder, error_handler: ErrorHandler):
        self.error_handler = error_handler
        self.location_service = location_service

    @abstractmethod
    def get_data(self, query: Query):
        pass