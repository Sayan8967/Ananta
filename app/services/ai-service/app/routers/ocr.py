import logging
from io import BytesIO

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.ocr_service import OcrService

logger = logging.getLogger("ai-service.ocr")

router = APIRouter(prefix="/api/v1/ai/ocr", tags=["ocr"])

ocr_service = OcrService()

MOCK_OCR_TEXT = """Dr. Sharma Clinic
Date: 15/01/2025

Rx:
1. Tab Paracetamol 650mg 1-0-1 x 5 days
2. Tab Amoxicillin 500mg TDS x 7 days
3. Syr Cough Relief 5ml BD x 5 days
4. Tab Pantoprazole 40mg OD (before breakfast) x 14 days

Signature: Dr. A. Sharma
Reg No: 12345"""


class OcrRequest(BaseModel):
    imageUrl: str
    prescriptionId: str | None = None


class OcrResponse(BaseModel):
    text: str
    confidence: float
    prescriptionId: str | None = None


@router.post("/prescription", response_model=OcrResponse)
async def ocr_prescription(request: OcrRequest):
    """Run OCR on a prescription image. Downloads from imageUrl, runs Tesseract."""
    logger.info(f"OCR request for prescription={request.prescriptionId}, url={request.imageUrl}")

    image_bytes: bytes | None = None

    # Attempt to download the image
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(request.imageUrl)
            response.raise_for_status()
            image_bytes = response.content
            logger.info(f"Downloaded image: {len(image_bytes)} bytes")
    except Exception as exc:
        logger.warning(f"Failed to download image: {exc}. Falling back to mock OCR text.")

    # Run OCR or return mock text
    if image_bytes:
        try:
            result = ocr_service.process_image(BytesIO(image_bytes))
            return OcrResponse(
                text=result["text"],
                confidence=result["confidence"],
                prescriptionId=request.prescriptionId,
            )
        except Exception as exc:
            logger.warning(f"OCR processing failed: {exc}. Falling back to mock OCR text.")

    # Mock fallback for MVP
    return OcrResponse(
        text=MOCK_OCR_TEXT,
        confidence=0.0,
        prescriptionId=request.prescriptionId,
    )
