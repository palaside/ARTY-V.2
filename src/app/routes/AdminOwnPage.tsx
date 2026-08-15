import { mockAccounts } from '@/app/auth/auth-state';
import type { AuthSession, UserRole } from '@/app/auth/auth-types';

type AdminOwnPageProps = {
  session: AuthSession;
  onOpenWorkspace: (role: UserRole) => void;
};

export function AdminOwnPage({ session, onOpenWorkspace }: AdminOwnPageProps) {
  if (session.role !== 'ADMIN') {
    return (
      <section className="route-card admin-layout" aria-label="admin-own-page">
        <span className="route-kicker">Admin / OWN</span>
        <h2>Access Restricted</h2>
        <p>???????????????????????? Admin / OWN ????????</p>
      </section>
    );
  }

  return (
    <section className="route-card admin-layout" aria-label="admin-own-page">
      <span className="route-kicker">Admin / OWN</span>
      <h2>Access Control Surface</h2>
      <p>???????????????????????????????????? ??????????? workspace ???????????????????? shell ?????????</p>

      <div className="account-table" role="table" aria-label="account-table">
        {mockAccounts.map((account) => (
          <div key={`${account.role}-${account.username}`} className="account-row" role="row">
            <div>
              <strong>{account.label}</strong>
              <p>
                {account.username} · {account.role}
              </p>
            </div>

            <div className="account-actions">
              <span className={`pill ${account.enabled ? 'pill--success' : 'pill--danger'}`}>
                {account.enabled ? 'Enabled' : 'Disabled'}
              </span>

              {account.role !== 'ADMIN' ? (
                <button type="button" className="ghost-button" onClick={() => onOpenWorkspace(account.role)}>
                  Open Workspace
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
