export type UserRole = 'ADMIN' | 'FO' | 'FDC' | 'SURVEILLANCE' | 'HOWITZER' | 'WEAPONS';

export type PanelKey =
  | 'FO'
  | 'FDC'
  | 'SURVEILLANCE'
  | 'HOWITZER'
  | 'WEAPONS'
  | 'MAP'
  | 'DOCUMENT';

export interface AuthSession {
  role: UserRole | null;
  username: string | null;
  enabled: boolean;
}
