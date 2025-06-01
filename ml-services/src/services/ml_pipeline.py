import torch
import torchvision
from torchvision.models.detection import fasterrcnn_resnet50_fpn
from torchvision.transforms import functional as F
from PIL import Image
import io
import numpy as np
from typing import Dict, Any

class MLPipeline:
    def __init__(self):
        # Initialize models
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load object detection model
        self.detection_model = fasterrcnn_resnet50_fpn(pretrained=True)
        self.detection_model.to(self.device)
        self.detection_model.eval()

        # Define class names for COCO dataset
        self.coco_names = [
            'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
            'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
            'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep',
            'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella',
            'handbag', 'tie', 'suitcase', 'frisbee', 'skis', 'snowboard',
            'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
            'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork',
            'knife', 'spoon', 'bowl', 'banana', 'apple', 'sandwich', 'orange',
            'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair',
            'couch', 'potted plant', 'bed', 'dining table', 'toilet', 'tv',
            'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave',
            'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase',
            'scissors', 'teddy bear', 'hair drier', 'toothbrush'
        ]

    async def process(self, image_data: bytes) -> Dict[str, Any]:
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != "RGB":
                image = image.convert("RGB")
            
            # Transform image for model
            image_tensor = F.to_tensor(image)
            image_tensor = image_tensor.unsqueeze(0).to(self.device)
            
            # Get predictions
            with torch.no_grad():
                predictions = self.detection_model(image_tensor)
            
            # Process predictions
            results = self._process_predictions(predictions[0])
            
            return results

        except Exception as e:
            print(f"Error in ML pipeline: {str(e)}")
            return {
                "confidence": 0.0,
                "detections": [],
                "error": str(e)
            }

    def _process_predictions(self, prediction: Dict[str, torch.Tensor]) -> Dict[str, Any]:
        """Process model predictions into a usable format."""
        boxes = prediction['boxes'].cpu().numpy()
        scores = prediction['scores'].cpu().numpy()
        labels = prediction['labels'].cpu().numpy()

        # Filter predictions by confidence threshold
        confidence_threshold = 0.5
        mask = scores > confidence_threshold
        
        detections = []
        for box, score, label in zip(boxes[mask], scores[mask], labels[mask]):
            detections.append({
                'box': box.tolist(),
                'score': float(score),
                'label': self.coco_names[label - 1]  # COCO labels are 1-indexed
            })

        # Calculate overall confidence
        overall_confidence = float(np.mean(scores[mask])) if len(scores[mask]) > 0 else 0.0

        return {
            'confidence': overall_confidence,
            'detections': detections
        }

    def _preprocess_image(self, image: np.ndarray) -> torch.Tensor:
        """Preprocess image for the model."""
        # Convert to PIL Image
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)
        
        # Convert to RGB if necessary
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Transform to tensor
        image_tensor = F.to_tensor(image)
        
        # Normalize
        image_tensor = F.normalize(
            image_tensor,
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
        
        return image_tensor 