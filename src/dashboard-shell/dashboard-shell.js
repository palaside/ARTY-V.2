const stateClassMap = {
  live: "state-live",
  warning: "state-warning",
  critical: "state-critical",
  stale: "state-stale",
  locked: "state-locked",
};

const stateLogCopy = {
  live: "แผงสถานการณ์ร่วมอยู่ในสถานะแสดงผลจริง",
  warning: "แผงสถานการณ์ร่วมเข้าสู่สถานะเตือน",
  critical: "แผงสถานการณ์ร่วมอยู่ในสถานะวิกฤต",
  stale: "แผงสถานการณ์ร่วมอยู่ในสถานะรอข้อมูล",
  locked: "แผงสถานการณ์ร่วมถูกล็อกสำหรับการทบทวน",
};

const modeConfigs = {
  fo: {
    modeReadout: "พื้นที่ทำงาน FO",
    slotAName: "FO / ทำงานหลัก",
    slotBName: "FDC / จำกัดการเข้าถึง",
    sharedLoad: "เน้นเป้าหมาย",
    slotAState: ["ทำงานหลัก", "state-live"],
    slotARole: "FO / หลัก",
    slotATitle: "พื้นที่ทำงานผู้ตรวจการณ์หน้า",
    slotACopy: "การสังเกต การเข้าถึงเป้าหมาย การปรับแก้ และการยืนยันเป้าหมายยังเป็นแกนหลักในพื้นที่ทำงาน FO",
    slotAReason: "FO / พื้นที่หลัก",
    slotARulers: ["สังเกต", "เป้าหมาย", "ส่งต่อ"],
    slotBState: ["ล็อก", "state-locked"],
    slotBRole: "OPSEC / ปกปิด",
    slotBTitle: "พื้นที่ทำงานแบบจำกัด",
    slotBCopy: "รายละเอียดภายใน FDC ถูกซ่อนจากมุมมอง FO แผนที่ร่วมยังเป็นพื้นที่ร่วมเดียวในมุมมองนี้",
    stageState: ["ล็อก", "state-locked"],
    stageTitle: "โดเมนอื่นถูกล็อก",
    stageCopy: "รายละเอียดของแผนที่ / สำรวจ ส่วนยิง และกระสุนยังถูกปกปิดจากพื้นที่ FO",
    placements: { fo: "ทำงานหลัก", fdc: "ล็อก", surv: "ล็อก", how: "ล็อก", ammo: "ล็อก" },
    situational: "บริบทผู้ตรวจการณ์ / เป้าหมาย / จุดตกกระทบ",
    status: ["FO โฟกัส", "03", "ร่วม", "01"],
    workflow: [
      ["พื้นที่ทำงาน FO ทำงานอยู่", "การสังเกตและการเข้าถึงเป้าหมายยังเป็นพื้นผิวหลักในโหมดนี้"],
      ["FDC ถูกล็อก", "รายละเอียดแกนตัดสินใจถูกซ่อนจากมุมมอง FO แต่แผนที่ร่วมยังมองเห็นได้"],
      ["โดเมนอื่นถูกล็อก", "รายละเอียดของแผนที่ / สำรวจ ส่วนยิง และกระสุนยังถูกปกปิดจากพื้นที่ FO"],
    ],
    telemetryState: ["สนับสนุน", "state-stale"],
    telemetryCopy: "ค่าร่วมยังคงใช้ร่วมกัน แต่รายละเอียดโดเมนที่ไม่ได้รับอนุญาตยังถูกปกปิดในโหมด FO",
    metrics: [["ระยะ", "-- m"], ["ทิศทาง", "-- mil"], ["เวลาเดินทาง", "-- s"]],
    eventHeaders: ["กระบวนงาน FO / รายละเอียด", "เส้นทางร่วม / ปกปิด"],
    classes: { a: "is-promoted", b: "is-blocking", status: "is-blocking", workflow: "is-blocking" },
  },
  fdc: {
    modeReadout: "พื้นที่ทำงาน FDC",
    slotAName: "FDC / ทำงานหลัก",
    slotBName: "FO / รอง",
    sharedLoad: "แกนตัดสินใจ",
    slotAState: ["ทำงานหลัก", "state-live"],
    slotARole: "FDC / หลัก",
    slotATitle: "พื้นที่ทำงานศูนย์ตัดสินใจ",
    slotACopy: "แกนตัดสินใจรับบริบทเป้าหมายที่ยืนยันแล้ว และคงกระบวนงานการยิงให้อยู่ศูนย์กลางในพื้นที่ทำงาน FDC",
    slotAReason: "FDC / พื้นที่หลัก",
    slotARulers: ["ตัดสินใจ", "ตรวจสอบ", "ลงมือ"],
    slotBState: ["รอง", "state-stale"],
    slotBRole: "FO / แสดงผลร่วม",
    slotBTitle: "พื้นที่ทำงานผู้ตรวจการณ์หน้า",
    slotBCopy: "การสังเกตและการเข้าถึงเป้าหมายยังมองเห็นได้ข้างแกนตัดสินใจ เพื่อให้การส่งต่อชัดเจน",
    stageState: ["จัดเตรียม", "state-warning"],
    stageTitle: "แผนที่ / สำรวจ พร้อม",
    stageCopy: "พื้นที่ทำงานตรวจสอบเชิงพื้นที่พร้อมจะถูกยกระดับเมื่อความถูกต้องของเป้าหมายหรือพิกัดกลายเป็นคอขวด",
    placements: { fo: "รอง", fdc: "ทำงานหลัก", surv: "จัดเตรียม", how: "รอเรียกใช้งาน", ammo: "รอเรียกใช้งาน" },
    situational: "ภารกิจ / เป้าหมาย / ความปลอดภัย",
    status: ["FDC โฟกัส", "03", "ร่วม", "02"],
    workflow: [
      ["พื้นที่ทำงาน FDC ทำงานอยู่", "แกนตัดสินใจยังอยู่กึ่งกลาง ในขณะที่อินพุตเป้าหมายและกระบวนงานการยิงยังมองเห็นได้"],
      ["FO ยังคงมองเห็นได้", "บริบทการสังเกตยังอยู่ใกล้ ๆ เพื่อให้การส่งต่อชัดเจน"],
      ["การตรวจสอบยังอยู่ในขั้นเตรียม", "แผนที่ / สำรวจยังอยู่ลำดับถัดไปหากความถูกต้องของพิกัดกลายเป็นคอขวด"],
    ],
    telemetryState: ["สนับสนุน", "state-stale"],
    telemetryCopy: "ค่าร่วมจะขยับไปเน้นสถานะภารกิจ อินพุตเป้าหมาย และประตูความปลอดภัยในโหมด FDC",
    metrics: [["ภารกิจ", "พร้อม"], ["เป้าหมาย", "--"], ["ความปลอดภัย", "ล็อก"]],
    eventHeaders: ["กระบวนงาน FDC / รายละเอียด", "ประตูทับสิทธิ์ / เฉยไว้"],
    classes: { a: "is-promoted", b: "", status: "", workflow: "" },
  },
  spatial: {
    modeReadout: "การตรวจสอบเชิงพื้นที่",
    slotAName: "แผนที่ / สำรวจ / ทำงานหลัก",
    slotBName: "FO / รอง",
    sharedLoad: "เน้นการตรวจสอบ",
    slotAState: ["ยกระดับ", "state-warning"],
    slotARole: "ยกระดับเพราะการตรวจสอบ",
    slotATitle: "พื้นที่ทำงานแผนที่ / สำรวจ",
    slotACopy: "ความถูกต้องเชิงพื้นที่ การเดินเส้น การตัดกัน การปรับเทียบ และการตรวจสอบจบวงรอบจะเป็นแกนหลักจนกว่าความมั่นใจของพิกัดจะกลับมา",
    slotAReason: "ยกระดับเพราะการตรวจสอบเชิงพื้นที่",
    slotARulers: ["กริด", "เรขาคณิต", "ตรวจสอบ"],
    slotBState: ["รอง", "state-stale"],
    slotBRole: "FO / บริบทเป้าหมาย",
    slotBTitle: "พื้นที่ทำงานผู้ตรวจการณ์หน้า",
    slotBCopy: "FO ยังมองเห็นได้ ในขณะที่การตรวจสอบเชิงพื้นที่กำลังคลี่คลายความถูกต้องของเป้าหมายและพิกัด",
    stageState: ["จัดเตรียม", "state-stale"],
    stageTitle: "FDC รอจัดเตรียม",
    stageCopy: "แกนตัดสินใจรออยู่หลังการตรวจสอบจนกว่าความเชิงพื้นที่จะมั่นใจพอที่จะดำเนินต่อ",
    placements: { fo: "รอง", fdc: "จัดเตรียม", surv: "ทำงานหลัก", how: "รอเรียกใช้งาน", ammo: "รอเรียกใช้งาน" },
    situational: "กริด / จุดตัด / จบวงรอบ",
    status: ["เตือนการตรวจสอบ", "02", "จบวงรอบ", "ทบทวน"],
    workflow: [
      ["ความถูกต้องเชิงพื้นที่มาก่อน", "พื้นที่ทำงานสำรวจและระบุตำแหน่งเป็นเจ้าของคอขวดจนกว่าพิกัดเป้าหมายจะเชื่อถือได้"],
      ["FO ยังจับคู่ไว้", "บริบทการสังเกตยังมองเห็นได้ในขณะที่กริดและเรขาคณิตถูกแก้ไข"],
      ["FDC รอการตรวจสอบ", "แกนตัดสินใจยังอยู่ในขั้นเตรียมจนกว่าความเชิงพื้นที่จะกลับมา"],
    ],
    telemetryState: ["เน้นย้ำ", "state-warning"],
    telemetryCopy: "ค่าร่วมตอนนี้จะเน้นมุมทิศ ระยะ ระดับสูง และค่าที่เกี่ยวข้องกับจุดตัด",
    metrics: [["มุมทิศ", "-- mil"], ["ระยะ", "-- m"], ["ระดับสูง", "-- m"]],
    eventHeaders: ["การตรวจสอบเชิงพื้นที่ / รายละเอียด", "แนะนำ / ทบทวน"],
    classes: { a: "is-advisory", b: "", status: "", workflow: "is-advisory" },
  },
  readiness: {
    modeReadout: "ความพร้อมของหมวด",
    slotAName: "FDC / ทำงานหลัก",
    slotBName: "ส่วนยิง / รอง",
    sharedLoad: "ตรวจความพร้อมของหมวด",
    slotAState: ["ทำงานหลัก", "state-live"],
    slotARole: "FDC / หลัก",
    slotATitle: "พื้นที่ทำงานศูนย์ตัดสินใจ",
    slotACopy: "ผลการยิงยังเป็นแกนหลัก ในขณะที่ความพร้อมของหมวดและเรขาคณิตรายกระบอกกลายเป็นข้อจำกัดหลัก",
    slotAReason: "ทำงานหลัก / ผลการยิง",
    slotARulers: ["ตัดสินใจ", "ตรวจสอบ", "ลงมือ"],
    slotBState: ["ยกระดับ", "state-warning"],
    slotBRole: "ยกระดับเพราะความพร้อม",
    slotBTitle: "พื้นที่ทำงานส่วนยิง",
    slotBCopy: "การจัดวางปืน M.17 ออฟเซ็ต และความพร้อมของหมวดถูกยกระดับ เพราะความพร้อมต่อการปฏิบัติคือคอขวดตอนนี้",
    stageState: ["จัดเตรียม", "state-stale"],
    stageTitle: "FO รอเตรียม",
    stageCopy: "การเข้าถึงเป้าหมายยังใช้งานได้ แต่ไม่ใช่คอขวดหลักของโหมดนี้อีกต่อไป",
    placements: { fo: "จัดเตรียม", fdc: "ทำงานหลัก", surv: "รอเรียกใช้งาน", how: "รอง", ammo: "รอเรียกใช้งาน" },
    situational: "ตำแหน่งปืน / ปืนอ้างอิง / ความสัมพันธ์เป้าหมาย",
    status: ["ธงหน่วย", "04", "ความพร้อม", "ตรวจ"],
    workflow: [
      ["การตัดสินใจยังเป็นศูนย์กลาง", "FDC ยังมองเห็นได้ในขณะที่ความพร้อมต่อการปฏิบัติถูกจัดการภายในโดเมนหมวด"],
      ["ส่วนยิงถูกยกระดับ", "เรขาคณิตและความพร้อมรายกระบอกกลายเป็นพื้นที่ทำงานรองที่ใช้งานอยู่"],
      ["FO จัดเตรียมไว้", "บริบทการสังเกตยังพร้อมใช้งานโดยไม่แย่งความสำคัญของพื้นที่ทำงานทั้งหมด"],
    ],
    telemetryState: ["เน้นย้ำ", "state-warning"],
    telemetryCopy: "ค่าร่วมจะขยับไปเน้นออฟเซ็ตของแต่ละปืน เรขาคณิตอ้างอิง และค่าความพร้อม",
    metrics: [["ปืนอ้างอิง", "G1"], ["ออฟเซ็ต", "-- m"], ["พร้อม", "ตรวจ"]],
    eventHeaders: ["ความพร้อมส่วนยิง / รายละเอียด", "ประตูหมวด / ทบทวน"],
    classes: { a: "", b: "is-advisory", status: "", workflow: "is-advisory" },
  },
  ammo: {
    modeReadout: "ความปลอดภัยกระสุน",
    slotAName: "FDC / ทำงานหลัก",
    slotBName: "กระสุน / รอง",
    sharedLoad: "ล็อกความปลอดภัย",
    slotAState: ["ถูกบล็อก", "state-critical"],
    slotARole: "FDC / ถูกบล็อก",
    slotATitle: "พื้นที่ทำงานศูนย์ตัดสินใจ",
    slotACopy: "แกนตัดสินใจยังมองเห็นได้ แต่กระบวนงานการยิงถูกบล็อกจนกว่าสถานะความปลอดภัยของกระสุนและชนวนจะถูกเคลียร์",
    slotAReason: "ยกระดับอัตโนมัติโดยล็อกความปลอดภัย",
    slotARulers: ["ล็อก", "ตรวจสอบ", "ปลด"],
    slotBState: ["ยกระดับ", "state-critical"],
    slotBRole: "ยกระดับเพราะความปลอดภัยกระสุน",
    slotBTitle: "พื้นที่ทำงานกระสุน",
    slotBCopy: "กระสุน ชนวน ความเข้ากันได้ และสถานะค้างยิงถูกยกระดับ เพราะการเปิดใช้งานการยิงถูกบล็อกที่ชั้นความปลอดภัย",
    stageState: ["รอเรียกใช้งาน", "state-stale"],
    stageTitle: "ส่วนยิงรอเรียกใช้งาน",
    stageCopy: "ความพร้อมของหมวดยังคงมองเห็นได้ผ่านสถานะร่วม แต่ความปลอดภัยของกระสุนเป็นเจ้าของคอขวดในตอนนี้",
    placements: { fo: "รอเรียกใช้งาน", fdc: "ถูกบล็อก", surv: "รอเรียกใช้งาน", how: "รอเรียกใช้งาน", ammo: "รอง" },
    situational: "บริบทเป้าหมาย / ภารกิจสำหรับการตัดสินใจกระสุน",
    status: ["ล็อกการยิง", "01", "ความปลอดภัย", "วิกฤต"],
    workflow: [
      ["ล็อกความปลอดภัยทำงานอยู่", "กระบวนงานการยิงไม่สามารถดำเนินต่อได้จนกว่าสถานะกระสุนและชนวนจะถูกทำให้ถูกต้อง"],
      ["กระสุนถูกยกระดับ", "ความเข้ากันได้ เวลาเซ็ตชนวน และสถานะความปลอดภัยกลายเป็นพื้นที่ทำงานรองที่ใช้งานอยู่"],
      ["FDC ยังมองเห็นได้", "แกนตัดสินใจยังคงอยู่เพื่อให้ผู้ใช้เห็นว่าทำไมการยิงจึงถูกบล็อก"],
    ],
    telemetryState: ["บล็อกอยู่", "state-critical"],
    telemetryCopy: "ค่าร่วมตอนนี้จะเน้นชนวน ความปลอดภัย ความเข้ากันได้ และค่าทางเทคนิคที่เกี่ยวข้องกับการล็อก",
    metrics: [["ชนวน", "--"], ["ปลอดภัย", "ล็อก"], ["ค้างยิง", "ตรวจ"]],
    eventHeaders: ["ความปลอดภัยกระสุน / รายละเอียด", "ยกระดับอัตโนมัติ / บล็อกอยู่"],
    classes: { a: "is-blocking", b: "is-blocking", status: "is-blocking", workflow: "is-blocking" },
  },
};

const capabilityCatalog = {
  fo: {
    title: "ความสามารถของผู้ตรวจการณ์หน้า",
    lead: "การได้มาซึ่งเป้าหมาย การบันทึกการสังเกต และการส่งต่อข้อมูลเข้าสู่ชั้นร่วมภายใต้ OPSEC",
    state: ["10 ฟีเจอร์", "state-live"],
    items: [
      ["1.1 พิกัดกริด", "กำหนดที่ตั้งเป้าหมายด้วยพิกัดกริดและตรวจรูปแบบข้อมูลก่อนส่งต่อ", "พร้อมแสดงผล"],
      ["1.2 โพลาร์", "กำหนดเป้าหมายด้วยมุมทิศ ระยะ และมุมดิ่งในแบบฟอร์มเดียว", "พร้อมแสดงผล"],
      ["1.3 ย้ายจากจุดทราบที่ตั้ง", "กำหนดเป้าหมายจากจุดอ้างอิงด้วยค่าการย้ายที่ผู้ใช้ป้อน", "พร้อมแสดงผล"],
      ["2.1 แสง-เสียง", "เครื่องมือบันทึกช่วงเวลาระหว่างแสงวาบกับเสียงสำหรับใช้ประกอบการประเมินระยะในโหมดฝึก", "โหมดฝึก"],
      ["2.2 สูตรมิลเลียม", "ตัวช่วยจัดรูปข้อมูลความกว้าง ระยะ และมุมมิลสำหรับการทบทวนการสังเกต", "โหมดฝึก"],
      ["2.3 กฎของไซน์", "พื้นที่เตรียมข้อมูลสามเหลี่ยมสำหรับการตรวจทานเรขาคณิตของการสังเกต", "โหมดฝึก / รอสูตรยืนยัน"],
      ["3.1 แฟคเตอร์ ฟตม.", "บันทึกค่าแฟคเตอร์สำหรับการย้ายจุดตามแบบฟอร์มที่ได้รับอนุมัติ", "โหมดฝึก / รอสูตรยืนยัน"],
      ["3.2 แก้ทางข้าง", "บันทึกการย้ายหรือแก้ทางข้างของจุดเป้าหมายก่อนส่งต่อ", "พร้อมแสดงผล"],
      ["4.1 ปรับแก้ระยะ", "บันทึกคำขอปรับแก้ระยะจากการสังเกตจุดตกกระทบ", "พร้อมแสดงผล"],
      ["4.2 ปรับแก้ทางสูง", "บันทึกคำขอปรับแก้ทางสูงหรือความสูงจุดระเบิดเพื่อทบทวนร่วม", "พร้อมแสดงผล"],
      ["5.1 เป้าหมายเคลื่อนที่", "บันทึกทิศทางและความเร็วเป้าหมายเพื่อเตรียมข้อมูลการติดตาม โดยยังไม่คำนวณคำสั่งยิงจริง", "โหมดฝึก"],
      ["5.2 ฉากควันกำบัง", "บันทึกบริบทฉากควันกำบังและสถานะการสังเกตเพื่อส่งต่อในกระบวนงาน", "โหมดฝึก"],
    ],
  },
  fdc: {
    title: "ความสามารถของศูนย์อำนวยการยิง",
    lead: "แกนทบทวนภารกิจ เป้าหมาย สถานะความปลอดภัย และคิวเอกสารจากข้อมูลร่วมที่บทบาทนี้ได้รับอนุญาต",
    state: ["5 โมดูล + สภาพอากาศและลม", "state-live"],
    items: [
      ["โมดูล ๑ · ยิงหาหลักฐานและปรับการยิง", "รวมภารกิจตั้งต้นสำหรับยืนยันข้อมูลและทบทวนการปรับการยิงในชุดฝึก", "โหมดฝึก"],
      ["โมดูล ๒ · กดดันและทำลายฉับพลัน", "รวมภารกิจตอบสนองเร่งด่วนตามสถานการณ์จำลอง โดยไม่สร้างคำสั่งจริง", "โหมดฝึก"],
      ["โมดูล ๓ · ยิงตามแผนและยิงรวม", "รวมภารกิจที่จัดลำดับงานและเตรียมข้อมูลไว้ล่วงหน้าในชุดฝึก", "โหมดฝึก"],
      ["โมดูล ๔ · กระสุนพิเศษและการสนับสนุน", "รวมภารกิจสนับสนุนและผลลัพธ์ปลายทางที่ใช้ทบทวนเท่านั้น", "โหมดฝึก"],
      ["โมดูล ๕ · ป้องกันขั้นสุดท้ายและฉากกั้น", "รวมภารกิจป้องกันพื้นที่สำคัญในสถานการณ์ฝึกแบบจำกัดข้อมูล", "โหมดฝึก"],
      ["สภาพอากาศและลม", "รวบรวมบริบท MET และลมเพื่อทบทวนเท่านั้น ไม่เชื่อมเซนเซอร์จริงและไม่แปลงเป็นคำสั่งยิง", "โหมดฝึก"],
    ],
  },
  spatial: {
    title: "ความสามารถของแผนที่และสำรวจ",
    lead: "จัดการบริบทกริด พิกัด มุมทิศ ระยะ และการตรวจทานความเชื่อมั่นของข้อมูลเชิงพื้นที่",
    state: ["10 โมดูล", "state-warning"],
    items: [
      ["ระยะลาด → ระยะราบ", "แปลงระยะลาดและมุมดิ่งเป็นระยะราบสำหรับการวางจุดในชุดข้อมูลฝึก", "พร้อมแสดงผล"],
      ["พิกัดตาราง / พิกัดฉาก UTM", "คำนวณพิกัดตะวันออกและพิกัดเหนือจากสถานีตั้งต้น", "พร้อมแสดงผล"],
      ["ผลต่างทางสูง / ความต่างระดับ", "คำนวณผลต่างระดับจากระยะลาด มุมดิ่ง และความสูงเครื่องมือ/เป้า", "พร้อมแสดงผล"],
      ["มุมภาคทิศทาง / มุมภาคตาราง", "แสดงมุมภาคตารางและมุมกลับทิศในหน่วยมิลเลียม", "พร้อมแสดงผล"],
      ["การสกัดตรง / การสกัดกลับ", "workflow จุดตัดจากสถานีทราบที่ตั้ง หรือหาสถานีจากหมุดอ้างอิง", "โหมดฝึก"],
      ["ค่าแก้บรรยากาศ ATM. PPM", "บันทึกอุณหภูมิ ความกดอากาศ และค่า PPM เพื่อคำนวณระยะที่แก้แล้ว", "พร้อมแสดงผล"],
      ["ชั้นความถูกต้องของงานแผนที่", "ตรวจอัตราส่วน closure error และสถานะผ่านเกณฑ์ฝึก", "พร้อมแสดงผล"],
      ["การเลื่อนตาราง / การหมุนตาราง", "แสดงผลการเลื่อนแกนและการหมุนตารางจากค่าที่ป้อน", "พร้อมแสดงผล"],
      ["ทบ.344", "ชุดงานคำนวณวงรอบและแบบฟอร์มพิกัดทางทหาร ทบ.344-201 และ ทบ.344-202", "พร้อมแสดงผล"],
      ["เขตความปลอดภัยบนแผนที่", "แสดงชั้นข้อมูลความปลอดภัยตามบทบาท โดยไม่เปิดเผยชั้นปฏิบัติการที่ FO ไม่มีสิทธิ์เห็น", "พร้อมแสดงผล"],
    ],
  },
  readiness: {
    title: "ความสามารถของส่วนยิง",
    lead: "ลำดับงานตั้งปืน การทบทวน M.17 และการบันทึกข้อมูลวิเคราะห์หลุมระเบิดในกรอบการฝึก",
    state: ["14 โมดูล", "state-warning"],
    items: [
      ["๑. การตั้งกล้องกองร้อย ๕ วิธี", "แสดงขั้นตอนการตั้งทิศทางทั้ง ๕ วิธีในโหมดฝึก พร้อมจุดตรวจทาน", "พร้อมแสดงผล"],
      ["๒. การยิงฉุกเฉิน", "แสดงลำดับสถานะฉุกเฉินสำหรับการฝึก โดยไม่ส่งคำสั่งไปยังอุปกรณ์จริง", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๓. วิเคราะห์หลุมระเบิด ๗ ขั้นตอน", "บันทึกข้อมูลสนามตัวอย่างตั้งแต่รักษาพื้นที่จนถึงรายงานเบื้องต้น", "พร้อมแสดงผล"],
      ["๔. การดักเป้าหมายเคลื่อนที่", "แสดงแบบจำลองข้อมูลเป้าหมายเคลื่อนที่ โดยไม่ให้คำแนะนำยิงจริง", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๕. การหาระยะกำบัง", "แสดงข้อมูลสิ่งกีดขวางและสถานะตรวจทานในชุดข้อมูลฝึก", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๖. ฐานสามเหลี่ยมคงที่", "แสดงโครงสร้างการสำรวจฐานและข้อมูลตัวอย่างสำหรับการฝึก", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๗. เครื่องตั้งมุมยิงประณีต M1/M1A1", "แสดงช่องตรวจทานเครื่องมือและสถานะยืนยันแบบกดค้าง", "พร้อมแสดงผล"],
      ["๘. การยิงกวาดและยิงเป็นเขต", "แสดงรูปแบบพื้นที่จำลอง โดยไม่มีคำสั่งยิงจริง", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๙. แผ่นกรุย M.17", "แสดงจุดอ้างอิง ปืนตัวอย่าง ๖ กระบอก และมุมมองรายกระบอก/ภาพรวม", "พร้อมแสดงผล"],
      ["๑๐. มุมยิงต่ำสุด", "แสดงประตูความปลอดภัยและสถานะตรวจทานข้อมูลฝึก โดยไม่คำนวณใช้งานจริง", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๑๑. ตรรกะชนวน PD / VT", "แสดงสถานะชนวนและ safety gate ในโหมดฝึก โดยไม่ควบคุมชนวนจริง", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๑๒. ความต่างทิศและต่างระยะของปืน", "แสดงค่าออฟเซ็ตตัวอย่างเทียบกับจุดอ้างอิงของชุดฝึก", "โหมดฝึก / รอข้อมูลอ้างอิง"],
      ["๑๓. การวัดมุมดิ่งด้วย M.2", "แสดงการเชื่อมโยงเครื่องมือ M.2 และข้อมูลมุมในโหมดฝึก", "พร้อมแสดงผล"],
      ["๑๔. รายงานรอง ผบ.ร้อย ป. ๕ ตอน", "จัดกลุ่มข้อมูลฝึกสำหรับพรีวิวรายงานและ Event Log โดยไม่ส่งคำสั่งภายนอก", "พร้อมแสดงผล"],
    ],
  },
  ammo: {
    title: "ความสามารถของกระสุนและอาวุธ",
    lead: "ข้อมูลต้นทางของกระสุน ชนวน ความเข้ากันได้ และสถานะความปลอดภัยที่ส่งผลต่อชั้นตัดสินใจ",
    state: ["5 โมดูลฝึก", "state-critical"],
    items: [
      ["โมดูล ๑ · แคตตาล็อกกระสุนและชนวน", "แสดงรายการตัวอย่างกระสุน ชนวน และดินขับสำหรับการเรียนรู้โครงสร้าง โดยไม่ใช่ยอดคลังจริง", "โหมดฝึก"],
      ["โมดูล ๒ · ตรวจความเข้ากันได้", "ตรวจความครบของคู่ข้อมูลตัวอย่าง โดยไม่ตั้งชนวนหรือควบคุมอาวุธจริง", "โหมดฝึก"],
      ["โมดูล ๓ · ประตูความปลอดภัย", "แสดงอินเตอร์ล็อกและแนวทางหยุดขั้นตอนในสถานการณ์จำลอง", "ล็อกการยิงจริง"],
      ["โมดูล ๔ · คลังความรู้และเอกสารอ้างอิง", "อ่านโครงสร้างข้อมูลและสถานะเอกสารอ้างอิง โดยไม่แสดงค่าหรือขั้นตอนใช้งานจริง", "อ่านอย่างเดียว"],
      ["โมดูล ๕ · บันทึกกิจกรรมฝึก", "บันทึกเฉพาะกิจกรรมจำลอง ไม่ตัดยอดคลังและไม่บันทึกคำสั่งยิง", "โหมดฝึก"],
    ],
  },
};

const situationalMapState = {
  zoom: 1,
  minZoom: 0.8,
  maxZoom: 2.4,
  panX: 0,
  panY: 0,
  selectedX: null,
  selectedY: null,
  dragging: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  startPanX: 0,
  startPanY: 0,
};

let situationalMapNodes = null;
let activeModeKey = "fo";
let googleSituationalMap = null;
let googleSituationalMarker = null;
const buildGoogleMapsApiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || "";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateClock() {
  const node = document.getElementById("clock-readout");
  if (!node) return;

  const now = new Date();
  node.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
}

function appendLog(message) {
  const eventLog = document.getElementById("event-log");
  if (!eventLog) return;

  const row = document.createElement("div");
  row.className = "event-row";

  const stamp = document.createElement("span");
  stamp.textContent = new Date().toLocaleTimeString("en-GB", { hour12: false });

  const copy = document.createElement("p");
  copy.textContent = message;

  const tag = document.createElement("em");
  tag.textContent = "โหมด";

  row.append(stamp, copy, tag);
  eventLog.prepend(row);
}

function setChip(node, text, stateClass) {
  if (!node) return;
  Object.values(stateClassMap).forEach((className) => node.classList.remove(className));
  if (stateClass) node.classList.add(stateClass);
  node.textContent = text;
}

function setText(id, text) {
  const node = document.getElementById(id);
  if (node) node.textContent = text;
}

function getSituationalMapNodes() {
  if (situationalMapNodes) return situationalMapNodes;

  situationalMapNodes = {
    canvas: document.getElementById("situational-map-canvas"),
    terrain: document.querySelector(".situational-terrain"),
    markerLayer: document.getElementById("situational-marker-layer"),
    googleLayer: document.getElementById("google-map-layer"),
    coordinate: document.getElementById("situational-coordinate"),
    mapMode: document.getElementById("situational-map-mode"),
    zoom: document.getElementById("situational-zoom"),
    provider: document.getElementById("situational-map-provider"),
  };

  return situationalMapNodes;
}

function renderSituationalPin() {
  const { markerLayer } = getSituationalMapNodes();
  if (!markerLayer) return;

  markerLayer.replaceChildren();
  if (situationalMapState.selectedX === null || situationalMapState.selectedY === null) return;

  const pin = document.createElement("div");
  pin.className = "situational-pin";
  pin.style.left = `${situationalMapState.selectedX.toFixed(3)}%`;
  pin.style.top = `${situationalMapState.selectedY.toFixed(3)}%`;

  const label = document.createElement("span");
  label.className = "situational-pin-label";
  label.textContent = "จุดที่เลือก";

  const dot = document.createElement("span");
  dot.className = "situational-pin-dot";

  pin.append(dot, label);
  markerLayer.append(pin);
}

function syncSituationalReadouts() {
  const { coordinate, mapMode, zoom } = getSituationalMapNodes();

  if (coordinate) {
    coordinate.textContent =
      situationalMapState.selectedX === null || situationalMapState.selectedY === null
        ? "X: -- / Y: --"
        : `X: ${situationalMapState.selectedX.toFixed(3)} / Y: ${situationalMapState.selectedY.toFixed(3)}`;
  }

  if (mapMode) {
    mapMode.textContent = situationalMapState.dragging
      ? "มุมมอง: กำลังเลื่อนแผนที่"
      : "มุมมอง: แผนที่ Tactical / โต้ตอบ";
  }

  if (zoom) {
    zoom.textContent = `ซูม: ${Math.round(situationalMapState.zoom * 100)}%`;
  }
}

function updateSituationalMapTransform() {
  const { canvas, terrain, markerLayer } = getSituationalMapNodes();
  if (!canvas || !terrain || !markerLayer) return;

  const transform = `translate(${situationalMapState.panX}px, ${situationalMapState.panY}px) scale(${situationalMapState.zoom})`;
  terrain.style.transform = transform;
  markerLayer.style.transform = transform;
  canvas.classList.toggle("is-dragging", situationalMapState.dragging);
  syncSituationalReadouts();
}

function resetSituationalMap() {
  situationalMapState.zoom = 1;
  situationalMapState.panX = 0;
  situationalMapState.panY = 0;
  situationalMapState.selectedX = null;
  situationalMapState.selectedY = null;
  situationalMapState.dragging = false;
  if (googleSituationalMarker) googleSituationalMarker.setMap(null);
  googleSituationalMarker = null;
  renderSituationalPin();
  updateSituationalMapTransform();
}

function getGoogleMapsApiKey() {
  if (buildGoogleMapsApiKey) return buildGoogleMapsApiKey.trim();
  return typeof window.ARTY_RUNTIME_CONFIG?.googleMapsApiKey === "string"
    ? window.ARTY_RUNTIME_CONFIG.googleMapsApiKey.trim()
    : "";
}

function loadGoogleMapsScript(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  const existingScript = document.querySelector('script[data-google-maps="true"]');
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener("load", () => resolve(window.google?.maps), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("โหลด Google Maps ไม่สำเร็จ")), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => window.google?.maps ? resolve(window.google.maps) : reject(new Error("ไม่พบ Google Maps API"));
    script.onerror = () => reject(new Error("โหลด Google Maps ไม่สำเร็จ"));
    document.head.append(script);
  });
}

async function initGoogleSituationalMap() {
  const { canvas, googleLayer, provider } = getSituationalMapNodes();
  const apiKey = getGoogleMapsApiKey();
  if (!canvas || !googleLayer || !apiKey || window.location.protocol === "file:") {
    if (provider) provider.textContent = "แหล่งแผนที่ / Tactical Map สำรองในเครื่อง";
    return;
  }

  try {
    const maps = await loadGoogleMapsScript(apiKey);
    googleSituationalMap = new maps.Map(googleLayer, {
      center: { lat: 15.87, lng: 100.99 },
      zoom: 6,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: false,
      clickableIcons: false,
    });
    googleSituationalMap.addListener("click", (event) => {
      if (!event.latLng) return;
      if (googleSituationalMarker) googleSituationalMarker.setMap(null);
      googleSituationalMarker = new maps.Marker({ map: googleSituationalMap, position: event.latLng, title: "จุดที่เลือก" });
      setText("situational-coordinate", `พิกัดตัวอย่าง: ${event.latLng.lat().toFixed(5)}, ${event.latLng.lng().toFixed(5)}`);
      setText("situational-map-mode", "มุมมอง: Google Maps / จุดที่เลือก");
      appendLog("ปักหมุดบน Google Maps สำเร็จ (ข้อมูลตัวอย่าง)");
    });
    canvas.classList.add("is-google-map");
    if (provider) provider.textContent = "แหล่งแผนที่ / Google Maps";
    setText("situational-state", "Google Maps พร้อมใช้");
  } catch (error) {
    if (provider) provider.textContent = "แหล่งแผนที่ / สำรองในเครื่อง (Google Maps โหลดไม่สำเร็จ)";
    appendLog(error instanceof Error ? error.message : "Google Maps โหลดไม่สำเร็จ");
  }
}

function setSituationalPointFromClient(clientX, clientY, shouldLog = true) {
  const { canvas } = getSituationalMapNodes();
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  const mapX = (localX - situationalMapState.panX) / situationalMapState.zoom;
  const mapY = (localY - situationalMapState.panY) / situationalMapState.zoom;

  situationalMapState.selectedX = clamp((mapX / rect.width) * 100, 0, 100);
  situationalMapState.selectedY = clamp((mapY / rect.height) * 100, 0, 100);

  renderSituationalPin();
  updateSituationalMapTransform();

  if (shouldLog) {
    appendLog(
      `ปักหมุด Tactical Map ที่ X ${situationalMapState.selectedX.toFixed(3)} / Y ${situationalMapState.selectedY.toFixed(3)}`,
    );
  }
}

function zoomSituationalMap(factor, clientX, clientY) {
  const { canvas } = getSituationalMapNodes();
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const nextZoom = clamp(situationalMapState.zoom * factor, situationalMapState.minZoom, situationalMapState.maxZoom);
  if (nextZoom === situationalMapState.zoom) return;

  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  const nextPanX = localX - ((localX - situationalMapState.panX) / situationalMapState.zoom) * nextZoom;
  const nextPanY = localY - ((localY - situationalMapState.panY) / situationalMapState.zoom) * nextZoom;
  const clampX = rect.width * 2;
  const clampY = rect.height * 2;

  situationalMapState.zoom = nextZoom;
  situationalMapState.panX = clamp(nextPanX, -clampX, clampX);
  situationalMapState.panY = clamp(nextPanY, -clampY, clampY);

  updateSituationalMapTransform();
}

function nudgeSituationalMap(deltaX, deltaY) {
  const { canvas } = getSituationalMapNodes();
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const clampX = rect.width * 2;
  const clampY = rect.height * 2;

  situationalMapState.panX = clamp(situationalMapState.panX + deltaX, -clampX, clampX);
  situationalMapState.panY = clamp(situationalMapState.panY + deltaY, -clampY, clampY);
  updateSituationalMapTransform();
}

function initSituationalMap() {
  const { canvas } = getSituationalMapNodes();
  if (!canvas) return;

  renderSituationalPin();
  updateSituationalMapTransform();

  canvas.addEventListener("pointerdown", (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    if (event.button !== 0) return;

    canvas.setPointerCapture(event.pointerId);
    situationalMapState.pointerId = event.pointerId;
    situationalMapState.dragging = false;
    situationalMapState.startX = event.clientX;
    situationalMapState.startY = event.clientY;
    situationalMapState.startPanX = situationalMapState.panX;
    situationalMapState.startPanY = situationalMapState.panY;
  });

  canvas.addEventListener("pointermove", (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    if (situationalMapState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - situationalMapState.startX;
    const deltaY = event.clientY - situationalMapState.startY;
    if (!situationalMapState.dragging && Math.hypot(deltaX, deltaY) > 4) {
      situationalMapState.dragging = true;
    }

    if (!situationalMapState.dragging) return;

    const { canvas: canvasNode } = getSituationalMapNodes();
    if (!canvasNode) return;

    const rect = canvasNode.getBoundingClientRect();
    const clampX = rect.width * 2;
    const clampY = rect.height * 2;
    situationalMapState.panX = clamp(situationalMapState.startPanX + deltaX, -clampX, clampX);
    situationalMapState.panY = clamp(situationalMapState.startPanY + deltaY, -clampY, clampY);
    updateSituationalMapTransform();
  });

  const finishPointer = (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    if (situationalMapState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - situationalMapState.startX;
    const deltaY = event.clientY - situationalMapState.startY;

    if (!situationalMapState.dragging && Math.hypot(deltaX, deltaY) < 6) {
      setSituationalPointFromClient(event.clientX, event.clientY);
    }

    situationalMapState.pointerId = null;
    situationalMapState.dragging = false;
    updateSituationalMapTransform();
  };

  canvas.addEventListener("pointerup", finishPointer);
  canvas.addEventListener("pointercancel", finishPointer);
  canvas.addEventListener("wheel", (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    zoomSituationalMap(factor, event.clientX, event.clientY);
  }, { passive: false });

  canvas.addEventListener("dblclick", (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    event.preventDefault();
    setSituationalPointFromClient(event.clientX, event.clientY);
  });

  canvas.addEventListener("keydown", (event) => {
    if (canvas.classList.contains("is-google-map")) return;
    const step = event.shiftKey ? 48 : 24;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        nudgeSituationalMap(0, step);
        break;
      case "ArrowDown":
        event.preventDefault();
        nudgeSituationalMap(0, -step);
        break;
      case "ArrowLeft":
        event.preventDefault();
        nudgeSituationalMap(step, 0);
        break;
      case "ArrowRight":
        event.preventDefault();
        nudgeSituationalMap(-step, 0);
        break;
      case "+":
      case "=":
        event.preventDefault();
        zoomSituationalMap(1.08, rectCenterX(canvas), rectCenterY(canvas));
        break;
      case "-":
      case "_":
        event.preventDefault();
        zoomSituationalMap(0.92, rectCenterX(canvas), rectCenterY(canvas));
        break;
      case "0":
        event.preventDefault();
        resetSituationalMap();
        break;
      default:
        break;
    }
  });

  window.addEventListener("resize", updateSituationalMapTransform);
  void initGoogleSituationalMap();
}

function rectCenterX(node) {
  return node.getBoundingClientRect().left + node.getBoundingClientRect().width / 2;
}

function rectCenterY(node) {
  return node.getBoundingClientRect().top + node.getBoundingClientRect().height / 2;
}

function renderCapabilityCatalog(modeKey) {
  const catalog = capabilityCatalog[modeKey];
  const list = document.getElementById("capability-list");
  if (!catalog || !list) return;

  setText("capability-deck-title", catalog.title);
  setText("capability-deck-lead", catalog.lead);
  setChip(document.getElementById("capability-deck-state"), catalog.state[0], catalog.state[1]);

  list.replaceChildren();
  catalog.items.forEach(([title, description, state]) => {
    const card = document.createElement("details");
    card.className = "capability-card";

    const summary = document.createElement("summary");
    const titleBlock = document.createElement("span");
    const titleNode = document.createElement("strong");
    const stateNode = document.createElement("small");
    titleNode.textContent = title;
    stateNode.textContent = state;
    titleBlock.append(titleNode, stateNode);
    summary.append(titleBlock);

    const copy = document.createElement("p");
    copy.textContent = description;
    card.append(summary, copy);
    list.append(card);
  });
}

function createCapabilityCard([title, description, state]) {
  const card = document.createElement("details");
  card.className = "capability-card";

  const summary = document.createElement("summary");
  const titleBlock = document.createElement("span");
  const titleNode = document.createElement("strong");
  const stateNode = document.createElement("small");
  titleNode.textContent = title;
  stateNode.textContent = state;
  titleBlock.append(titleNode, stateNode);
  summary.append(titleBlock);

  const copy = document.createElement("p");
  copy.textContent = description;
  card.append(summary, copy);
  return card;
}

function openWorkspaceView(modeKey) {
  const catalog = capabilityCatalog[modeKey];
  const view = document.getElementById("workspace-view");
  const features = document.getElementById("workspace-view-features");
  const foForm = document.getElementById("shell-fo-form");
  const howitzerPanel = document.getElementById("shell-howitzer-panel");
  if (!catalog || !view || !features) return;

  setMode(modeKey);
  setText("workspace-view-title", catalog.title);
  setText("workspace-view-lead", catalog.lead);
  setText("workspace-view-mode", modeConfigs[modeKey].modeReadout);
  setChip(document.getElementById("workspace-view-state"), catalog.state[0], catalog.state[1]);
  features.replaceChildren(...catalog.items.map(createCapabilityCard));
  if (foForm) foForm.hidden = modeKey !== "fo";
  if (howitzerPanel) howitzerPanel.hidden = modeKey !== "readiness";
  view.hidden = false;
  document.body.classList.add("workspace-view-open");
  window.history.replaceState(null, "", `#workspace=${modeKey}`);
  document.getElementById("close-workspace-button")?.focus();
  appendLog(`เปิดพื้นที่ทำงาน ${modeConfigs[modeKey].modeReadout}`);
}

function updateHowitzerModule(moduleKey) {
  const copy = {
    overview: ["คลังความสามารถส่วนยิง", "เลือกโมดูลเพื่อดูขอบเขตงานฝึก M.17 สถานะปืน การตรวจมุม วิเคราะห์หลุมระเบิด และพรีวิว บขตป."],
    m17: ["M.17 / วางแผนตำแหน่ง", "แสดงจุด ศก.ร้อย ปืนตัวอย่าง ๖ กระบอก และออฟเซ็ตในแผนผังฝึก"],
    guns: ["ตารางสถานะปืน", "แสดงสถานะจำลองรายกระบอกและปุ่มตรวจทาน โดยไม่มีการส่งคำสั่งไปยังอุปกรณ์จริง"],
    crater: ["วิเคราะห์หลุมระเบิด", "บันทึกข้อมูลสนามตัวอย่าง แสดง marker จุดฝึก และจัดทำรายงานเบื้องต้น"],
    report: ["บขตป. ตอนที่ ๑", "พรีวิวข้อมูลจากชุดฝึกและคิวเอกสารร่วม ไม่สร้างพิกัดปืนจริงและไม่สั่งยิงตอบโต้"],
  }[moduleKey] || [];
  setText("shell-howitzer-title", copy[0] || "พื้นที่ทำงานส่วนยิง");
  const readout = document.getElementById("shell-howitzer-readout");
  if (!readout) return;
  readout.replaceChildren();
  const title = document.createElement("strong");
  title.textContent = copy[0] || "พื้นที่ทำงานส่วนยิง";
  const description = document.createElement("p");
  description.textContent = copy[1] || "ข้อมูลฝึกเท่านั้น";
  readout.append(title, description);
  document.querySelectorAll("[data-howitzer-module]").forEach((button) => button.classList.toggle("is-active", button.getAttribute("data-howitzer-module") === moduleKey));
}

function updateFoFormReadout() {
  const easting = document.getElementById("shell-fo-easting")?.value.trim() || "";
  const northing = document.getElementById("shell-fo-northing")?.value.trim() || "";
  const coordinate = document.getElementById("shell-fo-coordinate-readout");
  const elevation = document.getElementById("shell-fo-elevation-readout");
  if (!coordinate || !elevation) return;
  coordinate.textContent = easting && northing ? `${easting} / ${northing}` : "รอพิกัดเป้าหมาย";
  elevation.textContent = easting === "482110" && northing === "1562210"
    ? "ความแตกต่างสูง (อัตโนมัติ): +25 ม."
    : easting && northing
      ? "ความแตกต่างสูง (อัตโนมัติ): รอข้อมูลระดับฝึก"
      : "ความแตกต่างสูง (อัตโนมัติ): รอพิกัดเป้าหมาย";
}

function closeWorkspaceView() {
  const view = document.getElementById("workspace-view");
  if (!view) return;

  view.hidden = true;
  document.body.classList.remove("workspace-view-open");
  window.history.replaceState(null, "", window.location.pathname);
  document.querySelector(`.mode-button[data-mode="${activeModeKey}"]`)?.focus();
  appendLog("กลับสู่แดชบอร์ดรวม");
}

function setMode(modeKey) {
  const config = modeConfigs[modeKey];
  if (!config) return;

  activeModeKey = modeKey;

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.mode === modeKey);
  });

  setText("mode-readout", config.modeReadout);
  setText("slot-a-name", config.slotAName);
  setText("slot-b-name", config.slotBName);
  setText("shared-load", config.sharedLoad);
  setChip(document.getElementById("slot-a-state"), config.slotAState[0], config.slotAState[1]);
  setText("slot-a-role", config.slotARole);
  setText("slot-a-title", config.slotATitle);
  setText("slot-a-copy", config.slotACopy);
  setText("slot-a-reason", config.slotAReason);
  setText("slot-a-ruler-1", config.slotARulers[0]);
  setText("slot-a-ruler-2", config.slotARulers[1]);
  setText("slot-a-ruler-3", config.slotARulers[2]);

  setChip(document.getElementById("slot-b-state"), config.slotBState[0], config.slotBState[1]);
  setText("slot-b-role", config.slotBRole);
  setText("slot-b-title", config.slotBTitle);
  setText("slot-b-copy", config.slotBCopy);

  setChip(document.getElementById("stage-state"), config.stageState[0], config.stageState[1]);
  setText("stage-title", config.stageTitle);
  setText("stage-copy", config.stageCopy);

  setText("placement-fo", config.placements.fo);
  setText("placement-fdc", config.placements.fdc);
  setText("placement-surv", config.placements.surv);
  setText("placement-how", config.placements.how);
  setText("placement-ammo", config.placements.ammo);

  setText("situational-emphasis", config.situational);
  setText("status-band-label-1", config.status[0]);
  setText("status-band-value-1", config.status[1]);
  setText("status-band-label-2", config.status[2]);
  setText("status-band-value-2", config.status[3]);

  setText("wf-title-1", config.workflow[0][0]);
  setText("wf-copy-1", config.workflow[0][1]);
  setText("wf-title-2", config.workflow[1][0]);
  setText("wf-copy-2", config.workflow[1][1]);
  setText("wf-title-3", config.workflow[2][0]);
  setText("wf-copy-3", config.workflow[2][1]);

  setChip(document.getElementById("telemetry-state"), config.telemetryState[0], config.telemetryState[1]);
  setText("telemetry-copy", config.telemetryCopy);
  setText("metric-label-1", config.metrics[0][0]);
  setText("metric-value-1", config.metrics[0][1]);
  setText("metric-label-2", config.metrics[1][0]);
  setText("metric-value-2", config.metrics[1][1]);
  setText("metric-label-3", config.metrics[2][0]);
  setText("metric-value-3", config.metrics[2][1]);

  setText("event-header-left", config.eventHeaders[0]);
  setText("event-header-right", config.eventHeaders[1]);
  renderCapabilityCatalog(modeKey);

  const slotACard = document.getElementById("slot-a-card");
  const slotBCard = document.getElementById("slot-b-card");
  const workflowPanel = document.querySelector(".workflow-panel");
  const statusPanel = document.querySelector(".status-stack");

  [slotACard, slotBCard, workflowPanel, statusPanel].forEach((node) => {
    if (!node) return;
    node.classList.remove("is-promoted", "is-advisory", "is-blocking");
  });

  if (config.classes.a && slotACard) slotACard.classList.add(config.classes.a);
  if (config.classes.b && slotBCard) slotBCard.classList.add(config.classes.b);
  if (config.classes.workflow && workflowPanel) workflowPanel.classList.add(config.classes.workflow);
  if (config.classes.status && statusPanel) statusPanel.classList.add(config.classes.status);

  appendLog(`สลับไปยัง ${config.modeReadout}`);
}

function setState(node, nextState) {
  if (!node || !stateClassMap[nextState]) return;

  Object.values(stateClassMap).forEach((className) => node.classList.remove(className));
  node.classList.add(stateClassMap[nextState]);
  const stateLabelMap = {
    live: "แสดงผลจริง",
    warning: "สถานะเตือน",
    critical: "วิกฤต",
    stale: "รอข้อมูล",
    locked: "ล็อก",
  };
  node.textContent = stateLabelMap[nextState] || nextState.toUpperCase();
  node.dataset.state = nextState;

  appendLog(stateLogCopy[nextState] || `เปลี่ยนสถานะเป็น ${nextState}`);
}

function openDashboardView() {
  const view = document.getElementById("dashboard-view");
  if (!view) return;
  closeWorkspaceView();
  view.hidden = false;
  document.body.classList.add("workspace-view-open");
  window.history.replaceState(null, "", "#dashboard");
  document.getElementById("shell-username")?.focus();
  appendLog("เปิดหน้าแดชบอร์ดเข้าสู่ระบบ");
}

function closeDashboardView() {
  const view = document.getElementById("dashboard-view");
  if (!view) return;
  view.hidden = true;
  document.body.classList.remove("workspace-view-open");
  window.history.replaceState(null, "", window.location.pathname);
  document.querySelector('.mode-tile[data-shell-view="dashboard"]')?.focus();
}

function wireDashboardLogin() {
  document.getElementById("close-dashboard-button")?.addEventListener("click", closeDashboardView);
  document.getElementById("shell-login-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement) || !form.reportValidity()) return;
    setText("shell-login-status", "ข้อมูลครบถ้วนแล้ว — ระบบหลักจะยืนยันบัญชีและสิทธิ์ก่อนเปิดพื้นที่ทำงาน");
    appendLog("ส่งข้อมูลเข้าสู่ขั้นตอนยืนยันตัวตนของระบบหลัก");
    form.reset();
  });
}

function wireStateActions() {
  const buttons = document.querySelectorAll("[data-state-target]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-state-target");
      const nextState = button.getAttribute("data-next-state");
      const target = targetId ? document.getElementById(targetId) : null;

      if (!target || !nextState) return;
      setState(target, nextState);
    });
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.getAttribute("data-mode");
      if (!mode) return;
      openWorkspaceView(mode);
    });
  });

  document.getElementById("open-workspace-button")?.addEventListener("click", () => {
    openWorkspaceView(activeModeKey);
  });

  document.getElementById("shell-fo-easting")?.addEventListener("input", updateFoFormReadout);
  document.getElementById("shell-fo-northing")?.addEventListener("input", updateFoFormReadout);
  updateFoFormReadout();

  document.getElementById("close-workspace-button")?.addEventListener("click", closeWorkspaceView);

  document.querySelectorAll("[data-howitzer-module]").forEach((button) => {
    button.addEventListener("click", () => updateHowitzerModule(button.getAttribute("data-howitzer-module") || "overview"));
  });

  document.querySelectorAll(".mode-tile").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".mode-tile").forEach((tile) => tile.classList.toggle("is-active", tile === button));
      if (button.getAttribute("data-shell-view") === "workspace") {
        openWorkspaceView(activeModeKey);
        return;
      }
      if (button.getAttribute("data-shell-view") === "dashboard") {
        openDashboardView();
        return;
      }
      closeWorkspaceView();
      closeDashboardView();
    });
  });

  wireDashboardLogin();
}

function boot() {
  updateClock();
  wireStateActions();
  initSituationalMap();
  setMode("fo");
  window.setInterval(updateClock, 1000);
}

boot();
