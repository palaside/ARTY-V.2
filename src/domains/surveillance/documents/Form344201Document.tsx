import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function Form344201Document() {
  const { activeTarget, missionId } = useSharedOperationalState();

  return (
    <DocumentModeShell title="ทบ.344-201">
      <p>พรีวิวเอกสารที่เชื่อมกับงานแผนที่และข้อมูลเป้าหมายร่วม</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">ภารกิจ</span>
          <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
        </div>
        <div className="status-tile">
          <span className="route-kicker">เป้าหมายร่วม</span>
          <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'ยังไม่มีข้อมูลในชั้นร่วม'}</p>
        </div>
      </div>
    </DocumentModeShell>
  );
}
