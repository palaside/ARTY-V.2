import { useEffect, useMemo, useState } from 'react';
import type { AuthSession, UserRole } from './auth/auth-types';
import { defaultSession } from './auth/auth-state';
import { AdminOwnPage } from './routes/AdminOwnPage';
import { DashboardPage } from './routes/DashboardPage';
import { UserWorkspacePage } from './routes/UserWorkspacePage';

type Screen = 'DASHBOARD' | 'ADMIN' | 'USER';

type PersistedAppState = {
  screen: Screen;
  session: AuthSession;
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

export function App() {
  const persistedState = useMemo(() => readPersistedState(), []);
  const [screen, setScreen] = useState<Screen>(persistedState?.screen ?? 'DASHBOARD');
  const [session, setSession] = useState<AuthSession>(persistedState?.session ?? defaultSession);

  useEffect(() => {
    globalThis.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        screen,
        session,
      } satisfies PersistedAppState),
    );
  }, [screen, session]);

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

  const handleLogout = () => {
    setSession(defaultSession);
    setScreen('DASHBOARD');
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  };

  return (
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
        <DashboardPage session={session} onAuthenticated={handleAuthenticated} />
      ) : null}

      {screen === 'ADMIN' ? (
        <AdminOwnPage session={session} onOpenWorkspace={handleOpenWorkspace} />
      ) : null}

      {screen === 'USER' ? (
        <UserWorkspacePage session={session} onBackToDashboard={() => setScreen('DASHBOARD')} />
      ) : null}
    </main>
  );
}
