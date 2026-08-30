import { CraterAnalysisWorkspace } from './crater/CraterAnalysisWorkspace';
import { M17Workspace } from './m17/M17Workspace';

export function HowitzerWorkspace() {
  return (
    <section className="domain-workspace" aria-label="howitzer-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">ส่วนยิง</span>
        <h3>พื้นที่ทำงานส่วนยิง</h3>
      </header>
      <div className="domain-stack">
        <M17Workspace />
        <CraterAnalysisWorkspace />
      </div>
    </section>
  );
}
