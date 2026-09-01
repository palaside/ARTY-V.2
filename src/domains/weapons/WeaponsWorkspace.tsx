import { useMemo, useState } from 'react';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

type WeaponPanel = 'catalog' | 'compatibility' | 'safety' | 'knowledge' | 'training-log';

const catalog = [
  { id: 'PRJ-01', group: 'กระสุนฝึก', name: 'กระสุนตัวอย่าง A', state: 'พร้อมตรวจสอบ', note: 'ข้อมูลสมมติ ไม่ใช่ยอดคลังจริง' },
  { id: 'PRJ-02', group: 'กระสุนฝึก', name: 'กระสุนตัวอย่าง B', state: 'รอเอกสารอ้างอิง', note: 'ยังไม่อนุญาตให้นำไปคำนวณการยิง' },
  { id: 'FUZ-01', group: 'ชนวนฝึก', name: 'ชนวนตัวอย่างแบบกระทบ', state: 'พร้อมตรวจสอบ', note: 'แสดงเพื่อการจำแนกเท่านั้น' },
  { id: 'FUZ-02', group: 'ชนวนฝึก', name: 'ชนวนตัวอย่างแบบเวลา', state: 'รอเอกสารอ้างอิง', note: 'ไม่มีการตั้งค่าชนวนจริง' },
  { id: 'CHG-01', group: 'ดินขับฝึก', name: 'ชุดดินขับตัวอย่าง', state: 'ข้อมูลฝึก', note: 'ไม่เชื่อมคลังหรือการเบิกจ่ายจริง' },
];

const panelLabels: Record<WeaponPanel, string> = {
  catalog: 'แคตตาล็อก',
  compatibility: 'ความเข้ากันได้',
  safety: 'ความปลอดภัย',
  knowledge: 'คลังความรู้',
  'training-log': 'บันทึกฝึก',
};

export function WeaponsWorkspace() {
  const [activePanel, setActivePanel] = useState<WeaponPanel>('catalog');
  const [selectedProjectile, setSelectedProjectile] = useState(catalog[0].id);
  const [selectedFuze, setSelectedFuze] = useState(catalog[2].id);
  const [checkStatus, setCheckStatus] = useState('ยังไม่ได้ตรวจชุดข้อมูลฝึก');
  const [trainingLog, setTrainingLog] = useState<string[]>([]);
  const { fireLocked, addEvent } = useSharedOperationalState();
  const projectiles = useMemo(() => catalog.filter((item) => item.group === 'กระสุนฝึก'), []);
  const fuzes = useMemo(() => catalog.filter((item) => item.group === 'ชนวนฝึก'), []);

  const runCompatibilityCheck = () => {
    const projectile = catalog.find((item) => item.id === selectedProjectile);
    const fuze = catalog.find((item) => item.id === selectedFuze);
    const nextStatus = projectile && fuze ? `ผ่านการตรวจโครงสร้างฝึก: ${projectile.name} / ${fuze.name}` : 'ข้อมูลไม่ครบ';
    setCheckStatus(nextStatus);
    setTrainingLog((items) => [`ตรวจชุดข้อมูล ${new Date().toLocaleTimeString('th-TH')}: ${nextStatus}`, ...items]);
    addEvent('WEAPONS', 'ตรวจความเข้ากันได้ของข้อมูลกระสุน/ชนวนในโหมดฝึกแล้ว', 'INFO');
  };

  const recordTrainingAction = (message: string) => {
    setTrainingLog((items) => [`${message} · ${new Date().toLocaleTimeString('th-TH')}`, ...items]);
    addEvent('WEAPONS', message, 'INFO');
  };

  return (
    <div className="weapons-workspace">
      <header className="weapons-workspace__header">
        <div>
          <span className="route-kicker">พื้นที่ทำงานกระสุน</span>
          <h3>ระบบกระสุนและความปลอดภัย</h3>
          <p>โหมดฝึก · ใช้ข้อมูลสมมติ · ไม่เชื่อมคลังจริงและไม่ควบคุมอาวุธ</p>
        </div>
        <span className="weapons-training-badge">TRAINING ONLY</span>
      </header>

      <nav className="weapons-module-nav" aria-label="โมดูลกระสุน">
        {(Object.keys(panelLabels) as WeaponPanel[]).map((panel) => (
          <button key={panel} type="button" className={activePanel === panel ? 'is-active' : ''} onClick={() => setActivePanel(panel)}>
            {panelLabels[panel]}
          </button>
        ))}
      </nav>

      {activePanel === 'catalog' && (
        <section className="weapons-panel">
          <div className="weapons-panel__heading"><div><span className="route-kicker">โมดูล ๑</span><h4>แคตตาล็อกกระสุน ชนวน และดินขับฝึก</h4></div><strong>{catalog.length} รายการตัวอย่าง</strong></div>
          <div className="weapons-catalog-grid">
            {catalog.map((item) => <article className="weapons-card" key={item.id}><span>{item.group}</span><h5>{item.name}</h5><b>{item.state}</b><small>{item.note}</small></article>)}
          </div>
          <p className="weapons-note">รายการนี้เป็นข้อมูลสำหรับเรียนรู้โครงสร้างเท่านั้น ไม่ใช่ยอดคงคลัง ไม่ตัดยอด และไม่ใช้สร้างคำสั่งยิง</p>
        </section>
      )}

      {activePanel === 'compatibility' && (
        <section className="weapons-panel">
          <div className="weapons-panel__heading"><div><span className="route-kicker">โมดูล ๒</span><h4>ตรวจความเข้ากันได้ในโหมดฝึก</h4></div><strong>ไม่ควบคุมชนวน</strong></div>
          <div className="weapons-form-grid"><label>กระสุน<select value={selectedProjectile} onChange={(event) => setSelectedProjectile(event.target.value)}>{projectiles.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><label>ชนวน<select value={selectedFuze} onChange={(event) => setSelectedFuze(event.target.value)}>{fuzes.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label><button type="button" className="primary-button" onClick={runCompatibilityCheck}>ตรวจชุดข้อมูลฝึก</button></div>
          <p className="weapons-status">{checkStatus}</p>
          <p className="weapons-note">ผลนี้เป็นเพียงการตรวจว่ามีข้อมูลตัวอย่างครบคู่กัน ไม่มีการตรวจมาตรฐานอาวุธจริงหรือคำนวณผลกระทบ</p>
        </section>
      )}

      {activePanel === 'safety' && (
        <section className="weapons-panel">
          <div className="weapons-panel__heading"><div><span className="route-kicker">โมดูล ๓</span><h4>ประตูความปลอดภัยและสถานะจำลอง</h4></div><strong className={fireLocked ? 'is-danger' : ''}>{fireLocked ? 'ล็อกอยู่' : 'รอตรวจสอบ'}</strong></div>
          <div className="weapons-safety-grid"><article className="weapons-safety-card"><span>อินเตอร์ล็อกฝ่ายมิตร</span><strong>ไม่อนุญาตคำสั่งยิงจริง</strong><p>ชั้นความปลอดภัยของระบบยังคงล็อกการปฏิบัติการจริง</p></article><article className="weapons-safety-card"><span>ค้างยิง / ลำกล้องร้อน</span><strong>ให้หยุดและแจ้งผู้ควบคุมฝึก</strong><p>หน้าจอนี้ไม่แทนที่ SOP หรือคำสั่งจากผู้ควบคุม</p></article></div>
          <button type="button" className="ghost-button" onClick={() => recordTrainingAction('ทบทวน safety gate ในโหมดฝึกแล้ว')}>บันทึกการทบทวนความปลอดภัย</button>
        </section>
      )}

      {activePanel === 'knowledge' && (
        <section className="weapons-panel">
          <div className="weapons-panel__heading"><div><span className="route-kicker">โมดูล ๔</span><h4>คลังความรู้และเอกสารอ้างอิง</h4></div><strong>อ่านอย่างเดียว</strong></div>
          <div className="weapons-knowledge-grid"><article className="weapons-safety-card"><span>การจัดหมวดข้อมูล</span><strong>กระสุน · ชนวน · ดินขับ</strong><p>ใช้สำหรับทำความเข้าใจโครงสร้างข้อมูลและการตรวจทานเอกสารในชุดฝึก</p></article><article className="weapons-safety-card"><span>ขอบเขตการใช้งาน</span><strong>รอเอกสารที่รับรอง</strong><p>ยังไม่แสดงค่าทางเทคนิคหรือขั้นตอนที่ใช้แทนคู่มือประจำหน่วย</p></article><article className="weapons-safety-card"><span>สถานะการอ้างอิง</span><strong>ยังไม่ผูกเอกสารจริง</strong><p>ผู้ควบคุมฝึกต้องตรวจแหล่งอ้างอิงก่อนนำข้อมูลใดไปใช้งาน</p></article></div>
          <p className="weapons-note">เอกสารอ้างอิงในโมดูลนี้ไม่มีคำสั่งควบคุมอาวุธ ไม่มีการตั้งชนวน และไม่มีค่าคำนวณการยิง</p>
        </section>
      )}

      {activePanel === 'training-log' && (
        <section className="weapons-panel"><div className="weapons-panel__heading"><div><span className="route-kicker">โมดูล ๔</span><h4>บันทึกกิจกรรมฝึก</h4></div><strong>{trainingLog.length} รายการ</strong></div><p className="weapons-note">บันทึกเฉพาะกิจกรรมจำลอง ไม่เก็บรหัสผ่าน ไม่บันทึกคำสั่งยิง และไม่ใช่บันทึกคลังจริง</p>{trainingLog.length === 0 ? <p className="weapons-empty">ยังไม่มีรายการฝึกจากหน้านี้</p> : <ul className="weapons-log">{trainingLog.map((entry, index) => <li key={`${entry}-${index}`}>{entry}</li>)}</ul>}</section>
      )}
    </div>
  );
}
