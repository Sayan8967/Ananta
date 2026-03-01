import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import health, ocr, extraction

logger = logging.getLogger("ai-service")
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("AI service starting up")
    # Startup: verify tesseract is available
    try:
        import pytesseract

        version = pytesseract.get_tesseract_version()
        logger.info(f"Tesseract OCR version: {version}")
    except Exception as exc:
        logger.warning(f"Tesseract OCR not available: {exc}. OCR will use mock mode.")
    yield
    logger.info("AI service shutting down")


app = FastAPI(
    title="Ananta AI Service",
    description="OCR and medication extraction service for the Ananta healthcare platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health.router)
app.include_router(ocr.router)
app.include_router(extraction.router)
