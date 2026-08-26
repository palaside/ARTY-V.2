import type { MockUserAccount } from '@/app/auth/auth-state';
import type { AuthSession, UserRole } from '@/app/auth/auth-types';

type AdminOwnPageProps = {
  accounts: MockUserAccount[];
  session: AuthSession;
  onAccountsChanged: (accounts: MockUserAccount[]) => void;
  onOpenWorkspace: (role: UserRole) => void;
};

export function AdminOwnPage({ accounts, session, onAccountsChanged, onOpenWorkspace }: AdminOwnPageProps) {
  if (session.role !== 'ADMIN') {
    return (
      <section className="route-card admin-layout" aria-label="admin-own-page">
        <span className="route-kicker">Admin / OWN</span>
        <h2>Access Restricted</h2>
        <p>หน้านี้อนุญาตเฉพาะเจ้าของระบบเท่านั้น</p>
      </section>
    );
  }

  const toggleAccount = (id: string) => {
    onAccountsChanged(
      accounts.map((account) =>
        account.id === id && account.role !== 'ADMIN' ? { ...account, enabled: !account.enabled } : account,
      ),
    );
  };

  const resetPassword = (id: string) => {
    onAccountsChanged(
      accounts.map((account) =>
        account.id === id && account.role !== 'ADMIN' ? { ...account, password: account.username } : account,
      ),
    );
  };

  const enabledAccounts = accounts.filter((account) => account.enabled);
  const disabledAccounts = accounts.filter((account) => !account.enabled);
  const managedAccounts = accounts.filter((account) => account.role !== 'ADMIN');

  return (
    <section className="route-card admin-layout" aria-label="admin-own-page">
      <span className="route-kicker">Admin / OWN</span>
      <h2>Access Control Surface</h2>
      <p>เจ้าของระบบจัดการบัญชีผู้ใช้รายหมวด ตัดสัญญาณการเข้าใช้งาน และเปิด workspace เพื่อตรวจสอบสิทธิ์ได้จากจุดเดียว</p>

      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">Managed Accounts</span>
          <strong>{managedAccounts.length}</strong>
          <p>บัญชีที่อยู่ใต้การควบคุมของ owner</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Enabled</span>
          <strong>{enabledAccounts.length}</strong>
          <p>บัญชีที่ยังเข้าสู่ระบบได้</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Disabled</span>
          <strong>{disabledAccounts.length}</strong>
          <p>บัญชีที่ถูกตัดสัญญาณชั่วคราว</p>
        </div>
      </div>

      <div className="account-table" role="table" aria-label="account-table">
        {accounts.map((account) => (
          <div key={`${account.role}-${account.username}`} className="account-row" role="row">
            <div>
              <strong>{account.label}</strong>
              <p>
                {account.username} — {account.role}
              </p>
            </div>

            <div className="account-actions">
              <span className={`pill ${account.enabled ? 'pill--success' : 'pill--danger'}`}>
                {account.enabled ? 'Enabled' : 'Disabled'}
              </span>

              {account.role !== 'ADMIN' ? (
                <>
                  <button type="button" className="ghost-button" onClick={() => toggleAccount(account.id)}>
                    {account.enabled ? 'Cut Login' : 'Restore Login'}
                  </button>
                  <button type="button" className="ghost-button" onClick={() => resetPassword(account.id)}>
                    Reset Pass
                  </button>
                  <button type="button" className="ghost-button" onClick={() => onOpenWorkspace(account.role)}>
                    Open Workspace
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
