import type { AuthSession } from '../auth/auth-types';
import { WorkspaceShell } from '../layout/WorkspaceShell';
import type { UserRole } from '../auth/auth-types';
import { formatRoleLabel } from '@/shared/labels';

type UserWorkspacePageProps = {
  session: AuthSession;
  workspaceRole: UserRole | null;
  onBackToDashboard: () => void;
  onBackToAdmin: () => void;
};

export function UserWorkspacePage({
  session,
  workspaceRole,
  onBackToDashboard,
  onBackToAdmin,
}: UserWorkspacePageProps) {
  const activeRole = workspaceRole ?? session.role;

  if (!activeRole) {
    return (
      <section className="route-card route-card--workspace" aria-label="user-workspace-page">
        <span className="route-kicker">ผู้ใช้</span>
        <h2>พื้นที่ทำงานปฏิบัติการ</h2>
        <p>ยังไม่มีบทบาทที่ใช้งานอยู่ในเซสชันนี้ กรุณากลับไปเข้าสู่ระบบจากแดชบอร์ด</p>
        <button type="button" className="ghost-button" onClick={onBackToDashboard}>
          กลับไปแดชบอร์ด
        </button>
      </section>
    );
  }

  return (
    <section className="route-card route-card--workspace" aria-label="user-workspace-page">
      <span className="route-kicker">ผู้ใช้</span>
      <h2>พื้นที่ทำงานปฏิบัติการ — {formatRoleLabel(activeRole)}</h2>
      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">บทบาทที่ใช้งาน</span>
          <strong>{formatRoleLabel(activeRole)}</strong>
          <p>{session.role === 'ADMIN' ? 'โหมดพรีวิวของผู้ดูแลระบบกำลังใช้งานในพื้นที่นี้' : 'พื้นที่ทำงานนี้ถูกล็อกตามบทบาทที่เข้าสู่ระบบ'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">ขอบเขตการมองเห็น</span>
          <strong>กำหนดตามบทบาท</strong>
          <p>ข้อมูลข้ามหมวดที่ไม่อนุญาตจะไม่ถูกเปิดเผย</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">สถานะร่วม</span>
          <strong>เปิดใช้งาน</strong>
          <p>สถานะภารกิจ เป้าหมาย และเหตุการณ์ ดึงจากแกนกลางร่วม</p>
        </div>
      </div>
      {session.role === 'ADMIN' ? (
        <div className="control-row">
          <button type="button" className="ghost-button" onClick={onBackToAdmin}>
            กลับไปผู้ดูแลระบบ / เจ้าของระบบ
          </button>
        </div>
      ) : null}
      <WorkspaceShell role={activeRole} />
    </section>
  );
}
