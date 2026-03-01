import logging

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.extraction_service import ExtractionService

logger = logging.getLogger("ai-service.extraction")

router = APIRouter(prefix="/api/v1/ai/extract", tags=["extraction"])

extraction_service = ExtractionService()


class ExtractionRequest(BaseModel):
    text: str


class Medication(BaseModel):
    name: str
    dosage: str | None = None
    frequency: str | None = None
    route: str | None = None


class ExtractionResponse(BaseModel):
    medications: list[Medication]


@router.post("/medications", response_model=ExtractionResponse)
async def extract_medications(request: ExtractionRequest):
    """Extract structured medication data from free-form prescription text."""
    logger.info(f"Extraction request: {len(request.text)} chars")

    medications = extraction_service.extract_medications(request.text)

    logger.info(f"Extracted {len(medications)} medications")
    return ExtractionResponse(medications=medications)
