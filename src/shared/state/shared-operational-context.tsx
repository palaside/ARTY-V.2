import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ActiveTarget } from './target-store';
import { createDocumentStore } from './document-store';
import { createMapStore } from './map-store';
import { createMissionStore } from './mission-store';
import { createSafetyStore } from './safety-store';
import { createTargetStore } from './target-store';
import type { UserRole } from '@/app/auth/auth-types';

export type DocumentKey = 'FORM_344_201' | 'FORM_344_202' | 'DEPUTY_REPORT' | 'COUNTER_BATTERY';

type MissionStatus = 'idle' | 'active' | 'complete';

type SharedOperationalContextValue = {
  missionId: string | null;
  missionStatus: MissionStatus;
  activeTarget: ActiveTarget | null;
  minQeLocked: boolean;
  fireLocked: boolean;
  openDocument: DocumentKey | null;
  mapZoom: number;
  roleView: UserRole;
  activateMission: (missionId: string) => void;
  completeMission: () => void;
  setActiveTarget: (target: ActiveTarget) => void;
  clearTarget: () => void;
  setFireLocked: (locked: boolean) => void;
  setMinQeLocked: (locked: boolean) => void;
  setOpenDocument: (document: DocumentKey | null) => void;
  setRoleView: (role: UserRole) => void;
  setMapZoom: (zoom: number) => void;
};

const SharedOperationalContext = createContext<SharedOperationalContextValue | null>(null);

export function SharedOperationalProvider({ children }: { children: ReactNode }) {
  const missionStore = useMemo(() => createMissionStore(), []);
  const targetStore = useMemo(() => createTargetStore(), []);
  const safetyStore = useMemo(() => createSafetyStore(), []);
  const documentStore = useMemo(() => createDocumentStore(), []);
  const mapStore = useMemo(() => createMapStore(), []);

  const [missionId, setMissionId] = useState<string | null>(missionStore.missionId);
  const [missionStatus, setMissionStatus] = useState<MissionStatus>(missionStore.status);
  const [activeTarget, setActiveTargetState] = useState<ActiveTarget | null>(targetStore.activeTarget);
  const [minQeLocked, setMinQeLockedState] = useState<boolean>(safetyStore.minQeLocked);
  const [fireLocked, setFireLockedState] = useState<boolean>(safetyStore.fireLocked);
  const [openDocument, setOpenDocumentState] = useState<DocumentKey | null>(documentStore.openDocument as DocumentKey | null);
  const [roleView, setRoleViewState] = useState<UserRole>(mapStore.roleView as UserRole);
  const [mapZoom, setMapZoomState] = useState<number>(mapStore.zoom);

  const value = useMemo<SharedOperationalContextValue>(
    () => ({
      missionId,
      missionStatus,
      activeTarget,
      minQeLocked,
      fireLocked,
      openDocument,
      roleView,
      mapZoom,
      activateMission: (nextMissionId: string) => {
        setMissionId(nextMissionId);
        setMissionStatus('active');
      },
      completeMission: () => {
        setMissionStatus('complete');
      },
      setActiveTarget: (target: ActiveTarget) => {
        setActiveTargetState(target);
      },
      clearTarget: () => {
        setActiveTargetState(null);
      },
      setFireLocked: (locked: boolean) => {
        setFireLockedState(locked);
      },
      setMinQeLocked: (locked: boolean) => {
        setMinQeLockedState(locked);
      },
      setOpenDocument: (document: DocumentKey | null) => {
        setOpenDocumentState(document);
      },
      setRoleView: (role: UserRole) => {
        setRoleViewState(role);
      },
      setMapZoom: (zoom: number) => {
        setMapZoomState(zoom);
      },
    }),
    [activeTarget, fireLocked, mapZoom, minQeLocked, missionId, missionStatus, openDocument, roleView],
  );

  return <SharedOperationalContext.Provider value={value}>{children}</SharedOperationalContext.Provider>;
}

export function useSharedOperationalState() {
  const context = useContext(SharedOperationalContext);

  if (!context) {
    throw new Error('useSharedOperationalState must be used within SharedOperationalProvider');
  }

  return context;
}
