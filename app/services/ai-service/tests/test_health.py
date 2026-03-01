def test_liveness(client):
    response = client.get("/health/live")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


def test_readiness(client):
    response = client.get("/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
