import type { AuthSession } from '../auth/auth-types';
import { WorkspaceShell } from '../layout/WorkspaceShell';
import type { UserRole } from '../auth/auth-types';

type UserWorkspacePageProps = {
  session: AuthSession;
  workspaceRole: UserRole | null;
  onBackToDashboard: () => void;
};

export function UserWorkspacePage({ session, workspaceRole, onBackToDashboard }: UserWorkspacePageProps) {
  const activeRole = workspaceRole ?? session.role;

  if (!activeRole) {
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
      <h2>Operational Workspace — {activeRole}</h2>
      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">Active Role</span>
          <strong>{activeRole}</strong>
          <p>{session.role === 'ADMIN' ? 'Admin preview mode is active for this workspace' : 'Workspace นี้ถูกล็อกตาม role ที่ login เข้ามา'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Visibility Boundary</span>
          <strong>ROLE-SCOPED</strong>
          <p>ข้อมูลข้ามหมวดที่ไม่อนุญาตจะไม่ถูกเปิดเผย</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Shared State</span>
          <strong>ON</strong>
          <p>Mission / target / event state ถูกดึงจากแกนกลางร่วม</p>
        </div>
        </div>
      <WorkspaceShell role={activeRole} />
    </section>
  );
}
