def get_resolution(radius: float = 0.0) -> int:
    """ 
        Average hex area (in km) for correlating resolution.
    """
    
    radius_squared = radius * radius

    if radius == 0.0:
        return 7

    if radius_squared < 0.325:
        return 9
    elif radius_squared < 0.737:
        return 8
    elif radius_squared < 5.162:
        return 7
    elif radius_squared < 36.131:
        return 6
    elif radius_squared < 252.904:
        return 5
    elif radius_squared < 1770.348:
        return 4
    elif radius_squared < 12393.435:
        return 3
    elif radius_squared < 86801.781:
        return 2
    elif radius_squared < 609788.442:
        return 1
    elif radius_squared < 4357449.416:
        return 0
    else:
        return 7

