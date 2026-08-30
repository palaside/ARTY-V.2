import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';
import { formatMissionStatus } from '@/shared/labels';

export function CounterBatteryDocument() {
  const { activeTarget, missionId, missionStatus, minQeLocked } = useSharedOperationalState();

  return (
    <DocumentModeShell title="บขตป. — ระบบวิเคราะห์หลุมระเบิด">
      <p>พรีวิวที่เชื่อมการวิเคราะห์หลุมระเบิดกับกระบวนการต่อต้านปืนใหญ่สำหรับการใช้งานจริง</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">ภารกิจ</span>
          <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
          <p>{formatMissionStatus(missionStatus)}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">อ้างอิงเป้าหมาย</span>
          <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'ยังไม่มีจุดอ้างอิง'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">อ้างอิงความปลอดภัย</span>
          <strong>{minQeLocked ? 'ล็อกค่า QE ต่ำสุด' : 'ปลดล็อกค่า QE ต่ำสุด'}</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
