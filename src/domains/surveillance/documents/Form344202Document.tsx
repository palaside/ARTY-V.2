import { DocumentModeShell } from '@/app/layout/DocumentModeShell';
import { useSharedOperationalState } from '@/shared/state/shared-operational-context';

export function Form344202Document() {
  const { activeTarget, mapZoom } = useSharedOperationalState();

  return (
    <DocumentModeShell title="??.344-202">
      <p>??????? preview ??????????????????? traverse ????????????????/???????</p>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Target Ref</span>
          <strong>{activeTarget?.id ?? 'No target'}</strong>
          <p>{activeTarget ? `ALT ${activeTarget.altitude}` : '?????????????????? shared layer'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Map Zoom</span>
          <strong>{mapZoom.toFixed(1)}x</strong>
        </div>
      </div>
    </DocumentModeShell>
  );
}
