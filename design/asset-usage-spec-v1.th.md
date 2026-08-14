# กฎการใช้ Asset v1

## วัตถุประสงค์

เอกสารฉบับนี้ใช้กำหนดบทบาทของไฟล์ภาพในโฟลเดอร์ `references` เพื่อป้องกันการนำ asset ไปใช้ผิดหน้าที่ระหว่างงานออกแบบ shell, spec และ implementation

การจัดหมวดในเอกสารฉบับนี้เป็น “กฎการใช้ asset” ไม่ใช่คำสั่งให้นำ asset ไปวางใน runtime ทันที

## 1. หมวดของ Asset

Asset ทุกไฟล์ต้องถูกตีความตามหนึ่งในบทบาทต่อไปนี้

- Logo / Domain Identity
- Page Identity / Hero Image
- Background / Atmosphere
- Reference Only

ห้ามใช้ไฟล์เดียวทำหลายบทบาทโดยไม่มีการอนุมัติชัดเจน

## 2. Domain Identity Assets

ไฟล์ต่อไปนี้ถือเป็น asset ประจำหมวดงานโดยปริยาย

- `FO.png`
- `FDC.png`
- `Surveillance.png`
- `Howitzer.png`
- `Weapons.png`

หน้าที่หลัก:
- แสดงตัวแทนของหมวดงาน
- ใช้ใน domain switcher
- ใช้ใน login/domain selection
- ใช้ใน workspace label
- ใช้ใน page/domain identity block

ข้อห้าม:
- ห้ามใช้เป็นพื้นหลังเต็มหน้าโดยอัตโนมัติ
- ห้ามยืดเป็น hero image โดยไม่มีการตรวจความเหมาะสม
- ห้ามใช้เป็น decorative pattern ซ้ำทั่วหน้า

## 3. Page Identity / Hero Assets

ไฟล์ต่อไปนี้ถือเป็น page identity หรือ hero image ของหน้า

- `Admin.webp`
- `MAIN.webp`

หน้าที่หลัก:
- สร้าง first impression ของหน้า
- ใช้ในหน้า Admin/OWN
- ใช้ในหน้า Dashboard main/login
- ใช้เป็น page header image หรือ hero image ได้

ข้อกำหนด:
- ต้องตรวจ readability ก่อนใช้ร่วมกับข้อความ
- หากวางหลังข้อความ ต้องมี overlay/dim/contrast control ที่เพียงพอ

## 4. Background / Atmosphere Asset

ไฟล์ต่อไปนี้ถือเป็น asset สำหรับพื้นหลังและบรรยากาศ

- `BG.png`

หน้าที่หลัก:
- ใช้เป็น background ของระบบ
- ใช้เป็น atmosphere layer
- ใช้เป็นพื้นหลังของ login/dashboard ได้

ข้อกำหนด:
- ต้องไม่แย่งสายตาจากข้อมูลหลัก
- ต้องไม่ทำให้ panel หรือข้อความอ่านยาก
- ต้องทำหน้าที่เป็น support layer ไม่ใช่ primary information carrier

## 5. Reference-Only Asset

ไฟล์ต่อไปนี้ถือเป็น reference-only asset

- `360_F_315894483_EjiMpP1Qnh2ptP4doZfLsYACsCns0M04.jpg`

หน้าที่หลัก:
- ใช้เป็น moodboard
- ใช้เป็น visual reference
- ใช้เป็นแหล่งแรงบันดาลใจด้าน style

ข้อห้าม:
- ห้ามใช้เป็น production UI asset โดยอัตโนมัติ
- ห้ามใช้แทน logo, hero, หรือ background จนกว่าจะมีการอนุมัติชัดเจน

## 6. Mapping ปัจจุบันของระบบ

### Domain Identity

- FO → `FO.png`
- FDC → `FDC.png`
- Surveillance → `Surveillance.png`
- Howitzer → `Howitzer.png`
- กระสุน → `Weapons.png`

### Page Identity

- Admin/OWN → `Admin.webp`
- Dashboard Main/Login → `MAIN.webp`

### Global Background

- System Background / Atmosphere → `BG.png`

### Reference Only

- Visual inspiration / reference → `360_F_315894483_EjiMpP1Qnh2ptP4doZfLsYACsCns0M04.jpg`

## 7. กฎห้ามใช้ผิดบทบาท

- ห้ามใช้ logo เป็น full-page background โดยอัตโนมัติ
- ห้ามใช้ hero image เป็น icon domain ซ้ำแบบย่อโดยอัตโนมัติ
- ห้ามใช้ background image เป็นตัวแบกข้อมูลหลัก
- ห้ามใช้ reference-only asset เป็น production asset โดยไม่มีการอนุมัติ

## 8. สถานะในระยะนี้

ในระยะนี้ ให้ถือว่า asset ทุกตัวอยู่ในสถานะ “พร้อมใช้เชิงความหมาย” แต่ยังไม่ถือว่าได้รับการผูกเข้ากับ runtime จริง

กล่าวคือ:
- อนุญาตให้ใช้ใน spec
- อนุญาตให้ใช้ใน shell planning
- อนุญาตให้ใช้ในการออกแบบ visual mapping
- แต่ยังไม่ถือเป็นคำสั่งให้ฝัง asset ลง implementation จนกว่าจะได้รับการอนุมัติในขั้นถัดไป
