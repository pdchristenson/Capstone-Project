import ee
from interfaces.querywrapper import QueryWrapper
from models.models import Query
from models.error_types import RequiredParameterError, InternalServiceFailed, InternalServiceBadReturnError
from functions.services.coordinates import CoordinateFinder
from functions.services.error_handler import ErrorHandler
from config.db_routing import routes


class ImageQueryWrapper(QueryWrapper):
    def __init__(self, location_service: CoordinateFinder, error_handler: ErrorHandler):
        super().__init__(location_service, error_handler)

    #not used, implemented for scalability
    def get_data(self, query: Query):
        if query.query_type == 'image':
            return self.get_ee_images(query)
        else:
            return None

    #do we need to check if the query needs geocoding? -no, apparently
    def get_ee_images(self, query: Query):
        """
        Get image data for a specific location and time period. Returns all image URLs in the specified period.
        """
        # if query.needs_geocoding():
        #     e =  RequiredParameterError(class_name=self.__class__.__name__, parameter_name="latitude, longitude")
        #     self.error_handler.handle_exception(e)

        response = self.get_image_data(query.latitude,
                                    query.longitude,
                                    query.start_date,
                                    query.end_date,
                                    query.dataset)
        return response

    def get_image_data(self, latitude: float = 0, longitude: float = 0, start_date: str = None, end_date: str = None, dataset: str = None):
        """
        Queries Earth Engine Catalog for a given area  and timeframe, returning an array of ee.Image objects. 
        Used to send image previews, download URLs, and bounding box for the area of an image. Dataset defaults to 
        NAIP if no dataset is specified in the query from the front end.
        """
        try:
            dataset = dataset or ee.ImageCollection("USDA/NAIP/DOQQ")
            for element in routes:
                if element['dataset'] == dataset:
                    img_collection= ee.ImageCollection(element['db_route']).filterDate(start_date, end_date).filterBounds(ee.Geometry.Point([longitude, latitude]))
                    img_list = img_collection.toList(img_collection.size())
                    list_size = img_list.size().getInfo()
                    max_images = min(list_size, 50)
                    download_urls = []
                    urls = []
                    bbox = None
                    for i in range(max_images):
                        img = ee.Image(img_list.get(i))
                        if i == 0:  # Get the bounding box from the first image
                            img_bbox = img.geometry().bounds().getInfo()["coordinates"][0]
                            bbox = {
                                "southwest": img_bbox[0], 
                                "northwest": img_bbox[3], 
                                "northeast": img_bbox[2], 
                                "southeast": img_bbox[1]
                            }
                        
                        thumb_url = img.getThumbURL(element['vis_params'])
                        dwnld_url = img.getDownloadURL(params=element['download_params'])
                        download_urls.append(dwnld_url)
                        urls.append(thumb_url)

                    if urls and bbox:
                        return {"urls": urls, "bbox": bbox, "download_url": download_urls}
                    else:
                        e = InternalServiceBadReturnError(class_name=self.__class__.__name__, method_name="get_image_data")
                        self.error_handler.handle_exception(e)
        except:
            e = InternalServiceFailed(class_name=self.__class__.__name__, method_name="get_image_data")
            self.error_handler.handle_exception(e)