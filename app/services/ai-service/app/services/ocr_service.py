import logging
from io import BytesIO
from typing import Any

from PIL import Image, ImageFilter

logger = logging.getLogger("ai-service.ocr_service")


class OcrService:
    """Wraps pytesseract for prescription OCR processing."""

    def __init__(self) -> None:
        self._tesseract_available = False
        try:
            import pytesseract

            pytesseract.get_tesseract_version()
            self._tesseract_available = True
        except Exception:
            logger.warning("Tesseract not available. OCR will raise on process_image().")

    def preprocess_image(self, image: Image.Image) -> Image.Image:
        """Preprocess the image for better OCR accuracy.

        - Convert to grayscale
        - Apply slight sharpening
        - Apply binary threshold for cleaner text
        """
        # Convert to grayscale
        gray = image.convert("L")

        # Sharpen to enhance text edges
        sharpened = gray.filter(ImageFilter.SHARPEN)

        # Apply binary threshold: pixels above 140 become white, below become black
        threshold = 140
        binary = sharpened.point(lambda px: 255 if px > threshold else 0, mode="1")

        return binary

    def process_image(self, image_data: BytesIO) -> dict[str, Any]:
        """Run OCR on an image buffer.

        Args:
            image_data: BytesIO containing the image bytes.

        Returns:
            dict with 'text' (extracted text) and 'confidence' (0-100 score).

        Raises:
            RuntimeError: If tesseract is not installed.
        """
        if not self._tesseract_available:
            raise RuntimeError("Tesseract OCR is not installed or not found in PATH.")

        import pytesseract

        image = Image.open(image_data)
        preprocessed = self.preprocess_image(image)

        # Run OCR with detailed output for confidence
        data = pytesseract.image_to_data(preprocessed, output_type=pytesseract.Output.DICT)

        # Extract full text
        text = pytesseract.image_to_string(preprocessed, lang="eng")

        # Calculate average confidence from word-level confidences
        confidences = [
            int(c) for c in data["conf"] if str(c).lstrip("-").isdigit() and int(c) > 0
        ]
        avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

        logger.info(
            f"OCR complete: {len(text)} chars, {len(confidences)} words, "
            f"avg confidence={avg_confidence:.1f}"
        )

        return {
            "text": text.strip(),
            "confidence": round(avg_confidence, 2),
        }
