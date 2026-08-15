import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function CounterBatteryDocument() {
  const { activeTarget, missionId, missionStatus, minQeLocked } = useSharedOperationalState();

  return (
    <DocumentModeShell title="????????????????????????????? ?.">
      <p>??????? preview ???????????????? Crater Analysis ??? counter-battery workflow ???????</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Mission</span>
          <strong>{missionId ?? 'No mission'}</strong>
          <p>{missionStatus}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Target Ref</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : '?????????????????????'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Safety Ref</span>
          <strong>{minQeLocked ? 'MIN QE LOCKED' : 'MIN QE CLEAR'}</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
