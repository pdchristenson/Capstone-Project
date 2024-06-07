import base64
from io import BytesIO
from PIL import Image

#might not need w bytesio in resizeJPEG()
def image_to_base64(image: Image) -> str:
    """
    Convert a PIL image to a base64 string.
    """

    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    return img_str