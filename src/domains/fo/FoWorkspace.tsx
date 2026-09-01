import { useEffect, useMemo, useRef, useState } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import { formatMissionStatus, formatRoleLabel } from '@/shared/labels';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';

type FoWorkspaceProps = {
  mode?: 'full' | 'preview';
};

type FoSimulationPhase = 'TARGET' | 'REQUESTED' | 'SHOT' | 'ADJUSTING' | 'ENDED';

const trainingTargets = [
  { id: 'TGT-001', description: 'เป้าหมายตัวอย่าง A', easting: 482110, northing: 1562210, altitude: 125, distance: 860 },
  { id: 'TGT-002', description: 'เป้าหมายตัวอย่าง B', easting: 482250, northing: 1562350, altitude: 138, distance: 1240 },
  { id: 'TGT-003', description: 'เป้าหมายตัวอย่าง C', easting: 482390, northing: 1562480, altitude: 116, distance: 1780 },
];

const foCapabilities: CapabilityItem[] = [
  {
    title: '1.1 พิกัดกริด',
    description: 'กำหนดที่ตั้งเป้าหมายด้วยพิกัดกริดและตรวจรูปแบบข้อมูลก่อนส่งต่อ.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '1.2 โพลาร์',
    description: 'กำหนดเป้าหมายด้วยมุมทิศ ระยะ และมุมดิ่งในแบบฟอร์มเดียว.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '1.3 ย้ายจากจุดทราบที่ตั้ง',
    description: 'กำหนดเป้าหมายจากจุดอ้างอิงด้วยค่าการย้ายที่ผู้ใช้ป้อน.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '2.1 แสง-เสียง',
    description: 'เครื่องมือบันทึกช่วงเวลาระหว่างแสงวาบกับเสียงสำหรับใช้ประกอบการประเมินระยะในโหมดฝึก.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: '2.2 สูตรมิลเลียม',
    description: 'ตัวช่วยจัดรูปข้อมูลความกว้าง ระยะ และมุมมิลสำหรับการทบทวนการสังเกต.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: '2.3 กฎของไซน์',
    description: 'พื้นที่เตรียมข้อมูลสามเหลี่ยมสำหรับการตรวจทานเรขาคณิตของการสังเกต.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: '3.1 แฟคเตอร์ ฟตม.',
    description: 'บันทึกค่าแฟคเตอร์สำหรับการย้ายจุดตามแบบฟอร์มที่ได้รับอนุมัติ.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: '3.2 แก้ทางข้าง',
    description: 'บันทึกการย้ายหรือแก้ทางข้างของจุดเป้าหมายก่อนส่งต่อ.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '4.1 ปรับแก้ระยะ',
    description: 'บันทึกคำขอปรับแก้ระยะจากการสังเกตจุดตกกระทบ.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '4.2 ปรับแก้ทางสูง',
    description: 'บันทึกคำขอปรับแก้ทางสูงหรือความสูงจุดระเบิดเพื่อทบทวนร่วม.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: '5.1 เป้าหมายเคลื่อนที่',
    description: 'บันทึกทิศทางและความเร็วเป้าหมายเพื่อเตรียมข้อมูลการติดตาม โดยยังไม่คำนวณคำสั่งยิงจริง.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: '5.2 ฉากควันกำบัง',
    description: 'บันทึกบริบทฉากควันกำบังและสถานะการสังเกตเพื่อส่งต่อในกระบวนงาน.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
];

export function FoWorkspace({ mode = 'full' }: FoWorkspaceProps) {
  const { activateMission, clearTarget, eventLog, missionId, missionStatus, roleView, setActiveTarget, setOpenDocument } =
    useSharedOperationalState();
  const [sequence, setSequence] = useState(1);
  const [selectedTargetId, setSelectedTargetId] = useState(trainingTargets[0].id);
  const [activeMethod, setActiveMethod] = useState('พิกัดกริด');
  const [targetCount, setTargetCount] = useState(1);
  const [targetDescription, setTargetDescription] = useState('เป้าหมายฝึก');
  const [targetEasting, setTargetEasting] = useState('482110');
  const [targetNorthing, setTargetNorthing] = useState('1562210');
  const [phase, setPhase] = useState<FoSimulationPhase>('TARGET');
  const [holdReady, setHoldReady] = useState(false);
  const [angularSpeed, setAngularSpeed] = useState('1.5');
  const [timeOfFlight, setTimeOfFlight] = useState('12');
  const [lateralAdjustment, setLateralAdjustment] = useState(0);
  const [rangeAdjustment, setRangeAdjustment] = useState(0);
  const [hobAdjustment, setHobAdjustment] = useState(0);
  const holdTimer = useRef<number | null>(null);
  const targetFormRef = useRef<HTMLDivElement | null>(null);
  const visibleEvents = useMemo(() => filterVisibleEvents(roleView, eventLog), [eventLog, roleView]);

  const previewTarget = useMemo(
    () => ({
      id: `TGT-${String(sequence).padStart(3, '0')}`,
      easting: 482100 + sequence * 10,
      northing: 1562200 + sequence * 10,
      altitude: 125 + sequence,
    }),
    [sequence],
  );

  const handleCreateTarget = () => {
    activateMission(`MIS-${String(sequence).padStart(3, '0')}`, 'FO');
    setActiveTarget(previewTarget, 'FO');
    setOpenDocument(null);
    setSequence((current) => current + 1);
  };

  const isFullAccess = mode === 'full';
  const selectedTarget = trainingTargets.find((target) => target.id === selectedTargetId) ?? trainingTargets[0];
  const hasTargetCoordinates = targetEasting.trim() !== '' && targetNorthing.trim() !== '';
  const trainingElevationDifference = hasTargetCoordinates ? selectedTarget.altitude - 100 : null;
  const leadAngle = (Number(angularSpeed) || 0) * (Number(timeOfFlight) || 0);
  const methodDescriptions: Record<string, string> = {
    'พิกัดกริด': 'เครื่องมือคำนวณพิกัดเป้าหมายจากค่ากริดที่ป้อน',
    'โพลาร์': 'เครื่องมือคำนวณข้อมูลเป้าหมายจากมุมทิศและระยะที่ป้อน',
    'ย้ายจากจุดทราบที่ตั้ง': 'เครื่องมือคำนวณข้อมูลเป้าหมายจากจุดอ้างอิงและค่าการย้าย',
  };

  useEffect(() => () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
  }, []);

  const startBurstHold = () => {
    if (phase !== 'SHOT') return;
    setHoldReady(false);
    holdTimer.current = window.setTimeout(() => {
      setHoldReady(true);
      setPhase('ADJUSTING');
    }, 2000);
  };

  const cancelBurstHold = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  const resetSimulation = () => {
    cancelBurstHold();
    setHoldReady(false);
    setPhase('TARGET');
  };

  return (
    <section className={`domain-workspace${isFullAccess ? '' : ' domain-workspace--preview'}`} aria-label="fo-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">ผู้ตรวจการณ์หน้า</span>
        <h3>พื้นที่ทำงานผู้ตรวจการณ์หน้า</h3>
        <span className="route-kicker">{isFullAccess ? 'เข้าถึงเต็ม' : 'พรีวิวแบบอ่านอย่างเดียว'}</span>
      </header>
      <ul className="domain-list">
        <li>การระบุเป้าหมายแบบกริด / โพลาร์ / ชิฟต์</li>
        <li>เครื่องมือแฟลช-ทู-แบง และสูตรมิล</li>
        <li>กระบวนการปรับแก้เป้าหมาย</li>
        <li>การมองเห็นแผนที่แบบจำกัดตามกฎ OPSEC</li>
      </ul>
      <CapabilityCatalog title="แกนการได้มาซึ่งเป้าหมาย" items={foCapabilities} />

      <section className="fo-training-panel" aria-label="เครื่องมือฝึกปฏิบัติ FO">
        <div className="fo-training-panel__header">
          <div>
            <span className="route-kicker">FO TRAINING SIMULATOR</span>
            <h4>บัญชีเป้าหมายและวงจรส่งคำขอ</h4>
          </div>
          <div className="fo-training-panel__header-actions">
            <button
              type="button"
              className="fo-training-panel__open-form"
              onClick={() => targetFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              เปิดแบบฟอร์มระบุเป้าหมาย
            </button>
            <span className="state-chip state-warning">ข้อมูลตัวอย่างเท่านั้น</span>
          </div>
        </div>

        <div className="fo-training-grid">
          <div ref={targetFormRef} className="fo-training-form" id="fo-target-form">
            <label>
              จำนวนเป้าหมาย
              <input type="number" min="1" max="20" value={targetCount} onChange={(event) => setTargetCount(Number(event.target.value))} disabled={!isFullAccess} />
            </label>
            <label>
              มุมตรวจการณ์ (ข้อมูลฝึก)
              <input type="number" min="0" max="6400" placeholder="0000" disabled={!isFullAccess} />
            </label>
            <label>
              เป้าหมายในบัญชี
              <select value={selectedTargetId} onChange={(event) => setSelectedTargetId(event.target.value)} disabled={!isFullAccess}>
                {trainingTargets.map((target) => <option key={target.id} value={target.id}>{target.id} · {target.description}</option>)}
              </select>
            </label>
            <label>
              ลักษณะเป้าหมาย
              <input value={targetDescription} onChange={(event) => setTargetDescription(event.target.value)} disabled={!isFullAccess} />
            </label>
            <div className="fo-training-coordinate-fields">
              <label>พิกัดตะวันออก<input value={targetEasting} onChange={(event) => setTargetEasting(event.target.value)} disabled={!isFullAccess} /></label>
              <label>พิกัดเหนือ<input value={targetNorthing} onChange={(event) => setTargetNorthing(event.target.value)} disabled={!isFullAccess} /></label>
            </div>
            <div className="fo-training-readout">
              <span>บัญชีเป้าหมายที่ 1 / {Math.max(1, targetCount || 1)}</span>
              <strong>{targetEasting || '--'} / {targetNorthing || '--'}</strong>
              <small>{targetDescription || 'ยังไม่ระบุ'} · ข้อมูลสำหรับการฝึกเท่านั้น</small>
            </div>
            <div className="fo-training-readout fo-training-readout--elevation" aria-live="polite">
              <span>ความแตกต่างสูง (อัตโนมัติ)</span>
              <strong>{trainingElevationDifference === null ? '--' : `${trainingElevationDifference >= 0 ? '+' : ''}${trainingElevationDifference} ม.`}</strong>
              <small>{trainingElevationDifference === null ? 'รอพิกัดเป้าหมาย' : 'เทียบกับระดับจุดอ้างอิงฝึก 100 ม.'}</small>
            </div>
          </div>

          <div className="fo-training-map" role="img" aria-label="แผนที่ฝึกพร้อมตำแหน่งตัวอย่าง">
            <span className="fo-training-map__crosshair" aria-hidden="true" />
            <span className="fo-training-map__fo">FO / จุดของเรา</span>
            <button type="button" className="fo-training-map__marker" aria-label={`เลือก ${selectedTarget.id}`} onClick={() => setSelectedTargetId(selectedTarget.id)}>
              {selectedTarget.id}
            </button>
            <span className="fo-training-map__legend">แผนที่ฝึก · ไม่มี GPS · ไม่มีข้อมูลจริง</span>
          </div>
        </div>

        <div className="fo-training-methods" aria-label="เครื่องมือค้นหาเป้าหมายแบบเรียลไทม์">
          <span className="route-kicker">วิธีค้นหาเป้าหมาย / เครื่องมือคำนวณ</span>
          <div className="fo-training-method-buttons">
            {Object.keys(methodDescriptions).map((method) => (
              <button type="button" key={method} className={activeMethod === method ? 'is-active' : ''} onClick={() => setActiveMethod(method)} disabled={!isFullAccess}>
                {method}
              </button>
            ))}
          </div>
          <p className="fo-training-note">เครื่องมือที่เลือก: <strong>{activeMethod}</strong> · {methodDescriptions[activeMethod]} · แสดงผลแบบฝึก ไม่ส่งข้อมูลจริง</p>
        </div>

        <div className="fo-training-flow" aria-live="polite">
          <span className={phase === 'TARGET' ? 'is-current' : ''}>เป้าหมาย</span>
          <span className={phase === 'REQUESTED' ? 'is-current' : ''}>ส่งคำขอ</span>
          <span className={phase === 'SHOT' ? 'is-current' : ''}>Shot จำลอง</span>
          <span className={phase === 'ADJUSTING' ? 'is-current' : ''}>ปรับแก้</span>
          <span className={phase === 'ENDED' ? 'is-current' : ''}>จบภารกิจ</span>
        </div>

        <section className="fo-training-tools" aria-label="เครื่องมือเป้าหมายเคลื่อนที่และปรับการยิงแบบฝึก">
          <div className="fo-training-tool-card">
            <div className="fo-training-tool-card__header">
              <div>
                <span className="route-kicker">ภารกิจพิเศษ / เป้าหมายเคลื่อนที่</span>
                <h4>เครื่องยนต์ดักยิงเป้าหมายเคลื่อนที่</h4>
              </div>
              <span className="state-chip state-warning">จำลอง</span>
            </div>
            <div className="fo-training-tool-fields">
              <label>ความเร็วเชิงมุม (มิล/วินาที)<input type="number" min="0" step="0.1" value={angularSpeed} onChange={(event) => setAngularSpeed(event.target.value)} disabled={!isFullAccess} /></label>
              <label>เวลาแล่น TOF (วินาที)<input type="number" min="0" step="0.1" value={timeOfFlight} onChange={(event) => setTimeOfFlight(event.target.value)} disabled={!isFullAccess} /></label>
            </div>
            <div className="fo-training-readout fo-training-readout--orange" aria-live="polite">
              <span>มุมดักเป้าหมาย (ผลจำลอง)</span>
              <strong>{leadAngle.toFixed(1)} มิล</strong>
              <small>อัปเดตทันทีจากค่าตัวอย่าง · ไม่ใช่คำสั่งยิงจริง</small>
            </div>
          </div>

          <div className="fo-training-tool-card">
            <div className="fo-training-tool-card__header">
              <div>
                <span className="route-kicker">การปรับการยิง / แบบฝึก</span>
                <h4>แผงปรับแก้จุดตก</h4>
              </div>
              <span className="state-chip state-live">สถานะฝึก</span>
            </div>
            <div className="fo-adjustment-grid">
              <div><span>ทางข้าง</span><strong>{lateralAdjustment > 0 ? '+' : ''}{lateralAdjustment} ม.</strong><div><button type="button" onClick={() => setLateralAdjustment((value) => value - 10)} disabled={!isFullAccess}>ซ้าย 10</button><button type="button" onClick={() => setLateralAdjustment((value) => value + 10)} disabled={!isFullAccess}>ขวา 10</button></div></div>
              <div><span>ระยะ</span><strong>{rangeAdjustment > 0 ? '+' : ''}{rangeAdjustment} ม.</strong><div><button type="button" onClick={() => setRangeAdjustment((value) => value - 50)} disabled={!isFullAccess}>ลด 50</button><button type="button" onClick={() => setRangeAdjustment((value) => value + 50)} disabled={!isFullAccess}>เพิ่ม 50</button></div></div>
              <div><span>ความสูง HOB</span><strong>{hobAdjustment > 0 ? '+' : ''}{hobAdjustment} ม.</strong><div><button type="button" onClick={() => setHobAdjustment((value) => value - 1)} disabled={!isFullAccess}>ต่ำลง 1</button><button type="button" onClick={() => setHobAdjustment((value) => value + 1)} disabled={!isFullAccess}>สูงขึ้น 1</button></div></div>
            </div>
            <small className="fo-training-note">ค่าทั้งหมดเป็นการปรับในแบบฝึก ไม่ส่งต่อเป็นคำสั่งยิง</small>
          </div>
        </section>

        {isFullAccess ? (
          <div className="control-row">
            <button type="button" className="primary-button" onClick={() => setPhase('REQUESTED')} disabled={phase !== 'TARGET'}>ส่งคำขอจำลอง</button>
            <button type="button" className="ghost-button" onClick={() => setPhase('SHOT')} disabled={phase !== 'REQUESTED'}>จำลอง FDC ตอบ Shot</button>
            <button type="button" className="ghost-button" onPointerDown={startBurstHold} onPointerUp={cancelBurstHold} onPointerCancel={cancelBurstHold} onPointerLeave={cancelBurstHold} disabled={phase !== 'SHOT'}>
              กดค้าง 2 วินาที: จุดตกจำลอง
            </button>
            <button type="button" className="primary-button" onClick={() => setPhase('ENDED')} disabled={phase !== 'ADJUSTING'}>จบภารกิจจำลอง</button>
            <button type="button" className="ghost-button" onClick={resetSimulation}>เริ่มรอบใหม่</button>
          </div>
        ) : null}

        <p className="fo-training-note">
          สถานะปัจจุบัน: {phase === 'TARGET' ? 'พร้อมเลือกเป้าหมาย' : phase === 'REQUESTED' ? 'คำขออยู่ในโหมดจำลอง' : phase === 'SHOT' ? 'ได้รับ Shot จำลอง — กดค้างเพื่อวางจุดตก' : phase === 'ADJUSTING' ? 'จุดตกจำลองถูกบันทึกแล้ว ยังไม่มีการคำนวณแก้ยิง' : 'ภารกิจจำลองจบแล้ว'}
          {holdReady ? ' · ยืนยันการกดค้างครบ 2 วินาที' : ''}
        </p>
      </section>

      {isFullAccess ? (
        <div className="control-row">
          <button type="button" className="primary-button" onClick={handleCreateTarget}>
            สร้างเป้าหมายร่วม
          </button>
          <button type="button" className="ghost-button" onClick={() => clearTarget('FO')}>
            ล้างเป้าหมาย
          </button>
        </div>
      ) : (
        <div className="opsec-panel opsec-panel--preview">
          <span className="route-kicker">สรุป FO</span>
          <p>พรีวิวแบบอ่านอย่างเดียวของ FO ยังคงเห็นบริบทเป้าหมาย แต่ไม่เปิดเผยรายละเอียด FDC หรือปุ่มควบคุมการยิง</p>
        </div>
      )}

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">ภารกิจ</span>
          <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
          <p>{formatMissionStatus(missionStatus)}</p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">เป้าหมายที่เตรียมไว้</span>
          <strong>{previewTarget.id}</strong>
          <p>
            {previewTarget.easting} / {previewTarget.northing} / ระดับสูง {previewTarget.altitude}
          </p>
        </div>
      </div>

      <div className="opsec-panel">
        <span className="route-kicker">กฎแผนที่ร่วมตาม OPSEC</span>
        <p>FO เห็นเฉพาะตำแหน่งผู้ตรวจการณ์ เป้าหมาย และบริบทจุดตกกระทบที่จำเป็น ไม่เห็น FDC / แผนที่ / ส่วนยิง / กระสุน</p>
      </div>

      <div className="event-log-panel">
          <span className="route-kicker">ฟีดเหตุการณ์ FO</span>
        {visibleEvents.length ? (
          visibleEvents.slice(0, 4).map((entry) => (
            <p key={entry.id}>
              {entry.createdAt} [{entry.source === 'SYSTEM' ? 'ระบบ' : formatRoleLabel(entry.source)}] {entry.message}
            </p>
          ))
        ) : (
          <p>ยังไม่มีเหตุการณ์จากกระบวนการ</p>
        )}
      </div>
    </section>
  );
}
