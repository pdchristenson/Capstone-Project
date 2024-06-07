import os
from enum import Enum
from models.error_types import EnvironmentVariableNotFoundError
from functions.services.error_handler import ErrorHandler
from dotenv import load_dotenv

class EnvironmentVariable(Enum):
    OC_KEY = 'oc_key'
    CLOUD_PROJECT_ID = 'cloud_project_id'
    MONGO_URI = 'mongo_uri'
    DATABASE = 'database'
    COLLECTION = 'collection'
    GEMINI = 'gemini_key'


class EnvironmentAccessor:
    """
    Primary accessor of environment variables, which can be used to instantiate API services.
    """
    #TODO can probably get rid of M2M stuff for now, I doubt we have time to implement it
    def __init__(self, error_handler: ErrorHandler):
        self.error_handler = error_handler
        self.keys = {}

        load_dotenv()

        for key in (var.value for var in EnvironmentVariable):
            value = os.getenv(key)
            if value is None:
                e = EnvironmentVariableNotFoundError(class_name=self.__class__.__name__, variable_name=key)
                self.error_handler.handle_exception(e=e)
            self.keys[key] = value

        #set the google cloud project id
        os.environ["GOOGLE_CLOUD_PROJECT"] = self.keys[EnvironmentVariable.CLOUD_PROJECT_ID.value]

    def get_key(self, key: str) -> str:
        return self.keys[key]