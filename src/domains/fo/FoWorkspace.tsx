import { useMemo, useState } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import { formatMissionStatus, formatRoleLabel } from '@/shared/labels';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';

type FoWorkspaceProps = {
  mode?: 'full' | 'preview';
};

const foCapabilities: CapabilityItem[] = [
  {
    title: 'กำหนดที่ตั้งเป้าหมาย 3 วิธี',
    description: 'พื้นที่รับข้อมูลพิกัดกริด, โพลาร์ และการย้ายจากจุดอ้างอิง เพื่อจัดรูปแบบข้อมูลเป้าหมายก่อนส่งเข้าสู่ชั้นร่วม.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: 'เครื่องมือสังเกตการณ์เฉพาะกิจ',
    description: 'พื้นที่สำหรับนาฬิกา Flash-to-Bang และตัวช่วยอ่านค่ามิล ใช้เป็นโหมดฝึกจนกว่าจะเชื่อมแหล่งข้อมูลอ้างอิงที่ตรวจสอบแล้ว.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
  {
    title: 'การปรับแก้และ Bracketing',
    description: 'บันทึกการสังเกตจุดตกกระทบและคำขอแก้ทางข้าง ระยะ และความสูง โดยยังไม่สร้างหรือส่งคำสั่งยิงจริง.',
    state: 'พร้อมแสดงผล',
  },
  {
    title: 'โหมดฉุกเฉิน FO',
    description: 'หน้าจอรวบรวมข้อมูลภารกิจที่ FO เห็นได้ตามสิทธิ์ พร้อมบันทึกหลักฐานสำหรับการทบทวนในโหมดฝึก.',
    state: 'โหมดฝึก / รอข้อมูลอ้างอิง',
  },
];

export function FoWorkspace({ mode = 'full' }: FoWorkspaceProps) {
  const { activateMission, clearTarget, eventLog, missionId, missionStatus, roleView, setActiveTarget, setOpenDocument } =
    useSharedOperationalState();
  const [sequence, setSequence] = useState(1);
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
