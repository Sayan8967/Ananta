from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live")
async def liveness():
    return {"status": "ok", "service": "ai-service"}


@router.get("/ready")
async def readiness():
    ready = True
    details: dict[str, str] = {}

    try:
        import pytesseract

        pytesseract.get_tesseract_version()
        details["tesseract"] = "available"
    except Exception:
        details["tesseract"] = "unavailable (mock mode)"

    return {
        "status": "ready" if ready else "not ready",
        "service": "ai-service",
        "details": details,
    }
