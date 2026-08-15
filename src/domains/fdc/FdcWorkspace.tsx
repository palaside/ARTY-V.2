import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function FdcWorkspace() {
  const {
    activeTarget,
    fireLocked,
    minQeLocked,
    missionId,
    missionStatus,
    setFireLocked,
    setMinQeLocked,
    completeMission,
    setOpenDocument,
  } = useSharedOperationalState();

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
          <p>{missionStatus}</p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">Shared Target</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>
            {activeTarget
              ? `${activeTarget.easting} / ${activeTarget.northing} / ALT ${activeTarget.altitude}`
              : '??????????? FO ???? shared target source'}
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
        <button type="button" className="ghost-button" onClick={() => setOpenDocument('DEPUTY_REPORT')}>
          Queue Report Preview
        </button>
        <button type="button" className="primary-button" onClick={completeMission}>
          Complete Mission
        </button>
      </div>
    </section>
  );
}
