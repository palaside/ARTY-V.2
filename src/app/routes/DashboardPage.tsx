import { useMemo, useState } from 'react';
import { authenticate, type MockUserAccount } from '@/app/auth/auth-state';
import type { AuthSession, UserRole } from '@/app/auth/auth-types';
import { formatRoleLabel } from '@/shared/labels';

type DashboardPageProps = {
  accounts: MockUserAccount[];
  session: AuthSession;
  onAuthenticated: (session: AuthSession) => void;
};

const roleCatalog: Array<{
  role: UserRole;
  label: string;
  detail: string;
}> = [
  { role: 'FO', label: 'ผู้ตรวจการณ์หน้า', detail: 'ค้นหา ระบุตำแหน่ง สร้างเป้าหมาย และส่งงานต่อ' },
  { role: 'FDC', label: 'ศูนย์ตัดสินใจ (FDC)', detail: 'ศูนย์ตัดสินใจสำหรับกระบวนการยิง ประตูความปลอดภัย และสถานะภารกิจ' },
  { role: 'SURVEILLANCE', label: 'แผนที่ / สำรวจ', detail: 'งานแผนที่ สำรวจ พิกัด ทิศ ระยะ และ ทบ.344' },
  { role: 'HOWITZER', label: 'ส่วนยิง', detail: 'ตำแหน่งปืน M.17 ความพร้อม และข้อมูลส่วนยิง' },
  { role: 'WEAPONS', label: 'กระสุน', detail: 'กระสุน ชนวน ความเข้ากันได้ และสถานะความปลอดภัย' },
  { role: 'ADMIN', label: 'ผู้ดูแลระบบ / เจ้าของระบบ', detail: 'เจ้าของระบบ จัดการผู้ใช้และตรวจพื้นที่ทำงาน' },
];

export function DashboardPage({ accounts, session, onAuthenticated }: DashboardPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('FO');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const availableAccounts = useMemo(
    () => accounts.filter((account) => account.role === selectedRole && account.enabled),
    [accounts, selectedRole],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextSession = authenticate(accounts, username, password, selectedRole);

    if (!nextSession) {
      setStatus('เข้าสู่ระบบไม่สำเร็จ: หมวด ผู้ใช้ หรือรหัสผ่านไม่ตรงกัน หรือบัญชีถูกตัดสัญญาณ');
      return;
    }

    setStatus(null);
    onAuthenticated(nextSession);
  };

  return (
    <section className="route-card route-card--workspace" aria-label="dashboard-page">
      <span className="route-kicker">แดชบอร์ด</span>
      <h2>พื้นที่เข้าสู่ระบบปฏิบัติการ</h2>
      <p>นี่คือจุดคัดกรองหมวดและเข้าสู่ระบบ โดยแยกขอบเขตบทบาทออกจากพื้นที่ทำงานจริงตั้งแต่ต้นทาง</p>

      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">หมวดที่เลือก</span>
          <strong>{roleCatalog.find((item) => item.role === selectedRole)?.label}</strong>
          <p>{roleCatalog.find((item) => item.role === selectedRole)?.detail}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">บัญชีที่เปิดใช้งาน</span>
          <strong>{availableAccounts.length}</strong>
          <p>เฉพาะบัญชีที่ตรงบทบาทและยังไม่ถูกตัดสัญญาณ</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">เซสชันปัจจุบัน</span>
          <strong>{formatRoleLabel(session.role)}</strong>
          <p>{session.username ? `ผู้ใช้: ${session.username}` : 'ยังไม่ได้เข้าสู่ระบบ'}</p>
        </div>
      </div>

      <div className="dashboard-layout">
      <article className="route-card dashboard-identity">
        <span className="route-kicker">แดชบอร์ด</span>
        <h2>ศูนย์เลือกหมวดงาน</h2>
        <p>
          เลือกหมวดงานทางซ้าย แล้วเข้าสู่ระบบด้วยบัญชีที่ตรงกับหมวดนั้นเท่านั้น
        </p>

        <div className="role-card-grid">
          {roleCatalog.map((item) => (
            <button
              key={item.role}
              type="button"
              className={`role-card${selectedRole === item.role ? ' role-card--active' : ''}`}
              onClick={() => setSelectedRole(item.role)}
            >
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </button>
          ))}
        </div>
      </article>

      <article className="route-card login-panel">
        <span className="route-kicker">เข้าสู่ระบบ</span>
        <h2>{roleCatalog.find((item) => item.role === selectedRole)?.label}</h2>
        <p>ระบบจะปฏิเสธทันทีหากบัญชีไม่ตรงกับหมวดที่เลือก หรือผู้ดูแลระบบตัดสัญญาณบัญชีไว้</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            ชื่อผู้ใช้
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="ชื่อผู้ใช้" />
          </label>

          <label>
            รหัสผ่าน
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="รหัสผ่าน"
            />
          </label>

          <button type="submit" className="primary-button">
            เข้าสู่ระบบด้วย {roleCatalog.find((item) => item.role === selectedRole)?.label}
          </button>
        </form>

        <div className="login-helper">
          <p className="route-kicker">บัญชีที่เปิดใช้งาน</p>
          {availableAccounts.length ? (
            <ul className="domain-list">
              {availableAccounts.map((account) => (
                <li key={account.username}>
                  <strong>{account.username}</strong> — {account.label}
                </li>
              ))}
            </ul>
          ) : (
            <p>ไม่มีบัญชีที่เปิดใช้งานสำหรับหมวดนี้</p>
          )}
        </div>

        {status ? <p className="status-banner status-banner--danger">{status}</p> : null}
        {session.role ? <p className="status-banner status-banner--success">เซสชันปัจจุบัน: {formatRoleLabel(session.role)}</p> : null}
      </article>
      </div>
    </section>
  );
}
