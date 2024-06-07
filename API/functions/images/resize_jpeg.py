from PIL import Image
from io import BytesIO

# #will want to pass it file path or img url
# #TODO not used
def resize_jpeg(image: Image) -> bytes:
    """
    Resize JPEG from 48MB to 32KB.
    """

    Image.MAX_IMAGE_PIXELS = None
    # Open the original image
    # file_path = '/content/output.jpeg'
    im1 = Image.open(image)

    # Define the new size
    # 1000x1000 pixels -- can play with this and make even smaller
    new_size = (1000, 1000)  

    # Resize the image
    im_resized = im1.resize(new_size)
    img_byte_array = BytesIO()
    # Save the resized image to a BytesIO object
    im_resized.save(img_byte_array, format='JPEG', quality=25)

    img_byte_array = img_byte_array.getvalue()

    return img_byte_array