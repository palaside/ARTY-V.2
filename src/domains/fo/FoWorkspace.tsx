import { useMemo, useState } from 'react';
import { filterVisibleEvents } from '@/app/auth/role-visibility';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function FoWorkspace() {
  const { activateMission, clearTarget, eventLog, missionId, missionStatus, roleView, setActiveTarget, setOpenDocument } =
    useSharedOperationalState();
  const [sequence, setSequence] = useState(1);
  const visibleEvents = useMemo(() => filterVisibleEvents(roleView, eventLog), [eventLog, roleView]);

  const previewTarget = useMemo(
    () => ({
      id: `TGT-${String(sequence).padStart(3, '0')}`,
      easting: 482100 + sequence * 10,
      northing: 1562200 + sequence * 10,
      altitude: 125 + sequence,
    }),
    [sequence],
  );

  const handleCreateTarget = () => {
    activateMission(`MIS-${String(sequence).padStart(3, '0')}`, 'FO');
    setActiveTarget(previewTarget, 'FO');
    setOpenDocument(null);
    setSequence((current) => current + 1);
  };

  return (
    <section className="domain-workspace" aria-label="fo-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">FO</span>
        <h3>Forward Observer Workspace</h3>
      </header>
      <ul className="domain-list">
        <li>Grid / Polar / Shift target acquisition</li>
        <li>Flash-to-Bang and Mil Formula tools</li>
        <li>Target adjustment workflow</li>
        <li>Restricted map visibility per OPSEC rule</li>
      </ul>

      <div className="control-row">
        <button type="button" className="primary-button" onClick={handleCreateTarget}>
          Create Shared Target
        </button>
        <button type="button" className="ghost-button" onClick={() => clearTarget('FO')}>
          Clear Target
        </button>
      </div>

      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Mission</span>
          <strong>{missionId ?? 'No mission'}</strong>
          <p>{missionStatus}</p>
        </div>

        <div className="status-tile">
          <span className="route-kicker">Prepared Target</span>
          <strong>{previewTarget.id}</strong>
          <p>
            {previewTarget.easting} / {previewTarget.northing} / ALT {previewTarget.altitude}
          </p>
        </div>
      </div>

      <div className="opsec-panel">
        <span className="route-kicker">OPSEC Shared Map Rule</span>
        <p>FO เห็นเฉพาะตำแหน่งผู้ตรวจการณ์ เป้าหมาย และ impact context ที่จำเป็น ไม่เห็น FDC / Surveillance / ส่วนยิง / กระสุน</p>
      </div>

      <div className="event-log-panel">
        <span className="route-kicker">FO Event Feed</span>
        {visibleEvents.length ? (
          visibleEvents.slice(0, 4).map((entry) => (
            <p key={entry.id}>
              {entry.createdAt} [{entry.source}] {entry.message}
            </p>
          ))
        ) : (
          <p>ยังไม่มี event จาก workflow</p>
        )}
      </div>
    </section>
  );
}
