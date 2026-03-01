import pytest


def test_extract_medications_from_text(client):
    """Test extraction of medications from prescription text."""
    response = client.post(
        "/api/v1/ai/extract/medications",
        json={"text": "Tab. Metformin 500mg BD\nCap. Amoxicillin 250mg TID x 7 days"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "medications" in data
    assert len(data["medications"]) >= 1


def test_extract_empty_text(client):
    """Test extraction with empty text returns empty list."""
    response = client.post(
        "/api/v1/ai/extract/medications",
        json={"text": ""},
    )
    assert response.status_code == 200
    data = response.json()
    assert "medications" in data
    assert len(data["medications"]) == 0


def test_extract_indian_format(client):
    """Test extraction of Indian prescription format."""
    response = client.post(
        "/api/v1/ai/extract/medications",
        json={"text": "Tab. Paracetamol 650mg SOS\nSyp. Cough linctus 5ml TDS"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "medications" in data


def test_extract_returns_structured_data(client):
    """Test that extracted medications have expected fields."""
    response = client.post(
        "/api/v1/ai/extract/medications",
        json={"text": "Metformin 500mg twice daily"},
    )
    assert response.status_code == 200
    data = response.json()
    if len(data["medications"]) > 0:
        med = data["medications"][0]
        assert "name" in med
