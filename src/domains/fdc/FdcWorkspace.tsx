import { useMemo } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function FdcWorkspace() {
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

  return (
    <section className="domain-workspace" aria-label="fdc-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">FDC</span>
        <h3>Fire Direction Center Workspace</h3>
      </header>
      <ul className="domain-list">
        <li>Target intake and mission state</li>
        <li>Fire solution review surface</li>
        <li>Safety gate / lock state panel</li>
        <li>Expanded shared map visibility</li>
      </ul>

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Mission</span>
          <strong>{missionId ?? 'No mission'}</strong>
          <p>{missionStatus} / {fireMissionStatus}</p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">Shared Target</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>
            {activeTarget
              ? `${activeTarget.easting} / ${activeTarget.northing} / ALT ${activeTarget.altitude}`
              : 'รอ Target จาก FO หรือ Target List shared source'}
          </p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">Safety</span>
          <strong>{fireLocked ? 'FIRE LOCKED' : 'FIRE READY'}</strong>
          <p>Min QE: {minQeLocked ? 'LOCKED' : 'CLEAR'}</p>
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="ghost-button" onClick={() => setFireLocked(!fireLocked)}>
          Toggle Fire Lock
        </button>
        <button type="button" className="ghost-button" onClick={() => setMinQeLocked(!minQeLocked)}>
          Toggle Min QE
        </button>
        <button type="button" className="ghost-button" onClick={() => queueReport('DEPUTY_REPORT', 'FDC')}>
          Queue Report Preview
        </button>
        <button type="button" className="primary-button" onClick={() => completeMission('FDC')}>
          Complete Mission
        </button>
      </div>

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Report Queue</span>
          <strong>{reportQueue.length}</strong>
          <p>{reportQueue[0] ? `${reportQueue[0].document} from ${reportQueue[0].source}` : 'No report queued'}</p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">Latest Event</span>
          <strong>{visibleEvents[0]?.severity ?? 'NONE'}</strong>
          <p>{visibleEvents[0]?.message ?? 'No shared event yet'}</p>
        </div>
      </div>
    </section>
  );
}
