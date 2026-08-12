from datetime import UTC, datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings

app = FastAPI(title="DevSecOps Demo API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health", tags=["operations"])
def health() -> dict[str, str]:
    return {"status": "ok", "environment": get_settings().app_env}


@app.get("/api/message", tags=["demo"])
def message() -> dict[str, str]:
    return {
        "message": "Secure delivery is a feature, not a final checklist.",
        "timestamp": datetime.now(UTC).isoformat(),
    }

