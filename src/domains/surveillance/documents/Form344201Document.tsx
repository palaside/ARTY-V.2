import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function Form344201Document() {
  const { activeTarget, missionId } = useSharedOperationalState();

  return (
    <DocumentModeShell title="??.344-201">
      <p>??????? preview ????????????????????????????????????????????? 2 ???</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Mission</span>
          <strong>{missionId ?? 'No mission'}</strong>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Shared Target</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : '?????????? shared layer'}</p>
        </div>
      </div>
    </DocumentModeShell>
  );
}
