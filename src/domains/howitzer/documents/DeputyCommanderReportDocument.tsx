import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function DeputyCommanderReportDocument() {
  const { activeTarget, fireLocked, missionId, missionStatus } = useSharedOperationalState();

  return (
    <DocumentModeShell title="Report ??? ??.???? ?.">
      <p>??????? preview ??????????????????????????</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Mission</span>
          <strong>{missionId ?? 'No mission'}</strong>
          <p>{missionStatus}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Target</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : '?? shared target'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Fire State</span>
          <strong>{fireLocked ? 'LOCKED' : 'READY'}</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
