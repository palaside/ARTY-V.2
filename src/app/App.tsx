import { DashboardPage } from './routes/DashboardPage';
import { AdminOwnPage } from './routes/AdminOwnPage';
import { UserWorkspacePage } from './routes/UserWorkspacePage';

export function App() {
  return (
    <main className="app-shell">
      <DashboardPage />
      <AdminOwnPage />
      <UserWorkspacePage />
    </main>
  );
}
