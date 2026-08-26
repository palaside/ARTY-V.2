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
      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">Active Role</span>
          <strong>{session.role}</strong>
          <p>Workspace นี้ถูกล็อกตาม role ที่ login เข้ามา</p>
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
      <WorkspaceShell role={session.role} />
    </section>
  );
}
