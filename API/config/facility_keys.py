#facility tags for OSM Overpass Queries
facility_tags = {
    "government building": ("office", "government"),
    "power plant": ("power", "plant"),
    "military base": ("military", "base"),
    "airport": ("aeroway", "aerodrome"),
    "bus station": ("amenity", "bus_station"),
    "embassy": ("amenity", "embassy"),
    "fire station": ("amenity", "fire_station"),
    "fire stations": ("amenity", "fire_station"),
    "firestation": ("amenity", "fire_station"), 
    "hospital": ("amenity", "hospital"),
    "police": ("amenity", "police"),
    "post_office": ("amenity", "post_office"),
    "stadium": ("leisure", "stadium"),
    "supermarket": ("shop", "supermarket"),
    "train station": ("railway", "station"),
    "university": ("amenity", "university"),
    "port": ("industrial", "port")
    # Add more facility types and their corresponding OSM tags as needed
}

mongo_facilities = [
    'airport', 
    'military_base', 
    'bridge', 
    'power_plant', 
    'dam'
]
