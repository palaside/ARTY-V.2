import { useState } from 'react';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function CraterAnalysisWorkspace({ reportOnly = false }: { reportOnly?: boolean }) {
  const { addEvent, queueReport } = useSharedOperationalState();
  const [craterId, setCraterId] = useState('CRATER-ฝึก-๐๑');
  const [easting, setEasting] = useState('482140');
  const [northing, setNorthing] = useState('1562180');
  const [splash, setSplash] = useState('ทิศสาดตัวอย่าง ๑๒๐๐ มิล');
  const [fuze, setFuze] = useState('รูหัวชนวน / ตัวอย่าง');
  const [furrow, setFurrow] = useState('รอยถาก / ตัวอย่าง');
  const [saved, setSaved] = useState(false);
  const submitReport = () => { setSaved(true); queueReport('COUNTER_BATTERY', 'HOWITZER'); addEvent('HOWITZER', `บันทึกข้อมูล ${craterId} เข้าคิว บขตป. ตอนที่ ๑ (ชุดฝึก)`, 'INFO'); };
  return (
    <section className="howitzer-module-panel crater-analysis-panel" aria-label="วิเคราะห์หลุมระเบิด">
      <header className="howitzer-module-panel__header"><div><span className="route-kicker">หลุมระเบิด / บขตป.</span><h4>{reportOnly ? 'พรีวิวข้อมูล บขตป. ตอนที่ ๑' : 'แบบบันทึกวิเคราะห์หลุมระเบิด'}</h4></div><span className="state-chip state-warning">ชุดฝึกเท่านั้น</span></header>
      {!reportOnly ? <div className="crater-form-grid"><label>รหัสหลุมฝึก<input value={craterId} onChange={(event) => setCraterId(event.target.value)} /></label><label>พิกัดตะวันออก<input value={easting} onChange={(event) => setEasting(event.target.value)} /></label><label>พิกัดเหนือ<input value={northing} onChange={(event) => setNorthing(event.target.value)} /></label><label>รอยสาด / ทิศทาง<input value={splash} onChange={(event) => setSplash(event.target.value)} /></label><label>รูหัวชนวน / ชิ้นส่วน<input value={fuze} onChange={(event) => setFuze(event.target.value)} /></label><label>รอยถาก / ลักษณะหลุม<input value={furrow} onChange={(event) => setFurrow(event.target.value)} /></label></div> : null}
      <div className="crater-report-grid"><div className="crater-training-map"><span className="crater-marker" style={{ left: '62%', top: '42%' }}>จุดหลุมฝึก</span><span className="crater-training-map__caption">แผนที่ฝึก · {easting} / {northing}</span></div><div className="crater-summary"><span className="route-kicker">รายงานเบื้องต้น</span><dl><div><dt>รหัส</dt><dd>{craterId}</dd></div><div><dt>พิกัดหลุม</dt><dd>{easting} / {northing}</dd></div><div><dt>ข้อมูลสนาม</dt><dd>{splash}</dd></div><div><dt>หลักฐานประกอบ</dt><dd>{fuze} · {furrow}</dd></div></dl><p>ข้อมูลนี้ส่งได้เฉพาะคิวพรีวิว บขตป. ไม่สร้างพิกัดปืนจริงและไม่สั่งยิงตอบโต้</p></div></div>
      {!reportOnly ? <button type="button" className="primary-button" onClick={submitReport}>{saved ? 'เข้าคิว บขตป. แล้ว' : 'บันทึกและส่งเข้าคิว บขตป. ตอนที่ ๑'}</button> : <p className="howitzer-report-note">พรีวิวนี้อ่านจากข้อมูลฝึกที่ถูกบันทึกไว้ในคิวเอกสารร่วม</p>}
    </section>
  );
}
