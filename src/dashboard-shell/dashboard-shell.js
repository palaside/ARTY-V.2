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
    coordinate: document.getElementById("situational-coordinate"),
    mapMode: document.getElementById("situational-map-mode"),
    zoom: document.getElementById("situational-zoom"),
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
  renderSituationalPin();
  updateSituationalMapTransform();
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
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.08 : 0.92;
    zoomSituationalMap(factor, event.clientX, event.clientY);
  }, { passive: false });

  canvas.addEventListener("dblclick", (event) => {
    event.preventDefault();
    setSituationalPointFromClient(event.clientX, event.clientY);
  });

  canvas.addEventListener("keydown", (event) => {
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
}

function rectCenterX(node) {
  return node.getBoundingClientRect().left + node.getBoundingClientRect().width / 2;
}

function rectCenterY(node) {
  return node.getBoundingClientRect().top + node.getBoundingClientRect().height / 2;
}

function setMode(modeKey) {
  const config = modeConfigs[modeKey];
  if (!config) return;

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
      setMode(mode);
    });
  });
}

function boot() {
  updateClock();
  wireStateActions();
  initSituationalMap();
  setMode("fo");
  window.setInterval(updateClock, 1000);
}

boot();
