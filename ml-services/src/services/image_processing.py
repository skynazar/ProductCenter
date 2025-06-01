import cv2
import numpy as np
from PIL import Image
import io
from typing import List, Dict, Any

class ImageProcessingService:
    def __init__(self):
        self.annotation_types = {
            'circle': self._detect_circles,
            'rectangle': self._detect_rectangles,
            'text': self._detect_text_regions
        }

    async def process(self, image_data: bytes) -> List[Dict[str, Any]]:
        try:
            # Convert bytes to numpy array
            image = self._bytes_to_numpy(image_data)
            
            # Preprocess image
            processed_image = self._preprocess_image(image)
            
            # Detect annotations
            annotations = []
            for annotation_type, detector in self.annotation_types.items():
                detected = detector(processed_image)
                annotations.extend([
                    {
                        'type': annotation_type,
                        'coordinates': coords,
                        'confidence': conf
                    }
                    for coords, conf in detected
                ])
            
            return annotations

        except Exception as e:
            print(f"Error in image processing: {str(e)}")
            return []

    def _bytes_to_numpy(self, image_data: bytes) -> np.ndarray:
        """Convert image bytes to numpy array."""
        image = Image.open(io.BytesIO(image_data))
        return np.array(image)

    def _preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Preprocess image for better detection."""
        # Convert to grayscale if needed
        if len(image.shape) == 3:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        else:
            gray = image

        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        return thresh

    def _detect_circles(self, image: np.ndarray) -> List[tuple]:
        """Detect circles in the image."""
        circles = cv2.HoughCircles(
            image,
            cv2.HOUGH_GRADIENT,
            dp=1,
            minDist=50,
            param1=50,
            param2=30,
            minRadius=10,
            maxRadius=100
        )

        if circles is None:
            return []

        return [(circle, 0.8) for circle in circles[0]]

    def _detect_rectangles(self, image: np.ndarray) -> List[tuple]:
        """Detect rectangles in the image."""
        contours, _ = cv2.findContours(
            image,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        rectangles = []
        for contour in contours:
            # Get minimum area rectangle
            rect = cv2.minAreaRect(contour)
            box = cv2.boxPoints(rect)
            box = np.int0(box)
            
            # Calculate confidence based on contour area
            area = cv2.contourArea(contour)
            confidence = min(area / 1000, 1.0)  # Normalize confidence
            
            rectangles.append((box.tolist(), confidence))

        return rectangles

    def _detect_text_regions(self, image: np.ndarray) -> List[tuple]:
        """Detect potential text regions in the image."""
        # Find contours
        contours, _ = cv2.findContours(
            image,
            cv2.RETR_EXTERNAL,
            cv2.CHAIN_APPROX_SIMPLE
        )

        text_regions = []
        for contour in contours:
            # Get bounding rectangle
            x, y, w, h = cv2.boundingRect(contour)
            
            # Filter based on aspect ratio and size
            aspect_ratio = w / float(h)
            if 0.1 < aspect_ratio < 10 and w > 20 and h > 20:
                # Calculate confidence based on region properties
                confidence = min(w * h / 1000, 1.0)  # Normalize confidence
                text_regions.append(([x, y, w, h], confidence))

        return text_regions 