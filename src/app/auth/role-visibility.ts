import type { PanelKey, UserRole } from './auth-types';

const visibilityMatrix: Record<UserRole, PanelKey[]> = {
  ADMIN: ['FO', 'FDC', 'SURVEILLANCE', 'HOWITZER', 'WEAPONS', 'MAP', 'DOCUMENT'],
  FO: ['FO', 'MAP'],
  FDC: ['FO', 'FDC', 'MAP', 'DOCUMENT'],
  SURVEILLANCE: ['SURVEILLANCE', 'MAP', 'DOCUMENT'],
  HOWITZER: ['HOWITZER', 'MAP', 'DOCUMENT'],
  WEAPONS: ['WEAPONS', 'DOCUMENT'],
};

export const panelOrder: PanelKey[] = ['FO', 'FDC', 'SURVEILLANCE', 'HOWITZER', 'WEAPONS', 'MAP', 'DOCUMENT'];

export function canViewPanel(role: UserRole, panel: PanelKey): boolean {
  return visibilityMatrix[role].includes(panel);
}
