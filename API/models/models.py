from pydantic import BaseModel
from typing import Optional


class Query(BaseModel):
    location_name: Optional[str] = None
    facility_type: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    query_type: Optional[str] = None
    radius: Optional[float] = None
    dataset: Optional[str] = None
    query_type: Optional[str] = None

    def needs_geocoding(self):
        is_location_name_valid = self.location_name is None or self.location_name == ""
        is_coordinates_absent_or_zero = (self.latitude is None or self.longitude is None) or (self.latitude == 0 and self.longitude == 0)

        return is_location_name_valid or is_coordinates_absent_or_zero

    def to_string(self):
        return (f"\n[\n\tlocation_name: {self.location_name if self.location_name else '(empty)'}, \n\tfacility_type: {self.facility_type if self.facility_type else '(empty)'}, "
            f"\n\tstart_date: {self.start_date if self.start_date else '(empty)'}, \n\tend_date: {self.end_date if self.end_date else '(empty)'}, "
            f"\n\tlatitude: {self.latitude}, \n\tlongitude: {self.longitude}, "
            f"\n\tradius: {self.radius}, \n\tdataset: {self.dataset if self.dataset else '(empty)'}\n]\n")

