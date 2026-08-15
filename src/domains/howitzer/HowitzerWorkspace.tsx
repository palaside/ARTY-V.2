import { CraterAnalysisWorkspace } from './crater/CraterAnalysisWorkspace';
import { M17Workspace } from './m17/M17Workspace';

export function HowitzerWorkspace() {
  return (
    <section className="domain-workspace" aria-label="howitzer-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">Howitzer</span>
        <h3>Howitzer Section Workspace</h3>
      </header>
      <div className="domain-stack">
        <M17Workspace />
        <CraterAnalysisWorkspace />
      </div>
    </section>
  );
}
