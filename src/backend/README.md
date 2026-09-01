# ARTY V.2 Reference API

ชั้นนี้เป็น reference/schema service สำหรับตรวจสอบ provenance และโครงสร้างข้อมูลจากสมุดตารางยิงเท่านั้น

- `references/ballistics-reference-schema.json` เป็น catalog ของตาราง A–K และ field contract โดยค่าปฏิบัติการถูก redacted
- `reference-api.mjs` ใช้ Node.js standard library ไม่เพิ่ม dependency
- `reference_api.py` เป็น FastAPI adapter แบบ optional สำหรับสภาพแวดล้อมที่ติดตั้ง FastAPI/Uvicorn อยู่แล้ว

Endpoints ทั้งสอง wrapper มีเหมือนกัน:

- `GET /api/v1/health`
- `GET /api/v1/reference/schema`
- `GET /api/v1/reference/tables`
- `POST /api/v1/reference/validate`

ไม่มี endpoint solve, ไม่มีค่ามุมยิง/เวลาแล่น/ชนวน และไม่สร้างคำสั่งยิงจริง
