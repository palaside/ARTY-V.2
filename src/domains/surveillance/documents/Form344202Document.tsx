import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function Form344202Document() {
  const { activeTarget, mapZoom } = useSharedOperationalState();

  return (
    <DocumentModeShell title="ทบ.344-202">
      <p>พรีวิวเอกสารที่เชื่อมกับขั้นตอนการเดินเส้นและการปรับเทียบแผนที่</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">อ้างอิงเป้าหมาย</span>
          <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
          <p>{activeTarget ? `ระดับความสูง ${activeTarget.altitude}` : 'ยังไม่มีข้อมูลในชั้นร่วม'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">ซูมแผนที่</span>
          <strong>{mapZoom.toFixed(1)}x</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
