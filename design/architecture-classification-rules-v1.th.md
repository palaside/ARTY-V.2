# กฎการจัดหมวดสถาปัตยกรรม v1

## วัตถุประสงค์

เอกสารฉบับนี้ใช้เป็นหลักเกณฑ์กลางในการจัดหมวดฟีเจอร์ องค์ประกอบ และความรับผิดชอบของระบบ ARTY V.2 ในเชิงสถาปัตยกรรม ก่อนที่จะมีการ refactor, ย้ายไฟล์, รวม state, แยก state หรือปรับพฤติกรรม runtime ของระบบ

## หลักสำคัญ

- Group C คือการจัดหมวดตามที่มาของฟีเจอร์
- Shared Layer คือบทบาทเชิงสถาปัตยกรรม
- Domain เป็นเจ้าของงาน
- Shared Layer เป็นเจ้าของข้อมูลและความสามารถที่ข้ามหลาย Domain
- ห้าม refactor หรือเปลี่ยน runtime behavior จนกว่าจะได้รับการอนุมัติการจัดหมวดขั้นสุดท้าย

## หมวดสถาปัตยกรรม

ฟีเจอร์ทุกตัวต้องถูกจัดให้อยู่ในหนึ่งในหมวดต่อไปนี้เท่านั้น

- Domain-specific
- Shared Operational Layer
- Shared System Tools
- System Service
- UI Shell / Infrastructure

## Shared Operational Layer

ฟีเจอร์จะถูกจัดเป็น Shared Operational Layer ได้ต่อเมื่อ:

- มี Source of Truth เดียว
- ถูกใช้ร่วมกันโดยมากกว่าหนึ่ง Domain หรือมีผลกระทบข้ามมากกว่าหนึ่ง Domain
- หากแยกเก็บเป็นหลายชุดจะก่อให้เกิด duplication, inconsistency หรือ broken cross-domain state

ห้ามตัดสินจากตำแหน่งใน UI เพียงอย่างเดียว

## ฐานการจัดหมวดปัจจุบัน

### Operational Domains

- FO
- FDC
- Surveillance
- Howitzer
- กระสุน

### Shared Operational Layer

- Mission Context
- Target Data
- Tactical Map / Common Spatial View
- Fire Mission State
- Safety / Readiness State
- Event Log
- Notifications / Alerts
- Report / Export

### Shared System Tools

- Compass / Orientation
- Level
- Session / Battery Configuration
- OPSEC
- Time / Clock
- Connectivity / Status
- Emergency / Kill Switch access

### System Services

- Sound
- Persistence
- Emergency Control

### UI Shell / Infrastructure

- Navigation
- Window / Workspace Management
- Responsive Layout

## ข้อจำกัดในระยะนี้

จนกว่าจะมีการอนุมัติการจัดหมวดแบบรายฟีเจอร์อย่างเป็นทางการ:

- ห้ามย้ายไฟล์
- ห้าม refactor state
- ห้ามเปลี่ยน runtime behavior
- ห้ามรวมข้อมูลที่เป็นของ Domain เข้า Shared State โดยไม่มีการอนุมัติ
- ห้ามแยก Shared State ออกเป็นหลายชุดตาม Domain โดยไม่มีการอนุมัติ

## หมายเหตุเชิงการออกแบบหน้าจอ

- Visibility state เช่น active, staged, on-call เป็นเพียง screen behavior state
- Visibility state ไม่ใช่ architecture classification
- Surveillance เป็น Domain
- Tactical Map / Common Spatial View เป็น Shared Operational Layer
- ห้ามใช้สองสิ่งนี้แทนกัน
