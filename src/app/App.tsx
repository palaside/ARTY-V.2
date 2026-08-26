import { useEffect, useMemo, useState } from 'react';
import type { AuthSession, UserRole } from './auth/auth-types';
import { defaultAccounts, defaultSession, type MockUserAccount } from './auth/auth-state';
import { AdminOwnPage } from './routes/AdminOwnPage';
import { DashboardPage } from './routes/DashboardPage';
import { UserWorkspacePage } from './routes/UserWorkspacePage';
import { SharedOperationalProvider } from '@/shared/state/shared-operational-context';

type Screen = 'DASHBOARD' | 'ADMIN' | 'USER';

type PersistedAppState = {
  screen: Screen;
  session: AuthSession;
  accounts: MockUserAccount[];
};

const STORAGE_KEY = 'arty-v2-app-state';

function readPersistedState(): PersistedAppState | null {
  const raw = globalThis.localStorage?.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedAppState;
  } catch {
    return null;
  }
}

function normalizeAccounts(accounts: MockUserAccount[] | undefined): MockUserAccount[] {
  if (!accounts?.length) {
    return defaultAccounts;
  }

  return defaultAccounts.map((defaultAccount) => {
    const persisted = accounts.find((account) => account.role === defaultAccount.role);

    return {
      ...defaultAccount,
      ...persisted,
      id: persisted?.id ?? defaultAccount.id,
      label: persisted?.label ?? defaultAccount.label,
    };
  });
}

export function App() {
  const persistedState = useMemo(() => readPersistedState(), []);
  const [screen, setScreen] = useState<Screen>(persistedState?.screen ?? 'DASHBOARD');
  const [session, setSession] = useState<AuthSession>(persistedState?.session ?? defaultSession);
  const [accounts, setAccounts] = useState<MockUserAccount[]>(() => normalizeAccounts(persistedState?.accounts));

  useEffect(() => {
    globalThis.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        screen,
        session,
        accounts,
      } satisfies PersistedAppState),
    );
  }, [accounts, screen, session]);

  const title = useMemo(() => {
    if (screen === 'ADMIN') {
      return 'ARTY V.2 — Admin / OWN';
    }

    if (screen === 'USER') {
      return `ARTY V.2 — ${session.role ?? 'Workspace'}`;
    }

    return 'ARTY V.2 — Dashboard';
  }, [screen, session.role]);

  const handleAuthenticated = (nextSession: AuthSession) => {
    setSession(nextSession);
    setScreen(nextSession.role === 'ADMIN' ? 'ADMIN' : 'USER');
  };

  const handleOpenWorkspace = (role: UserRole) => {
    setSession({
      role,
      username: `admin-preview-${role.toLowerCase()}`,
      enabled: true,
    });
    setScreen('USER');
  };

  const handleAccountsChanged = (nextAccounts: MockUserAccount[]) => {
    setAccounts(nextAccounts);

    const currentAccount = nextAccounts.find((account) => account.username === session.username && account.role === session.role);

    if (session.role && (!currentAccount || !currentAccount.enabled)) {
      setSession(defaultSession);
      setScreen('DASHBOARD');
    }
  };

  const handleLogout = () => {
    setSession(defaultSession);
    setScreen('DASHBOARD');
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  };

  return (
    <SharedOperationalProvider>
      <main className="application-frame">
        <header className="topbar" aria-label="application-topbar">
          <div>
            <p className="route-kicker">ARTY V.2</p>
            <h1>{title}</h1>
          </div>

          <div className="topbar__actions">
            <button type="button" className="ghost-button" onClick={() => setScreen('DASHBOARD')}>
              Dashboard
            </button>

            {session.role === 'ADMIN' ? (
              <button type="button" className="ghost-button" onClick={() => setScreen('ADMIN')}>
                Admin / OWN
              </button>
            ) : null}

            {session.role && session.role !== 'ADMIN' ? (
              <button type="button" className="ghost-button" onClick={() => setScreen('USER')}>
                Workspace
              </button>
            ) : null}

            {session.role ? (
              <button type="button" className="primary-button" onClick={handleLogout}>
                Logout
              </button>
            ) : null}
          </div>
        </header>

        {screen === 'DASHBOARD' ? (
          <DashboardPage accounts={accounts} session={session} onAuthenticated={handleAuthenticated} />
        ) : null}

        {screen === 'ADMIN' ? (
          <AdminOwnPage
            accounts={accounts}
            session={session}
            onAccountsChanged={handleAccountsChanged}
            onOpenWorkspace={handleOpenWorkspace}
          />
        ) : null}

        {screen === 'USER' ? (
          <UserWorkspacePage session={session} onBackToDashboard={() => setScreen('DASHBOARD')} />
        ) : null}
      </main>
    </SharedOperationalProvider>
  );
}
