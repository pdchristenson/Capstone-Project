routes=[  
    {
        'dataset' :  'Sentinel-1 SAR GRD: C-band Synthetic Aperture Radar',
        'db_route': "COPERNICUS/S1_GRD",
        'vis_params': {
            'bands': ['VV'],
            'min': -25,
            'max': 0,
            'dimensions': 1024,
            'format': 'png'
        },
        'download_params':{
            'bands': ['VV'],
            'min': -25,
            'max': 0,
            'dimensions': 1024,
            'format': 'ZIPPED_GEO_TIFF'
        }
    },
    {
        'dataset' : 'Sentinel-2 MSI: Multi-spectral Instrument',
        'db_route': "COPERNICUS/S2", #COPERNICUS/S2_SR_HARMONIZED
        'vis_params': {
            'bands': ['B4', 'B3', 'B2'], #was just B1 but it sucked, []'B4', 'B3', 'B2'] B8 is NIR, B4/3/2 is R/G/B
            'min': 0,
            'max': 0.3,
            'dimensions': 1024,
            'format': 'png'
        },
        'download_params':{
            'bands': ['B4', 'B3', 'B2'], #was just B1 but it sucked, []'B4', 'B3', 'B2'] B8 is NIR, B4/3/2 is R/G/B
            'min': 0,
            'max': 0.3,
            'dimensions': 1024,
            'format': 'ZIPPED_GEO_TIFF'
        }
    },
    {
        'dataset' : 'sentinel_2_2A',
        'db_route': "COPERNICUS/S2_SR_HARMONIZED",
        'vis_params': {
            'bands': ['B4', 'B3', 'B2'],
            'min':  0.0,
            'max':  0.3,
            'dimensions': 1024,
            'format': 'png'
        },
        'download_params':{
             'bands': ['B4', 'B3', 'B2'],
            'min':  0.0,
            'max':  0.3,
            'dimensions': 1024,
            'format': 'ZIPPED_GEO_TIFF'
        }
    },

    #LANDSAT vis_params also had: 'region': poi.buffer(10000).bounds().getInfo() , # Buffer the point by 1000 meters (or any other value)
    {
        'dataset' : 'Landsat 8',
        'db_route': "LANDSAT/LC09/C02/T1",
        'vis_params': {
            'bands': ['B4', 'B3', 'B2'],
            'min': 6000, #0 (NAIP)
            'max': 12000,#400 (NAIP)
            'gamma': [1,1,1],
            'dimensions': 1024, #2048 (NAIP)
            'format': 'png'
        },
        'download_params': {
            'bands': ['B4', 'B3', 'B2'],
            'min': 6000, #0 (NAIP)
            'max': 12000,#400 (NAIP)
            'gamma': [1,1,1],
            'dimensions': 1024, #2048 (NAIP)
            'format': 'ZIPPED_GEO_TIFF'
        }
    },
    {
        'dataset' : 'NAIP: National Agriculture Imagery Program',
        'db_route': "USDA/NAIP/DOQQ",
        'vis_params': {
            'bands':['R', 'G', 'B'],
            'min': 0,
            'max': 400,
            'dimensions': 1024,
            'format': 'png'
        },
        'download_params': {
            'bands':['R', 'G', 'B'],
            'min': 0,
            'max': 400,
            'dimensions': 1024,
            'format': 'ZIPPED_GEO_TIFF'
        }
        
    }
]