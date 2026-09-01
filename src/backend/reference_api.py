"""ARTY V.2 reference-only API.

Optional FastAPI adapter. It validates provenance/schema payloads only and
deliberately does not expose firing tables, ballistic solutions, or commands.
"""
import json
import os
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException

SCHEMA_PATH = Path(__file__).resolve().parents[2] / "references" / "ballistics-reference-schema.json"
SCHEMA = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
app = FastAPI(title="ARTY V.2 Reference API", version="1.0.0")

@app.get("/api/v1/health")
def health() -> dict[str, Any]:
    return {"status": "ONLINE", "service": "arty-reference-api", "mode": "schema-validation-only", "operationalCalculationEnabled": False}

@app.get("/api/v1/reference/schema")
def schema() -> dict[str, Any]:
    return SCHEMA

@app.get("/api/v1/reference/tables")
def tables() -> dict[str, Any]:
    return {"tables": SCHEMA["tableCatalog"]}

@app.post("/api/v1/reference/validate")
def validate(payload: dict[str, Any]) -> dict[str, Any]:
    blocked = SCHEMA["restrictedPayloadPolicy"]["blockedFields"]
    errors = []
    if payload.get("operationalCalculationEnabled") is True:
        errors.append("ไม่อนุญาตให้เปิดการคำนวณเชิงปฏิบัติการ")
    errors.extend(f"ไม่อนุญาต field: {field}" for field in blocked if field in payload)
    return {"valid": not errors, "errors": errors, "mode": "schema-validation-only"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=int(os.getenv("ARTY_REFERENCE_PORT", "8090")))
