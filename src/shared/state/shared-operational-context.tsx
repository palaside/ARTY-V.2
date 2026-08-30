import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ActiveTarget } from './target-store';
import { createDocumentStore } from './document-store';
import { createMapStore } from './map-store';
import { createMissionStore } from './mission-store';
import { createSafetyStore } from './safety-store';
import { createTargetStore } from './target-store';
import type { UserRole } from '@/app/auth/auth-types';
import { formatDocumentLabel } from '@/shared/labels';

export type DocumentKey = 'FORM_344_201' | 'FORM_344_202' | 'DEPUTY_REPORT' | 'COUNTER_BATTERY';

type MissionStatus = 'idle' | 'active' | 'complete';
type FireMissionStatus = 'no_target' | 'target_ready' | 'fire_solution_review' | 'fire_locked' | 'complete';
type OperationalSource = UserRole | 'SYSTEM';

export type EventLogEntry = {
  id: string;
  source: OperationalSource;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  createdAt: string;
};

export type ReportQueueItem = {
  id: string;
  document: DocumentKey;
  source: UserRole;
  status: 'queued' | 'preview';
};

type SharedOperationalContextValue = {
  missionId: string | null;
  missionStatus: MissionStatus;
  fireMissionStatus: FireMissionStatus;
  activeTarget: ActiveTarget | null;
  minQeLocked: boolean;
  fireLocked: boolean;
  openDocument: DocumentKey | null;
  eventLog: EventLogEntry[];
  reportQueue: ReportQueueItem[];
  mapZoom: number;
  roleView: UserRole;
  activateMission: (missionId: string, source?: OperationalSource) => void;
  completeMission: (source?: OperationalSource) => void;
  setActiveTarget: (target: ActiveTarget, source?: OperationalSource) => void;
  clearTarget: (source?: OperationalSource) => void;
  setFireLocked: (locked: boolean) => void;
  setMinQeLocked: (locked: boolean) => void;
  setOpenDocument: (document: DocumentKey | null) => void;
  queueReport: (document: DocumentKey, source: UserRole) => void;
  addEvent: (source: EventLogEntry['source'], message: string, severity?: EventLogEntry['severity']) => void;
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
  const [fireMissionStatus, setFireMissionStatus] = useState<FireMissionStatus>('no_target');
  const [activeTarget, setActiveTargetState] = useState<ActiveTarget | null>(targetStore.activeTarget);
  const [minQeLocked, setMinQeLockedState] = useState<boolean>(safetyStore.minQeLocked);
  const [fireLocked, setFireLockedState] = useState<boolean>(safetyStore.fireLocked);
  const [openDocument, setOpenDocumentState] = useState<DocumentKey | null>(documentStore.openDocument as DocumentKey | null);
  const [eventLog, setEventLog] = useState<EventLogEntry[]>([]);
  const [reportQueue, setReportQueue] = useState<ReportQueueItem[]>([]);
  const [roleView, setRoleViewState] = useState<UserRole>(mapStore.roleView as UserRole);
  const [mapZoom, setMapZoomState] = useState<number>(mapStore.zoom);

  const value = useMemo<SharedOperationalContextValue>(
    () => ({
      missionId,
      missionStatus,
      fireMissionStatus,
      activeTarget,
      minQeLocked,
      fireLocked,
      openDocument,
      eventLog,
      reportQueue,
      roleView,
      mapZoom,
      activateMission: (nextMissionId: string, source = 'SYSTEM') => {
        setMissionId(nextMissionId);
        setMissionStatus('active');
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message: `ภารกิจ ${nextMissionId} เปิดใช้งานแล้ว`,
            severity: 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      completeMission: (source = 'SYSTEM') => {
        setMissionStatus('complete');
        setFireMissionStatus('complete');
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message: 'ภารกิจยิงเสร็จสิ้นแล้ว',
            severity: 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      setActiveTarget: (target: ActiveTarget, source = 'SYSTEM') => {
        setActiveTargetState(target);
        setFireMissionStatus('target_ready');
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message: `ยืนยันเป้าหมาย ${target.id} เข้าสู่ข้อมูลเป้าหมายร่วม`,
            severity: 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      clearTarget: (source = 'SYSTEM') => {
        setActiveTargetState(null);
        setFireMissionStatus('no_target');
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message: 'ล้างเป้าหมายร่วมแล้ว',
            severity: 'WARNING',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      setFireLocked: (locked: boolean) => {
        setFireLockedState(locked);
        setFireMissionStatus(locked ? 'fire_locked' : activeTarget ? 'fire_solution_review' : 'no_target');
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source: 'FDC',
            message: locked ? 'ล็อกการยิงโดยประตูความปลอดภัย' : 'ปลดล็อกการยิงเพื่อทบทวน',
            severity: locked ? 'CRITICAL' : 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      setMinQeLocked: (locked: boolean) => {
        setMinQeLockedState(locked);
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source: 'FDC',
            message: locked ? 'อินเตอร์ล็อก Min QE ทำงานอยู่' : 'อินเตอร์ล็อก Min QE ปลดแล้ว',
            severity: locked ? 'WARNING' : 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      setOpenDocument: (document: DocumentKey | null) => {
        setOpenDocumentState(document);
      },
      queueReport: (document: DocumentKey, source: UserRole) => {
        setOpenDocumentState(document);
        setReportQueue((items) => [
          {
            id: `RPT-${Date.now()}-${items.length + 1}`,
            document,
            source,
            status: 'queued',
          },
          ...items,
        ]);
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message: `เอกสาร ${formatDocumentLabel(document)} เข้าคิวสำหรับพรีวิว/ส่งออก`,
            severity: 'INFO',
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      addEvent: (source: EventLogEntry['source'], message: string, severity = 'INFO') => {
        setEventLog((entries) => [
          {
            id: `EVT-${Date.now()}-${entries.length + 1}`,
            source,
            message,
            severity,
            createdAt: new Date().toLocaleTimeString('th-TH'),
          },
          ...entries,
        ]);
      },
      setRoleView: (role: UserRole) => {
        setRoleViewState(role);
      },
      setMapZoom: (zoom: number) => {
        setMapZoomState(zoom);
      },
    }),
    [
      activeTarget,
      eventLog,
      fireLocked,
      fireMissionStatus,
      mapZoom,
      minQeLocked,
      missionId,
      missionStatus,
      openDocument,
      reportQueue,
      roleView,
    ],
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
