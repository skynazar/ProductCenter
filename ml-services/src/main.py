from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from .services.ocr import OCRService
from .services.image_processing import ImageProcessingService
from .services.ml_pipeline import MLPipeline

app = FastAPI(title="OCR Platform ML Services")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
ocr_service = OCRService()
image_processing = ImageProcessingService()
ml_pipeline = MLPipeline()

class ProcessedImage(BaseModel):
    text: List[str]
    annotations: List[dict]
    confidence: float

@app.post("/process-image", response_model=ProcessedImage)
async def process_image(file: UploadFile = File(...)):
    try:
        # Read image file
        contents = await file.read()
        
        # Process image through pipeline
        text_results = await ocr_service.process(contents)
        image_results = await image_processing.process(contents)
        ml_results = await ml_pipeline.process(contents)
        
        return ProcessedImage(
            text=text_results,
            annotations=image_results,
            confidence=ml_results.get("confidence", 0.0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 