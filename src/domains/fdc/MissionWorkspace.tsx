import { useMemo, useState } from 'react';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

type Mission = { id: string; title: string; reference: string; description: string };
type MissionGroup = { id: string; title: string; purpose: string; missions: Mission[] };

const dimensions = [
  'D1 ความมุ่งหมายทางยุทธวิธี', 'D2 ผลลัพธ์ทางกายภาพและขีปนวิถี', 'D3 การเชื่อมโยงผลลัพธ์ปลายน้ำ',
  'D4 ตัวแปรสนับสนุนการแปลงเป็นคำสั่งยิง', 'D5 วงรอบเตรียมความพร้อม FO → FDC → ส่วนยิง',
  'D6 เครื่องยนต์วิเคราะห์ข้อมูล FDC', 'D7 ตรรกะการแบ่งมอบกำลังและแยกหมวด',
  'D8 เกณฑ์คัดเลือกหมู่ปืน', 'D9 กรอบความปลอดภัยและข้อจำกัดวิกฤต',
];

const mission = (id: string, title: string, reference: string): Mission => ({
  id, title, reference, description: 'ชุดภารกิจฝึกสำหรับทบทวนลำดับงานและผลลัพธ์ที่ต้องส่งต่อ โดยไม่สร้างคำสั่งยิงจริง',
});

const groups: MissionGroup[] = [
  { id: 'registration', title: '๑. ยิงหาหลักฐานและปรับการยิง', purpose: 'ภารกิจตั้งต้นเพื่อยืนยันข้อมูลและปรับความถูกต้องในชุดฝึก', missions: [
    mission('M01', 'ยิงหาหลักฐานประณีต', 'อย.๑'), mission('M02', 'ปรับการยิงร่วมกับเรดาร์ AN/TPQ-36', 'อย.๒๕'), mission('M03', 'ปรับการยิงมุมใหญ่', 'อย.๒๙'), mission('M04', 'ยฐ. จปฑ. และ ยฐ.ตอส.', 'อย.๑๙, ๓๕'),
  ] },
  { id: 'immediate', title: '๒. กดดันและทำลายฉับพลัน', purpose: 'ภารกิจตอบสนองเร่งด่วนต่อเป้าหมายในสถานการณ์จำลอง', missions: [
    mission('M05', 'ยิงหาผลตามเหตุการณ์ ชนวนกระทบแตกไว', 'อย.๓, ๑๗, ๒๖'), mission('M06', 'ยิงหาผลตามเหตุการณ์ ชนวนแตกอากาศเวลา', 'อย.๔'), mission('M07', 'ยิง ๒ หมู่ปืนพร้อมกัน แยกชนวนไว/เวลา', 'อย.๖'), mission('M08', 'ยิงหาผลด้วย ขสอ. และตรวจการยิง', 'อย.๕, ๑๔'), mission('M09', 'ยิงต่อต้าน ป. และ ค. แบบฉับพลัน', 'อย.๑๑'), mission('M10', 'ยิงข่มฉับพลันต่อเป้าหมายเร่งด่วน', 'อย.๑๒, ๓๓'), mission('M11', 'ยิงฉุกเฉิน', 'อย.๓๔'),
  ] },
  { id: 'planned', title: '๓. ยิงตามแผนและยิงรวม', purpose: 'ภารกิจที่เตรียมลำดับงานและจัดชุดข้อมูลไว้ล่วงหน้าในโหมดฝึก', missions: [
    mission('M12', 'ยิงเตรียมและยิงระหว่างยิงเตรียม', 'อย.๒๐, ๒๑'), mission('M13', 'ยิงทำลายการเตรียม', 'อย.๓๗'), mission('M14', 'ยิงพร้อมกัน ณ เป้าหมาย TOT', 'อย.๓๐'), mission('M15', 'ยิงกลุ่ม/อันดับ/โครงการเป้าหมาย', 'อย.๒๒, ๒๓, ๒๔'), mission('M16', 'ยิงเป้าหมายใหญ่รูปร่างผิดปกติ', 'อย.๙'), mission('M17', 'ยิงตามแผนการยิงเร่งด่วน', 'อย.๓๒'),
  ] },
  { id: 'special', title: '๔. กระสุนพิเศษและการสนับสนุน', purpose: 'ทบทวนการเลือกภารกิจสนับสนุนและผลลัพธ์ปลายทางแบบไม่ผูกอาวุธจริง', missions: [
    mission('M18', 'ยิงกระสุนส่องสว่างและยิงประสานส่องสว่าง', 'อย.๑๕, ๑๖'), mission('M19', 'ยิงควันเร่งด่วนและยิงควันฉับพลัน', 'อย.๒๗, ๒๘'), mission('M20', 'ยิงกระสุนพิเศษ พิกัดที่ได้ระยะ', 'อย.๘'), mission('M21', 'ยิงรบกวนและขัดขวาง', 'อย.๑๘'),
  ] },
  { id: 'defense', title: '๕. ป้องกันขั้นสุดท้ายและฉากกั้น', purpose: 'ภารกิจป้องกันพื้นที่สำคัญในชุดสถานการณ์ฝึกที่จำกัดข้อมูล', missions: [
    mission('M22', 'ปรับฉากป้องกันขั้นสุดท้าย', 'อย.๓๘'), mission('M23', 'ฉากป้องกันขั้นสุดท้าย FPF', 'อย.๓๙'),
  ] },
];

export function MissionWorkspace() {
  const { activeTarget, addEvent, activateMission, missionId, missionStatus, queueReport } = useSharedOperationalState();
  const [activeModule, setActiveModule] = useState<'missions' | 'weather'>('missions');
  const [groupId, setGroupId] = useState(groups[0].id);
  const [selectedId, setSelectedId] = useState(groups[0].missions[0].id);
  const [status, setStatus] = useState('พร้อมเลือกภารกิจฝึก');
  const selectedGroup = groups.find((group) => group.id === groupId) ?? groups[0];
  const selected = useMemo(() => selectedGroup.missions.find((item) => item.id === selectedId) ?? selectedGroup.missions[0], [selectedGroup, selectedId]);

  const selectGroup = (nextId: string) => {
    const nextGroup = groups.find((group) => group.id === nextId) ?? groups[0];
    setGroupId(nextId);
    setSelectedId(nextGroup.missions[0].id);
    setStatus('เลือกโมดูลแล้ว · เลือกภารกิจเพื่อดูรายละเอียด');
  };

  const openTrainingMission = () => {
    activateMission(`MISSION-${selected.id}-ฝึก`, 'FDC');
    setStatus(`เปิด ${selected.id} สำหรับการฝึกแล้ว`);
    addEvent('FDC', `เปิดโมดูลภารกิจ ${selected.id}: ${selected.title} (ชุดฝึก)`, 'INFO');
  };

  const queuePreview = () => {
    queueReport('DEPUTY_REPORT', 'FDC');
    setStatus(`เข้าคิวพรีวิวผลลัพธ์ของ ${selected.id} แล้ว`);
  };

  const openWeatherModule = () => {
    setActiveModule('weather');
    setStatus('เปิดโมดูลสภาพอากาศและลมสำหรับการทบทวนแล้ว');
    addEvent('FDC', 'เปิดโมดูลสภาพอากาศและลม (ชุดฝึก)', 'INFO');
  };

  return (
    <section className="mission-workspace" aria-label="โมดูลภารกิจ">
      <header className="mission-workspace__header"><div><span className="route-kicker">ศูนย์รวมภารกิจ / TRAINING ONLY</span><h3>โมดูลภารกิจ ศอย.</h3><p>9 มิติหลัก → 5 โมดูลภารกิจ → 23 ภารกิจ · พร้อมโมดูลสภาพอากาศและลมสำหรับการทบทวน</p></div><span className="state-chip state-warning">ไม่สร้างคำสั่งยิงจริง</span></header>
      <div className="mission-core-grid"><div><span className="route-kicker">เมนหลักหัวใจการคำนวณ</span><div className="mission-dimension-grid">{dimensions.map((item) => <span key={item}>{item}</span>)}</div></div><div className="mission-context-readout"><span className="route-kicker">บริบทที่เชื่อมอยู่</span><strong>{missionId ?? 'ยังไม่เปิดภารกิจ'}</strong><p>สถานะ: {missionStatus === 'active' ? 'กำลังฝึก' : missionStatus === 'complete' ? 'จบการฝึก' : 'พร้อมเริ่ม'}</p><p>เป้าหมายร่วม: {activeTarget?.id ?? 'ไม่มีข้อมูลเป้าหมาย'}</p></div></div>
      <div className="mission-group-tabs" aria-label="โมดูลภารกิจ">{groups.map((group) => <button key={group.id} type="button" className={activeModule === 'missions' && group.id === groupId ? 'is-active' : ''} onClick={() => { setActiveModule('missions'); selectGroup(group.id); }}>{group.title}<small>{group.missions.length} ภารกิจ</small></button>)}<button type="button" className={activeModule === 'weather' ? 'is-active' : ''} onClick={openWeatherModule}>สภาพอากาศและลม<small>โมดูลสนับสนุน</small></button></div>
      {activeModule === 'weather' ? <section className="mission-weather-panel"><div className="mission-section-heading"><span className="route-kicker">โมดูลสนับสนุน</span><p>บันทึกบริบทสภาพอากาศและลมเพื่อทบทวนข้อมูลเท่านั้น</p></div><div className="mission-weather-grid"><label>แหล่งข้อมูล<select defaultValue="ข้อมูลสมมติชุดฝึก"><option>ข้อมูลสมมติชุดฝึก</option><option>รอข้อมูลอ้างอิงที่อนุมัติ</option></select></label><label>แนวลมอ้างอิง<input defaultValue="รอกรอก" /></label><label>ความเร็วลมอ้างอิง<input defaultValue="รอกรอก" /></label><label>สถานะตรวจทาน<select defaultValue="ยังไม่ตรวจทาน"><option>ยังไม่ตรวจทาน</option><option>ผ่านการตรวจทานชุดฝึก</option></select></label></div><p className="mission-status">{status} · ไม่เชื่อมเซนเซอร์จริงและไม่แปลงเป็นคำสั่งยิง</p></section> : <div className="mission-body"><div className="mission-list"><div className="mission-section-heading"><span className="route-kicker">รายการภารกิจในโมดูล</span><p>{selectedGroup.purpose}</p></div>{selectedGroup.missions.map((item) => <button key={item.id} type="button" className={item.id === selected.id ? 'is-selected' : ''} onClick={() => { setSelectedId(item.id); setStatus('เลือกภารกิจแล้ว · พร้อมเปิดชุดฝึก'); }}><b>{item.id}</b><span>{item.title}</span><small>{item.reference}</small></button>)}</div><article className="mission-detail-card"><span className="route-kicker">รายละเอียดภารกิจที่เลือก</span><h4>{selected.id} · {selected.title}</h4><p>{selected.description}</p><div className="mission-detail-meta"><div><span>แหล่งอ้างอิง</span><strong>{selected.reference}</strong></div><div><span>ผลลัพธ์</span><strong>โครงร่างการคำนวณฝึก</strong></div><div><span>ข้อมูลเป้าหมาย</span><strong>{activeTarget?.id ?? 'ยังไม่มี'}</strong></div></div><div className="control-row"><button type="button" className="primary-button" onClick={openTrainingMission}>เปิดภารกิจฝึก</button><button type="button" className="ghost-button" onClick={queuePreview}>เข้าคิวพรีวิวรายงาน</button></div><p className="mission-status" aria-live="polite">{status}</p></article></div>}
    </section>
  );
}
