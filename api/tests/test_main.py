from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "environment": "development"}


def test_message() -> None:
    response = client.get("/api/message")
    assert response.status_code == 200
    body = response.json()
    assert body["message"].startswith("Secure delivery")
    assert body["timestamp"].endswith("+00:00")

