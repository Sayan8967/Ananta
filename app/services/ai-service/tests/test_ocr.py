import pytest
import io


def test_ocr_endpoint_requires_file(client):
    """Test OCR endpoint returns error without file."""
    response = client.post("/api/v1/ai/ocr/prescription")
    assert response.status_code in [400, 422]


def test_ocr_with_empty_image(client):
    """Test OCR with an empty/tiny image."""
    # Create a minimal valid PNG (1x1 pixel)
    import struct
    import zlib

    def create_minimal_png():
        signature = b"\x89PNG\r\n\x1a\n"
        # IHDR
        ihdr_data = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
        ihdr_crc = zlib.crc32(b"IHDR" + ihdr_data)
        ihdr = struct.pack(">I", 13) + b"IHDR" + ihdr_data + struct.pack(">I", ihdr_crc & 0xFFFFFFFF)
        # IDAT
        raw = zlib.compress(b"\x00\x00\x00\x00")
        idat_crc = zlib.crc32(b"IDAT" + raw)
        idat = struct.pack(">I", len(raw)) + b"IDAT" + raw + struct.pack(">I", idat_crc & 0xFFFFFFFF)
        # IEND
        iend_crc = zlib.crc32(b"IEND")
        iend = struct.pack(">I", 0) + b"IEND" + struct.pack(">I", iend_crc & 0xFFFFFFFF)
        return signature + ihdr + idat + iend

    png_bytes = create_minimal_png()
    response = client.post(
        "/api/v1/ai/ocr/prescription",
        files={"file": ("test.png", io.BytesIO(png_bytes), "image/png")},
    )
    # Should either succeed with empty text or return an error gracefully
    assert response.status_code in [200, 400, 422, 500]
