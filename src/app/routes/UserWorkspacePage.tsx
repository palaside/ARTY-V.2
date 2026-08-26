import type { AuthSession } from '../auth/auth-types';
import { WorkspaceShell } from '../layout/WorkspaceShell';

type UserWorkspacePageProps = {
  session: AuthSession;
  onBackToDashboard: () => void;
};

export function UserWorkspacePage({ session, onBackToDashboard }: UserWorkspacePageProps) {
  if (!session.role || session.role === 'ADMIN') {
    return (
      <section className="route-card route-card--workspace" aria-label="user-workspace-page">
        <span className="route-kicker">User</span>
        <h2>Operational Workspace</h2>
        <p>ยังไม่มี role ที่ active ใน session นี้ กรุณากลับไป Login จาก Dashboard</p>
        <button type="button" className="ghost-button" onClick={onBackToDashboard}>
          Back to Dashboard
        </button>
      </section>
    );
  }

  return (
    <section className="route-card route-card--workspace" aria-label="user-workspace-page">
      <span className="route-kicker">User</span>
      <h2>Operational Workspace — {session.role}</h2>
      <WorkspaceShell role={session.role} />
    </section>
  );
}
