#GIS packages
import ee
from geopy.geocoders import OpenCage as oc

#mongo db
from pymongo.mongo_client import MongoClient

#nlp
from google import generativeai as genai

#error handling
from functions.services.error_handler import ErrorHandler as EH
from models.error_types import ExternalServiceConnectionFailedError, InternalServiceConnectionFailedError

#config vars
from config.accessor import EnvironmentAccessor, EnvironmentVariable
from config.ansi_colors import COLORS

#custom code
from functions.services.query_wrappers.facility import FacilityQueryWrapper
from functions.services.query_wrappers.natural_disaster import NaturalDisasterQueryWrapper
from functions.services.query_wrappers.image import ImageQueryWrapper
from functions.services.facility_finders.mongo_db import MongoDbFacilityFinder
from functions.services.facility_finders.osm import OSMFacilityFinder
from functions.services.coordinates import CoordinateFinder
from functions.services.disasters.tornado import Tornadoes
from functions.services.disasters.earthquake import Earthquakes



#initialize error handler
error_handler = EH()

#load environment variables
accessor = EnvironmentAccessor(error_handler=error_handler)

#initialize external services
#earth engine
try:
    ee.Initialize(project=accessor.get_key(EnvironmentVariable.CLOUD_PROJECT_ID.value))
except (ee.EEException, Exception) as e:
    print(f"{COLORS['yellow']}Earth Engine initialization failed, attempting to authenticate...{COLORS['reset']}")
    ee.Authenticate()

try:
    ee.Initialize(project=accessor.get_key(EnvironmentVariable.CLOUD_PROJECT_ID.value))
except:
    error_handler.handle_exception(ExternalServiceConnectionFailedError(class_name="Earth Engine"))

#open cage geocoder
try:
    geolocator = oc(api_key=accessor.get_key(EnvironmentVariable.OC_KEY.value))
except:
    error_handler.handle_exception(ExternalServiceConnectionFailedError(class_name="Open Cage"))

#mongo db
try:
    mongo_client = MongoClient(accessor.get_key(EnvironmentVariable.MONGO_URI.value))
    place_data_collection = mongo_client[accessor.get_key(EnvironmentVariable.DATABASE.value)][accessor.get_key(EnvironmentVariable.COLLECTION.value)]
except:
    error_handler.handle_exception(ExternalServiceConnectionFailedError(class_name="Mongo DB"))

#nlp
try:
    genai.configure(api_key=accessor.get_key(EnvironmentVariable.GEMINI.value))
except:
    error_handler.handle_exception(ExternalServiceConnectionFailedError(class_name="Google Gemini"))


#initialize custom service classes
#coordinates service
location_service = CoordinateFinder(geolocator=geolocator, 
                                    error_handler=error_handler)

#facility services
osm_facilities_service = OSMFacilityFinder(locator=location_service,
                                    error_handler=error_handler)
mongo_facilities_service = MongoDbFacilityFinder(locator=location_service, 
                                    collection=place_data_collection,
                                    error_handler=error_handler)
facility_query_service = FacilityQueryWrapper(location_service=location_service, 
                                     osm_facility_service=osm_facilities_service, 
                                     mongo_facility_service=mongo_facilities_service,
                                     error_handler=error_handler)

#natural disaster services
earthquake_service = Earthquakes(collection=place_data_collection, 
                                 locator=location_service,
                                 error_handler=error_handler)
earthquake_finder_service =  NaturalDisasterQueryWrapper(disaster_service=earthquake_service, 
                                                    location_service=location_service,
                                                    error_handler=error_handler)
tornado_service = Tornadoes(collection=place_data_collection, 
                            locator=location_service, 
                            error_handler=error_handler)
tornado_finder_service = NaturalDisasterQueryWrapper(disaster_service=tornado_service, 
                                             location_service=location_service,
                                             error_handler=error_handler)

#image service
imagery_service = ImageQueryWrapper(location_service=location_service,
                                    error_handler=error_handler)

#test services
test_dict = {
    "location_service": location_service,
    "osm_facilities_service": osm_facilities_service,
    "mongo_facilities_service": mongo_facilities_service,
    "facility_query_service": facility_query_service,
    "earthquake_service": earthquake_service,
    "earthquake_finder_service": earthquake_finder_service,
    "tornado_service": tornado_service,
    "tornado_finder_service": tornado_finder_service,
    "imagery_service": imagery_service
}

for key, value in test_dict.items():
    try:
        assert value.error_handler.test_object_instantiation() == 1
        print(f"{COLORS['green']}Service '{key}' initialized successfully!{COLORS['reset']}")
    except AssertionError:
        error_handler.handle_exception(InternalServiceConnectionFailedError(class_name=key))
