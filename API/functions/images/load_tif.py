import rasterio
import numpy as np
from PIL import Image
from functions.images.resize_jpeg import resize_jpeg
# from osgeo import gdal -- still trouble shooting

# URL of the .tif file
#TODO not used
def load_tif(url: str) -> bytes:
    """
    Load TIF from url, convert to jpeg, and save as resized jpeg
    """

    # url = 'https://umbra-open-data-catalog.s3.amazonaws.com/sar-data/tasks/Texas%20A%26M%20Farm%20Plot/17c0c92c-a9a7-42c9-a7bd-d737d48750a1/2023-10-14-15-57-05_UMBRA-04/2023-10-14-15-57-05_UMBRA-04_GEC.tif'

    # Use vsicurl to access the file remotely
    with rasterio.open(f'/vsicurl/{url}') as src:
        # Read the data
        data = src.read(1)  # Read the first band

    # Convert the data to an image (ensure proper scaling for display)
    image_data = (data - data.min()) / (data.max() - data.min())
    image = Image.fromarray(np.uint8(image_data * 255))

    resized_image = resize_jpeg(image)

    return resized_image 