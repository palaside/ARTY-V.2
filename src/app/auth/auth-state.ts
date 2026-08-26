import type { AuthSession, UserRole } from './auth-types';

export type MockUserAccount = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  enabled: boolean;
  label: string;
};

export const defaultAccounts: MockUserAccount[] = [
  { id: 'acct-admin-owner', username: 'owner', password: 'owner', role: 'ADMIN', enabled: true, label: 'Admin / OWN' },
  { id: 'acct-fo', username: 'fo', password: 'fo', role: 'FO', enabled: true, label: 'ผู้ตรวจการณ์หน้า' },
  { id: 'acct-fdc', username: 'fdc', password: 'fdc', role: 'FDC', enabled: true, label: 'FDC / Decision Core' },
  { id: 'acct-surveillance', username: 'survey', password: 'survey', role: 'SURVEILLANCE', enabled: true, label: 'Surveillance' },
  { id: 'acct-howitzer', username: 'howitzer', password: 'howitzer', role: 'HOWITZER', enabled: true, label: 'ส่วนยิง' },
  { id: 'acct-weapons', username: 'weapons', password: 'weapons', role: 'WEAPONS', enabled: true, label: 'กระสุน' },
];

export const defaultSession: AuthSession = {
  role: null,
  username: null,
  enabled: false,
};

export function authenticate(
  accounts: MockUserAccount[],
  username: string,
  password: string,
  requestedRole: UserRole,
): AuthSession | null {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const account = accounts.find(
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
