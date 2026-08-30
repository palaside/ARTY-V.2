import { useMemo } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import {
  formatDocumentLabel,
  formatFireMissionStatus,
  formatMissionStatus,
  formatRoleLabel,
  formatSeverityLabel,
} from '@/shared/labels';

type FdcWorkspaceProps = {
  mode?: 'full' | 'preview';
};

export function FdcWorkspace({ mode = 'full' }: FdcWorkspaceProps) {
  const {
    activeTarget,
    eventLog,
    fireLocked,
    fireMissionStatus,
    minQeLocked,
    missionId,
    missionStatus,
    reportQueue,
    setFireLocked,
    setMinQeLocked,
    completeMission,
    queueReport,
    roleView,
  } = useSharedOperationalState();
  const visibleEvents = useMemo(() => filterVisibleEvents(roleView, eventLog), [eventLog, roleView]);
  const isFullAccess = mode === 'full';

  return (
    <section className={`domain-workspace${isFullAccess ? '' : ' domain-workspace--preview'}`} aria-label="fdc-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">ศูนย์ตัดสินใจ</span>
        <h3>พื้นที่ทำงานศูนย์อำนวยการยิง</h3>
        <span className="route-kicker">{isFullAccess ? 'ศูนย์ตัดสินใจ' : 'พรีวิวแบบอ่านอย่างเดียว'}</span>
      </header>
      <ul className="domain-list">
        <li>รับเป้าหมายและสถานะภารกิจ</li>
        <li>พื้นที่ทบทวนผลยิง</li>
        <li>แผงประตูความปลอดภัย / สถานะล็อก</li>
        <li>มุมมองแผนที่ร่วมแบบเปิดกว้างกว่า</li>
      </ul>

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">ภารกิจ</span>
          <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
          <p>
            {formatMissionStatus(missionStatus)} / {formatFireMissionStatus(fireMissionStatus)}
          </p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">เป้าหมายร่วม</span>
          <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
          <p>
            {activeTarget
              ? `${activeTarget.easting} / ${activeTarget.northing} / ระดับความสูง ${activeTarget.altitude}`
              : 'รอเป้าหมายจาก FO หรือแหล่งเป้าหมายร่วม'}
          </p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">ความปลอดภัย</span>
          <strong>{fireLocked ? 'ล็อกการยิง' : 'พร้อมยิง'}</strong>
          <p>ค่า QE ต่ำสุด: {minQeLocked ? 'ล็อก' : 'ปลดล็อก'}</p>
        </div>
      </div>

      {isFullAccess ? (
        <div className="control-row">
          <button type="button" className="ghost-button" onClick={() => setFireLocked(!fireLocked)}>
            สลับล็อกการยิง
          </button>
          <button type="button" className="ghost-button" onClick={() => setMinQeLocked(!minQeLocked)}>
            สลับล็อกค่า QE ต่ำสุด
          </button>
          <button type="button" className="ghost-button" onClick={() => queueReport('DEPUTY_REPORT', 'FDC')}>
            เข้าคิวพรีวิวรายงาน
          </button>
          <button type="button" className="primary-button" onClick={() => completeMission('FDC')}>
            จบภารกิจ
          </button>
        </div>
      ) : (
        <div className="opsec-panel opsec-panel--preview">
          <span className="route-kicker">สรุป FDC</span>
          <p>พรีวิวแบบอ่านอย่างเดียวของ FDC ยังคงแสดงภารกิจ เป้าหมาย และสถานะความปลอดภัย โดยไม่เปิดปุ่มแก้ไขให้บทบาทอื่น</p>
        </div>
      )}

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">คิวรายงาน</span>
          <strong>{reportQueue.length}</strong>
          <p>
            {reportQueue[0]
              ? `${formatDocumentLabel(reportQueue[0].document)} จาก ${formatRoleLabel(reportQueue[0].source)}`
              : 'ยังไม่มีรายงานในคิว'}
          </p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">เหตุการณ์ล่าสุด</span>
          <strong>{visibleEvents[0] ? formatSeverityLabel(visibleEvents[0].severity) : 'ไม่มี'}</strong>
          <p>{visibleEvents[0]?.message ?? 'ยังไม่มีเหตุการณ์ร่วม'}</p>
        </div>
      </div>
    </section>
  );
}
