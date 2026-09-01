import { useMemo, useState, type FormEvent } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import { formatDocumentLabel, formatFireMissionStatus, formatMissionStatus, formatRoleLabel, formatSeverityLabel } from '@/shared/labels';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';
import { MissionWorkspace } from './MissionWorkspace';

type FdcWorkspaceProps = { mode?: 'full' | 'preview' };
type FdcPanel = 'intake' | 'geometry' | 'correction' | 'guns' | 'command' | 'missions';

const fdcCapabilities: CapabilityItem[] = [
  { title: '๑. รับคำขอยิงและบันทึก CFF', description: 'รับข้อมูลคำขอจำลองและเปิดภารกิจฝึกเข้าสู่สถานะร่วม โดยไม่มีการส่งคำสั่งจริง.', state: 'พร้อมแสดงผล' },
  { title: '๒. แปลงข้อมูลพิกัดบนแผ่นกรุย', description: 'แสดงบริบทจุดอ้างอิง เป้าหมาย และระยะในรูปแบบทบทวน ไม่คำนวณหลักฐานยิงจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๓. ทบทวนข้อมูลตารางยิง', description: 'แสดงประตูตรวจทานข้อมูลระยะ/มุมและสถานะข้อมูลอ้างอิง โดยไม่สร้างค่ามุมยิงใช้งานจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๔. ค่าแก้สภาพแวดล้อม', description: 'รวบรวมสถานะ MET และการตรวจทานค่าแก้ในรูปแบบบันทึกประกอบการฝึก.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๕. รับการปรับแก้จาก FO', description: 'แสดงการรับข้อมูลแก้ทางข้าง/ระยะ/ความสูงจาก FO เป็นสถานะจำลอง.', state: 'พร้อมแสดงผล' },
  { title: '๖. ลดเหลื่อมรายกระบอกและหน้ากระสุน', description: 'แสดงสถานะออฟเซ็ตและรูปแบบการจัดปืน โดยไม่ออกคำสั่งไปยังปืนจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๗. พรีวิวคำสั่งไปส่วนยิง', description: 'แสดงสถานะพร้อม/ล็อกและพรีวิวแบบปกปิดค่าปฏิบัติการ เพื่อป้องกันการนำไปใช้จริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
];

export function FdcWorkspace({ mode = 'full' }: FdcWorkspaceProps) {
  const { activeTarget, eventLog, fireLocked, fireMissionStatus, minQeLocked, missionId, missionStatus, reportQueue, addEvent, activateMission, setFireLocked, setMinQeLocked, completeMission, queueReport, roleView } = useSharedOperationalState();
  const [activePanel, setActivePanel] = useState<FdcPanel>('missions');
  const [callSign, setCallSign] = useState('FO-ฝึก-๐๑');
  const [targetRef, setTargetRef] = useState('TGT-ฝึก-๐๑');
  const [targetType, setTargetType] = useState('เป้าหมายสมมติ');
  const [method, setMethod] = useState('ปรับการยิงจำลอง');
  const [intakeStatus, setIntakeStatus] = useState('รอรับคำขอฝึก');
  const [correction, setCorrection] = useState('ยังไม่มีการปรับแก้');
  const visibleEvents = useMemo(() => filterVisibleEvents(roleView, eventLog), [eventLog, roleView]);
  const isFullAccess = mode === 'full';

  const submitCff = (event: FormEvent) => {
    event.preventDefault();
    activateMission('MISSION-ฝึก-๐๑', 'FDC');
    setIntakeStatus(`รับคำขอจาก ${callSign} แล้ว · ${targetRef}`);
    addEvent('FDC', `บันทึกคำขอฝึก ${targetRef} จาก ${callSign}`, 'INFO');
  };

  const recordCorrection = (value: string) => { setCorrection(value); addEvent('FDC', `รับการปรับแก้จาก FO: ${value} (ชุดฝึก)`, 'INFO'); };

  return (
    <section className={`domain-workspace fdc-workspace${isFullAccess ? '' : ' domain-workspace--preview'}`} aria-label="พื้นที่ทำงานศูนย์อำนวยการยิง">
      <header className="domain-workspace__header"><span className="route-kicker">ศูนย์อำนวยการยิง / FDC</span><h3>พื้นที่ทำงานศูนย์อำนวยการยิง</h3><span className="state-chip state-warning">โหมดฝึก · ไม่ส่งคำสั่งจริง</span></header>
      <nav className="fdc-module-nav" aria-label="โมดูล FDC"><button type="button" className={activePanel === 'intake' ? 'is-active' : ''} onClick={() => setActivePanel('intake')}>รับคำขอยิง</button><button type="button" className={activePanel === 'geometry' ? 'is-active' : ''} onClick={() => setActivePanel('geometry')}>พิกัดและเรขาคณิต</button><button type="button" className={activePanel === 'correction' ? 'is-active' : ''} onClick={() => setActivePanel('correction')}>รับการปรับแก้ FO</button><button type="button" className={activePanel === 'guns' ? 'is-active' : ''} onClick={() => setActivePanel('guns')}>สถานะปืน</button><button type="button" className={activePanel === 'command' ? 'is-active' : ''} onClick={() => setActivePanel('command')}>พรีวิวส่งต่อ</button><button type="button" className={activePanel === 'missions' ? 'is-active' : ''} onClick={() => setActivePanel('missions')}>ภารกิจ</button></nav>

      {activePanel !== 'missions' ? <CapabilityCatalog title="คลังความสามารถ FDC · ๘ โมดูล" items={fdcCapabilities} /> : null}

      {activePanel === 'missions' ? <MissionWorkspace /> : null}

      {activePanel === 'intake' ? <section className="fdc-panel"><div className="fdc-panel__header"><span className="route-kicker">๑ · CFF INGESTION</span><h4>รับคำขอยิงจำลอง</h4></div><form className="fdc-form-grid" onSubmit={submitCff}><label>ขานนามผู้ส่ง<input value={callSign} onChange={(event) => setCallSign(event.target.value)} disabled={!isFullAccess} /></label><label>หมายเลขเป้าหมาย<input value={targetRef} onChange={(event) => setTargetRef(event.target.value)} disabled={!isFullAccess} /></label><label>ลักษณะเป้าหมาย<input value={targetType} onChange={(event) => setTargetType(event.target.value)} disabled={!isFullAccess} /></label><label>วิธีทำการฝึก<select value={method} onChange={(event) => setMethod(event.target.value)} disabled={!isFullAccess}><option>ปรับการยิงจำลอง</option><option>ภารกิจพื้นที่จำลอง</option><option>พรีวิวทบทวนเท่านั้น</option></select></label><button type="submit" className="primary-button" disabled={!isFullAccess}>บันทึกคำขอเข้าสู่ภารกิจฝึก</button></form><p className="fdc-panel__status" aria-live="polite">{intakeStatus}</p></section> : null}

      {activePanel === 'geometry' ? <section className="fdc-panel"><div className="fdc-panel__header"><span className="route-kicker">๒–๔ · DATA REVIEW</span><h4>พิกัด เรขาคณิต และสภาพแวดล้อม</h4></div><div className="fdc-data-grid"><div><span>เป้าหมายร่วม</span><strong>{activeTarget?.id ?? 'รอเป้าหมายจาก FO'}</strong><small>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'ไม่มีข้อมูลพิกัดที่ยืนยัน'}</small></div><div><span>ผลต่างทางสูง</span><strong>ซ่อนค่าปฏิบัติการ</strong><small>ตรวจจากข้อมูลฝึก/แหล่งอ้างอิงที่อนุมัติ</small></div><div><span>MET / ค่าแก้</span><strong>รอตรวจทาน</strong><small>ยังไม่ผูกตารางหรือเซนเซอร์จริง</small></div></div><p className="fdc-safety-note">แผงนี้เป็น readout เพื่อทบทวนเท่านั้น ไม่สร้างมุมยิง ส่วนบรรจุ หรือเวลาชนวนที่นำไปใช้จริงได้</p></section> : null}

      {activePanel === 'correction' ? <section className="fdc-panel"><div className="fdc-panel__header"><span className="route-kicker">๕ · OBSERVER CORRECTION</span><h4>รับการปรับแก้จาก FO</h4></div><div className="fdc-correction-grid"><strong>{correction}</strong><button type="button" className="ghost-button" onClick={() => recordCorrection('แก้ทางข้าง · ชุดฝึก')}>รับแก้ทางข้าง</button><button type="button" className="ghost-button" onClick={() => recordCorrection('แก้ระยะ · ชุดฝึก')}>รับแก้ระยะ</button><button type="button" className="ghost-button" onClick={() => recordCorrection('แก้ความสูง · ชุดฝึก')}>รับแก้ความสูง</button></div><p className="fdc-safety-note">ระบบบันทึกเฉพาะเหตุการณ์ฝึก ไม่คำนวณหรือส่งคำสั่งปรับการยิงจริง</p></section> : null}

      {activePanel === 'guns' ? <section className="fdc-panel"><div className="fdc-panel__header"><span className="route-kicker">๖ · GUN DISPLACEMENT</span><h4>สถานะปืนและการลดเหลื่อม</h4></div><div className="fdc-gun-grid">{['ปืน ๑', 'ปืน ๒', 'ปืน ๓', 'ปืน ๔', 'ปืน ๕', 'ปืน ๖'].map((gun, index) => <div key={gun} className={index === 2 ? 'is-reference' : ''}><strong>{gun}</strong><span>{index === 2 ? 'จุดอ้างอิง ศก.ร้อย' : 'ออฟเซ็ตฝึก'}</span><b>{fireLocked ? 'ล็อก' : 'รอตรวจ'}</b></div>)}</div><p className="fdc-safety-note">ข้อมูลปืนทั้งหมดเป็นค่าตัวอย่าง ไม่ส่งต่อไปยังอุปกรณ์หรือระบบควบคุมจริง</p></section> : null}

      {activePanel === 'command' ? <section className="fdc-panel"><div className="fdc-panel__header"><span className="route-kicker">๗ · FIRE COMMAND PREVIEW</span><h4>พรีวิวสถานะส่งต่อไปส่วนยิง</h4></div><div className="fdc-command-preview"><div><span>ภารกิจ</span><strong>{missionId ?? 'ยังไม่เปิดภารกิจ'}</strong></div><div><span>สถานะ</span><strong>{formatMissionStatus(missionStatus)} / {formatFireMissionStatus(fireMissionStatus)}</strong></div><div><span>ความปลอดภัย</span><strong>{fireLocked || minQeLocked ? 'ล็อกการส่งต่อ' : 'รอตรวจทาน'}</strong></div><div><span>คำสั่ง</span><strong>ปกปิดค่าปฏิบัติการ</strong></div></div>{isFullAccess ? <div className="control-row"><button type="button" className="ghost-button" onClick={() => setFireLocked(!fireLocked)}>{fireLocked ? 'ปลดล็อกฝึก' : 'ล็อกประตูความปลอดภัย'}</button><button type="button" className="ghost-button" onClick={() => setMinQeLocked(!minQeLocked)}>{minQeLocked ? 'ปลดล็อก QE ฝึก' : 'ล็อก QE ฝึก'}</button><button type="button" className="ghost-button" onClick={() => queueReport('DEPUTY_REPORT', 'FDC')}>เข้าคิวพรีวิวรายงาน</button><button type="button" className="primary-button" onClick={() => completeMission('FDC')}>จบภารกิจฝึก</button></div> : <p className="fdc-safety-note">พรีวิวแบบอ่านอย่างเดียวสำหรับบทบาทที่ไม่มีสิทธิ์แก้ไข</p>}</section> : null}

      <div className="shared-status-grid"><div className="status-tile"><span className="route-kicker">คิวรายงาน</span><strong>{reportQueue.length}</strong><p>{reportQueue[0] ? `${formatDocumentLabel(reportQueue[0].document)} จาก ${formatRoleLabel(reportQueue[0].source)}` : 'ยังไม่มีรายงานในคิว'}</p></div><div className="status-tile"><span className="route-kicker">เหตุการณ์ล่าสุด</span><strong>{visibleEvents[0] ? formatSeverityLabel(visibleEvents[0].severity) : 'ไม่มี'}</strong><p>{visibleEvents[0]?.message ?? 'ยังไม่มีเหตุการณ์ร่วม'}</p></div></div>
    </section>
  );
}
