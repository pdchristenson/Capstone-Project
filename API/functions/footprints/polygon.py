import h3
from shapely.geometry import Polygon
from functions.footprints.h3index import get_h3_index

# radius in KM
def get_polygon(lat: float, lon: float, radius: float) -> tuple[Polygon, str]: 
    """
    Get the polygon of a given location and radius.
    """
    try:
        index = get_h3_index(lat, lon, radius) 
        boundary = h3.h3_to_geo_boundary(index)
        #h3 takes and returns coords (lat, lon), Shapely takes them in (lon, lat)
        polygon = Polygon([(lon, lat) for lat, lon in boundary])
        return polygon, index
    except Exception as e:
        print(f"This error occurred: {str(e)}")