import h3
from functions.footprints.resolution import get_resolution

def get_h3_index(lat: float = 0.0, lon: float = 0.0, radius: float = 0.0):
    """
    Returns the h3 index of a given area, currently handled on the front end so this function is not used
    """
    try:
        resolution = get_resolution(radius) 
        return h3.geo_to_h3(lat, lon, resolution)
    except:
        return -1