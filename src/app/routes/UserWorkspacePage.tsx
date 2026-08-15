import { WorkspaceShell } from '../layout/WorkspaceShell';

export function UserWorkspacePage() {
  return (
    <section className="route-card route-card--workspace" aria-label="user-workspace-page">
      <span className="route-kicker">User</span>
      <h2>Operational Workspace</h2>
      <WorkspaceShell />
    </section>
  );
}
