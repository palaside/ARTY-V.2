import { useEffect, useRef, useState } from 'react';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

type GunStatus = 'พร้อมตรวจ' | 'ตรวจแล้ว' | 'ล็อก';
type M17WorkspaceProps = { initialView?: 'solo' | 'battery'; focus?: 'guns' };
const guns = [
  { id: 'ปืน ๑', easting: 481940, northing: 1562040, offset: '−๖๐ / +๔๐ ม.' }, { id: 'ปืน ๒', easting: 481970, northing: 1562060, offset: '−๓๐ / +๖๐ ม.' }, { id: 'ปืน ๓', easting: 482000, northing: 1562000, offset: 'ศูนย์กลาง' }, { id: 'ปืน ๔', easting: 482030, northing: 1562040, offset: '+๓๐ / +๔๐ ม.' }, { id: 'ปืน ๕', easting: 482060, northing: 1561980, offset: '+๖๐ / −๒๐ ม.' }, { id: 'ปืน ๖', easting: 482090, northing: 1562020, offset: '+๙๐ / +๒๐ ม.' },
];

function HoldConfirmButton({ onConfirm }: { onConfirm: () => void }) {
  const timer = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const start = () => { const started = Date.now(); timer.current = window.setInterval(() => { const next = Math.min(100, ((Date.now() - started) / 2000) * 100); setProgress(next); if (next >= 100) { if (timer.current) window.clearInterval(timer.current); timer.current = null; onConfirm(); } }, 50); };
  const stop = () => { if (timer.current) window.clearInterval(timer.current); timer.current = null; setProgress(0); };
  return <button type="button" className="primary-button hold-confirm" onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}>กดค้าง ๒ วินาทีเพื่อยืนยัน{progress > 0 ? ` · ${Math.round(progress)}%` : ''}</button>;
}

export function M17Workspace({ initialView = 'solo', focus }: M17WorkspaceProps) {
  const { addEvent } = useSharedOperationalState();
  const [view, setView] = useState<'solo' | 'battery'>(initialView);
  const [selectedGun, setSelectedGun] = useState('ปืน ๓');
  const [statuses, setStatuses] = useState<Record<string, GunStatus>>(() => Object.fromEntries(guns.map((gun) => [gun.id, 'พร้อมตรวจ'])) as Record<string, GunStatus>);
  const [verified, setVerified] = useState(false);
  const [splashSeconds, setSplashSeconds] = useState(0);
  const [splashState, setSplashState] = useState('รอเริ่มการจำลอง');
  useEffect(() => { if (splashSeconds <= 0) return undefined; const timer = window.setInterval(() => setSplashSeconds((seconds) => seconds - 1), 1000); return () => window.clearInterval(timer); }, [splashSeconds]);
  useEffect(() => { if (splashSeconds !== 0 || splashState !== 'กำลังเดินทาง') return; setSplashState('กระทบจำลอง'); addEvent('HOWITZER', 'การจำลองกระสุนกระทบเป้าหมายฝึกแล้ว', 'INFO'); }, [addEvent, splashSeconds, splashState]);
  const selected = guns.find((gun) => gun.id === selectedGun) ?? guns[2];
  const markGun = (id: string) => setStatuses((current) => ({ ...current, [id]: current[id] === 'ล็อก' ? 'พร้อมตรวจ' : 'ล็อก' }));
  const startSplash = () => { setSplashState('กำลังเดินทาง'); setSplashSeconds(8); addEvent('HOWITZER', 'เริ่มนับถอยหลังการกระทบจำลอง ๘ วินาที', 'INFO'); };
  return (
    <section className="howitzer-module-panel" aria-label="M.17 และสถานะปืน">
      <header className="howitzer-module-panel__header"><div><span className="route-kicker">M.17 / ส่วนยิง</span><h4>แผงวางแผนและตรวจความพร้อมปืน</h4></div><span className="state-chip state-warning">ข้อมูลสมมติ</span></header>
      <div className="howitzer-view-switcher"><button type="button" className={view === 'solo' ? 'is-active' : ''} onClick={() => setView('solo')}>มุมมองปืนตัวเอง</button><button type="button" className={view === 'battery' ? 'is-active' : ''} onClick={() => setView('battery')}>มุมมองรวม ๖ กระบอก</button></div>
      <div className="m17-training-grid"><div className="m17-plot" aria-label="แผนผัง M.17 ข้อมูลฝึก"><div className="m17-plot__origin">ศก.ร้อย<br /><b>482000 / 1562000</b></div>{guns.map((gun, index) => <button key={gun.id} type="button" className={`m17-gun-marker ${selectedGun === gun.id ? 'is-selected' : ''} ${index === 2 ? 'is-reference' : ''}`} style={{ left: `${18 + index * 13}%`, top: `${35 + (index % 2) * 22}%` }} onClick={() => setSelectedGun(gun.id)}>{index + 1}</button>)}<span className="m17-plot__legend">เส้นและตำแหน่งเป็นการแสดงผลฝึก ไม่ใช่ตำแหน่งใช้งานจริง</span></div><div className="m17-readout"><span className="route-kicker">{view === 'solo' ? 'มุมมองปืนตัวเอง' : 'มุมมองรวม ๖ กระบอก'}</span><h5>{selected.id} {indexLabel(selected.id)}</h5><dl><div><dt>พิกัดตัวอย่าง</dt><dd>{selected.easting} / {selected.northing}</dd></div><div><dt>ออฟเซ็ตจาก ศก.ร้อย</dt><dd>{selected.offset}</dd></div><div><dt>สถานะ</dt><dd>{statuses[selected.id]}</dd></div></dl><p>ปืนอ้างอิงคือ ปืน ๓ · การเปลี่ยนแปลงทุกค่าอยู่ใน simulation</p></div></div>
      <div className="gun-status-matrix" data-focus={focus}><div className="howitzer-subheading"><span className="route-kicker">ตารางสถานะปืน</span><strong>การตรวจทานรายกระบอก</strong></div>{guns.map((gun) => <div key={gun.id} className={`gun-status-row ${gun.id === 'ปืน ๓' ? 'is-reference' : ''}`}><strong>{gun.id}</strong><span>{gun.id === 'ปืน ๓' ? 'ปืนหมู่หลัก / อ้างอิง' : 'ปืนประจำหมู่'}</span><b>{statuses[gun.id]}</b><button type="button" className="ghost-button" onClick={() => markGun(gun.id)}>{statuses[gun.id] === 'ล็อก' ? 'ปลดล็อกฝึก' : 'สลับสถานะ'}</button></div>)}</div>
      <div className="howitzer-bottom-grid"><div className="quadrant-panel"><span className="route-kicker">M1/M1A1 / ตรวจมุม</span><strong>{verified ? 'ตรวจทานแล้วในชุดฝึก' : 'รอการตรวจทาน'}</strong><p>ช่องนี้ใช้ยืนยันการอ่านค่าจากเครื่องมือจำลองเท่านั้น</p><HoldConfirmButton onConfirm={() => { setVerified(true); addEvent('HOWITZER', 'ยืนยันการตรวจมุม M1/M1A1 ในชุดฝึก', 'INFO'); }} /></div><div className="splash-panel"><span className="route-kicker">SPLASH / จำลอง</span><strong>{splashSeconds > 0 ? `${splashSeconds} วินาที` : splashState}</strong><p>ลำดับ: รอ → ยิงจำลอง → กำลังเดินทาง → กระทบจำลอง</p><button type="button" className="primary-button" onClick={startSplash} disabled={splashSeconds > 0}>เริ่มการจำลอง</button></div></div>
    </section>
  );
}
function indexLabel(id: string) { return id === 'ปืน ๑' ? 'ที่ ๑' : id === 'ปืน ๒' ? 'ที่ ๒' : id === 'ปืน ๓' ? 'ที่ ๓' : id === 'ปืน ๔' ? 'ที่ ๔' : id === 'ปืน ๕' ? 'ที่ ๕' : 'ที่ ๖'; }
