import type { AuthSession, UserRole } from './auth-types';

export type MockUserAccount = {
  username: string;
  password: string;
  role: UserRole;
  enabled: boolean;
  label: string;
};

export const mockAccounts: MockUserAccount[] = [
  { username: 'owner', password: 'owner', role: 'ADMIN', enabled: true, label: 'Admin / OWN' },
  { username: 'fo', password: 'fo', role: 'FO', enabled: true, label: 'Forward Observer' },
  { username: 'fdc', password: 'fdc', role: 'FDC', enabled: true, label: 'Fire Direction Center' },
  { username: 'survey', password: 'survey', role: 'SURVEILLANCE', enabled: true, label: 'Surveillance' },
  { username: 'howitzer', password: 'howitzer', role: 'HOWITZER', enabled: true, label: 'Howitzer Section' },
  { username: 'weapons', password: 'weapons', role: 'WEAPONS', enabled: true, label: 'Weapons / Ammunition' },
];

export const defaultSession: AuthSession = {
  role: null,
  username: null,
  enabled: false,
};

export function authenticate(username: string, password: string, requestedRole: UserRole): AuthSession | null {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const account = mockAccounts.find(
    (entry) =>
      entry.username === normalizedUsername &&
      entry.password === normalizedPassword &&
      entry.role === requestedRole,
  );

  if (!account || !account.enabled) {
    return null;
  }

  return {
    role: account.role,
    username: account.username,
    enabled: true,
  };
}
