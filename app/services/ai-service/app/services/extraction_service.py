import logging
import re
from typing import Any

logger = logging.getLogger("ai-service.extraction_service")

# ---------------------------------------------------------------------------
# Frequency mapping: abbreviation -> human-readable label
# ---------------------------------------------------------------------------
FREQUENCY_MAP: dict[str, str] = {
    # Indian prescription shorthands
    "1-0-0": "once daily (morning)",
    "0-1-0": "once daily (afternoon)",
    "0-0-1": "once daily (night)",
    "1-1-0": "twice daily (morning, afternoon)",
    "1-0-1": "twice daily (morning, night)",
    "0-1-1": "twice daily (afternoon, night)",
    "1-1-1": "three times daily",
    "1-1-1-1": "four times daily",
    # Latin abbreviations
    "od": "once daily",
    "bd": "twice daily",
    "bid": "twice daily",
    "tds": "three times daily",
    "tid": "three times daily",
    "qds": "four times daily",
    "qid": "four times daily",
    "hs": "at bedtime",
    "prn": "as needed",
    "sos": "as needed",
    "stat": "immediately",
    "ac": "before meals",
    "pc": "after meals",
    "qd": "once daily",
    "qod": "every other day",
    "q4h": "every 4 hours",
    "q6h": "every 6 hours",
    "q8h": "every 8 hours",
    "q12h": "every 12 hours",
    "once daily": "once daily",
    "twice daily": "twice daily",
    "three times daily": "three times daily",
    "thrice daily": "three times daily",
    "four times daily": "four times daily",
}

# ---------------------------------------------------------------------------
# Route mapping
# ---------------------------------------------------------------------------
ROUTE_MAP: dict[str, str] = {
    "po": "oral",
    "oral": "oral",
    "iv": "intravenous",
    "im": "intramuscular",
    "sc": "subcutaneous",
    "sl": "sublingual",
    "pr": "rectal",
    "top": "topical",
    "topical": "topical",
    "inh": "inhalation",
    "neb": "nebulization",
    "od": "ophthalmic (right eye)",
    "os": "ophthalmic (left eye)",
    "ou": "ophthalmic (both eyes)",
    "nasal": "nasal",
}

# ---------------------------------------------------------------------------
# Dosage form prefixes (common in Indian prescriptions)
# ---------------------------------------------------------------------------
FORM_PREFIXES = (
    "tab", "tab.", "tablet",
    "cap", "cap.", "capsule",
    "syr", "syr.", "syrup",
    "inj", "inj.", "injection",
    "cream", "oint", "ointment",
    "drops", "drop", "susp", "suspension",
    "gel", "lotion", "powder", "sachet",
    "inhaler", "respule", "nebule",
)

# ---------------------------------------------------------------------------
# Regex patterns
# ---------------------------------------------------------------------------

# Pattern: "Tab Paracetamol 650mg" or "Tablet Amoxicillin 500 mg"
_DRUG_WITH_DOSE = re.compile(
    r"(?:(?:" + "|".join(re.escape(p) for p in FORM_PREFIXES) + r")\s+)?"
    r"([A-Z][a-zA-Z\-]+(?:\s+[A-Z][a-zA-Z\-]+)?)"   # Drug name (1-2 capitalized words)
    r"\s+"
    r"(\d+(?:\.\d+)?\s*(?:mg|ml|mcg|g|iu|%|units?))"  # Dosage
    ,
    re.IGNORECASE,
)

# Indian frequency pattern: "1-0-1", "1-1-1"
_INDIAN_FREQ = re.compile(r"\b(\d-\d-\d(?:-\d)?)\b")

# Latin frequency pattern: "OD", "BD", "TDS", etc.
_LATIN_FREQ = re.compile(
    r"\b(OD|BD|BID|TDS|TID|QDS|QID|HS|PRN|SOS|STAT|AC|PC|QD|QOD|Q4H|Q6H|Q8H|Q12H)\b",
    re.IGNORECASE,
)

# Natural language frequency: "once daily", "twice daily", etc.
_NL_FREQ = re.compile(
    r"\b(once daily|twice daily|three times daily|thrice daily|four times daily"
    r"|every \d+ hours?|at bedtime|before meals|after meals|as needed)\b",
    re.IGNORECASE,
)

# Route pattern
_ROUTE = re.compile(
    r"\b(PO|oral|IV|IM|SC|SL|PR|topical|top|inh|neb|nasal)\b",
    re.IGNORECASE,
)

# Duration pattern (for context, not currently returned but useful for future)
_DURATION = re.compile(
    r"\b(?:x|for)\s*(\d+)\s*(days?|weeks?|months?)\b",
    re.IGNORECASE,
)


class ExtractionService:
    """Rule-based medication entity extractor for MVP.

    Handles multiple prescription formats:
    - Indian: "Tab Paracetamol 650mg 1-0-1 x 5 days"
    - US/International: "Metformin 500 mg PO BID"
    - Natural language: "Amoxicillin 500mg three times daily oral"
    """

    def extract_medications(self, text: str) -> list[dict[str, Any]]:
        """Extract structured medications from free-form text.

        Args:
            text: Raw OCR or typed prescription text.

        Returns:
            List of dicts with keys: name, dosage, frequency, route.
        """
        medications: list[dict[str, Any]] = []
        seen_names: set[str] = set()

        # Split into lines for line-by-line processing
        lines = text.strip().split("\n")

        for line in lines:
            line = line.strip()
            if not line:
                continue

            med = self._extract_from_line(line)
            if med and med["name"].lower() not in seen_names:
                seen_names.add(med["name"].lower())
                medications.append(med)

        logger.info(f"Extracted {len(medications)} medications from {len(lines)} lines")
        return medications

    def _extract_from_line(self, line: str) -> dict[str, Any] | None:
        """Try to extract a medication entry from a single line."""

        # Match drug name + dosage
        drug_match = _DRUG_WITH_DOSE.search(line)
        if not drug_match:
            return None

        name = drug_match.group(1).strip()
        dosage = drug_match.group(2).strip()

        # Skip lines that are clearly not medications
        skip_words = {"dr", "date", "reg", "signature", "clinic", "hospital", "rx", "patient"}
        if name.lower() in skip_words:
            return None

        # Extract frequency
        frequency = self._extract_frequency(line)

        # Extract route
        route = self._extract_route(line)

        return {
            "name": name,
            "dosage": dosage,
            "frequency": frequency,
            "route": route,
        }

    def _extract_frequency(self, line: str) -> str | None:
        """Extract dosing frequency from a line."""
        # Try Indian format first (1-0-1)
        m = _INDIAN_FREQ.search(line)
        if m:
            key = m.group(1)
            return FREQUENCY_MAP.get(key, key)

        # Try Latin abbreviations (BD, TDS, etc.)
        m = _LATIN_FREQ.search(line)
        if m:
            key = m.group(1).lower()
            return FREQUENCY_MAP.get(key, key)

        # Try natural language
        m = _NL_FREQ.search(line)
        if m:
            key = m.group(1).lower()
            return FREQUENCY_MAP.get(key, key)

        return None

    def _extract_route(self, line: str) -> str | None:
        """Extract administration route from a line."""
        m = _ROUTE.search(line)
        if m:
            key = m.group(1).lower()
            return ROUTE_MAP.get(key, key)

        # Infer route from dosage form
        lower_line = line.lower()
        if any(lower_line.startswith(p) for p in ("tab", "cap", "tablet", "capsule")):
            return "oral"
        if any(lower_line.startswith(p) for p in ("syr", "syrup", "susp", "suspension")):
            return "oral"
        if any(lower_line.startswith(p) for p in ("cream", "oint", "ointment", "gel", "lotion")):
            return "topical"
        if any(lower_line.startswith(p) for p in ("inj", "injection")):
            return "injection"
        if any(lower_line.startswith(p) for p in ("inhaler", "respule", "nebule")):
            return "inhalation"
        if any(lower_line.startswith(p) for p in ("drops", "drop")):
            return "ophthalmic"

        return None
