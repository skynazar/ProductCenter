import cv2
import numpy as np
from PIL import Image
import io
import torch
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

class OCRService:
    def __init__(self):
        self.processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
        self.model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
        if torch.cuda.is_available():
            self.model = self.model.to("cuda")

    async def process(self, image_data: bytes) -> list[str]:
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != "RGB":
                image = image.convert("RGB")
            
            # Preprocess image
            pixel_values = self.processor(image, return_tensors="pt").pixel_values
            if torch.cuda.is_available():
                pixel_values = pixel_values.to("cuda")

            # Generate text
            generated_ids = self.model.generate(pixel_values)
            generated_text = self.processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

            # Split text into lines and clean
            lines = [line.strip() for line in generated_text.split('\n') if line.strip()]
            
            return lines

        except Exception as e:
            print(f"Error in OCR processing: {str(e)}")
            return []

    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better OCR results."""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply thresholding to preprocess the image
        gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]

        # Apply dilation to connect text components
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        gray = cv2.dilate(gray, kernel, iterations=1)

        return gray 