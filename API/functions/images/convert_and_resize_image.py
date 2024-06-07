import rasterio
import os
import numpy as np
from PIL import Image

# Example usage:
# url = 'https://your-tif-or-geotif-file-url.tif'
# resized_image_path = convert_and_resize_image(url)
#TODO not used
def convert_and_resize_image(url: str, output_dir: str = './output', new_size: tuple[float, float] = (1000, 1000), quality: float = 25) -> str:
        """
        Load a TIF or GeoTIF file from a URL, convert it to a JPEG, resize it, and save the resized image.
        
        :param url: URL of the TIF or GeoTIF file
        :param output_dir: Directory to save the output images -- REPLACE W sending image to front end
        :param new_size: New size of the image as a tuple (width, height)
        :param quality: Quality parameter for the JPEG file -- in %
        :return: Path to the resized image
        """

        # Ensure the output directory exists
        os.makedirs(output_dir, exist_ok=True)

        # Use vsicurl to access the file remotely
        with rasterio.open(f'/vsicurl/{url}') as src:
            # Read the data
            data = src.read(1)  # Read the first band

        # Convert the data to an image (ensure proper scaling for display)
        image_data = (data - data.min()) / (data.max() - data.min())
        image = Image.fromarray(np.uint8(image_data * 255))

        # Resize the image
        im_resized = image.resize(new_size)

        # Save the resized image to a new file
        output_img_path = os.path.join(output_dir, 'resized_image.jpg')
        im_resized.save(output_img_path, "JPEG", quality=quality)

        print(f"Resized image saved to {output_img_path}")

        return output_img_path