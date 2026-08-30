import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import { formatMissionStatus } from '@/shared/labels';

export function DeputyCommanderReportDocument() {
  const { activeTarget, fireLocked, missionId, missionStatus } = useSharedOperationalState();

  return (
    <DocumentModeShell title="รายงานรอง ผบ.ร้อย">
      <p>พรีวิวเอกสารรายงานที่เชื่อมกับสถานะภารกิจและเป้าหมายร่วม</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">ภารกิจ</span>
          <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
          <p>{formatMissionStatus(missionStatus)}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">เป้าหมาย</span>
          <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'ยังไม่มีเป้าหมายร่วม'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">สถานะการยิง</span>
          <strong>{fireLocked ? 'ล็อก' : 'พร้อม'}</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
