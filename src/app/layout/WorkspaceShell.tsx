import { useEffect, useState } from 'react';
import type { PanelKey, UserRole } from '../auth/auth-types';
import { canViewPanel, panelOrder } from '../auth/role-visibility';
import { FdcWorkspace } from '@/domains/fdc/FdcWorkspace';
import { FoWorkspace } from '@/domains/fo/FoWorkspace';
import { CounterBatteryDocument } from '@/domains/howitzer/documents/CounterBatteryDocument';
import { DeputyCommanderReportDocument } from '@/domains/howitzer/documents/DeputyCommanderReportDocument';
import { HowitzerWorkspace } from '@/domains/howitzer/HowitzerWorkspace';
import { Form344201Document } from '@/domains/surveillance/documents/Form344201Document';
import { Form344202Document } from '@/domains/surveillance/documents/Form344202Document';
import { useSharedOperationalState, type DocumentKey } from '@/shared/state/shared-operational-context';

const workspaceStorageKey = (role: UserRole) => `arty-v2-workspace-${role}`;

const panelContent: Record<PanelKey, { title: string; detail?: string }> = {
  FO: { title: 'FO Workspace' },
  FDC: { title: 'FDC Workspace' },
  SURVEILLANCE: { title: 'Surveillance Workspace', detail: 'Survey / Map / ทบ.344 document workflow' },
  HOWITZER: { title: 'Howitzer Workspace' },
  WEAPONS: { title: 'Weapons Workspace', detail: 'Ammo / Fuze / Safety workflow' },
  MAP: { title: 'Shared Map View', detail: 'Shared engine with role-segmented visibility' },
  DOCUMENT: { title: 'Document Mode', detail: 'Preview / print artifacts for real forms' },
};

type WorkspaceShellProps = {
  role: UserRole;
};

function readInitialPanel(role: UserRole, visiblePanels: PanelKey[]): PanelKey {
  const stored = globalThis.localStorage?.getItem(workspaceStorageKey(role));

  if (stored && visiblePanels.includes(stored as PanelKey)) {
    return stored as PanelKey;
  }

  return visiblePanels[0] ?? 'FO';
}

export function WorkspaceShell({ role }: WorkspaceShellProps) {
  const visiblePanels = panelOrder.filter((panel) => canViewPanel(role, panel));
  const { openDocument, roleView, mapZoom, setMapZoom, setOpenDocument, setRoleView } = useSharedOperationalState();
  const [activePanel, setActivePanel] = useState<PanelKey>(() => readInitialPanel(role, visiblePanels));

  useEffect(() => {
    if (!visiblePanels.includes(activePanel)) {
      setActivePanel(visiblePanels[0] ?? 'FO');
    }
  }, [activePanel, visiblePanels]);

  useEffect(() => {
    setRoleView(role);
  }, [role, setRoleView]);

  useEffect(() => {
    globalThis.localStorage?.setItem(workspaceStorageKey(role), activePanel);
  }, [activePanel, role]);

  useEffect(() => {
    if (role === 'SURVEILLANCE' && !openDocument) setOpenDocument('FORM_344_201');
    if (role === 'HOWITZER' && !openDocument) setOpenDocument('DEPUTY_REPORT');
    if (role === 'FDC' && !openDocument) setOpenDocument('DEPUTY_REPORT');
  }, [openDocument, role, setOpenDocument]);

  const renderDocument = () => {
    if (openDocument === 'FORM_344_201') return <Form344201Document />;
    if (openDocument === 'FORM_344_202') return <Form344202Document />;
    if (openDocument === 'COUNTER_BATTERY') return <CounterBatteryDocument />;
    if (openDocument === 'DEPUTY_REPORT') return <DeputyCommanderReportDocument />;
    return <p className="document-note">ยังไม่มีเอกสารที่เลือกใน role นี้</p>;
  };

  const selectDocument = (document: DocumentKey) => {
    setOpenDocument(document);
    setActivePanel('DOCUMENT');
  };

  const renderPanelBody = () => {
    if (activePanel === 'FO') return <FoWorkspace />;
    if (activePanel === 'FDC') return <FdcWorkspace />;
    if (activePanel === 'HOWITZER') return <HowitzerWorkspace />;

    if (activePanel === 'SURVEILLANCE') {
      return (
        <div className="workspace-intro">
          <header>Surveillance</header>
          <p>โดเมนนี้เป็นงานแผนที่/สำรวจ/ระบุพิกัด ไม่ใช่ surveillance-monitoring แบบเฝ้าระวัง</p>
          <ul className="domain-list">
            <li>Grid / Coordinate</li>
            <li>Azimuth / Direction</li>
            <li>Distance / Elevation</li>
            <li>Traverse / Intersection / Validation</li>
          </ul>
          <div className="control-row">
            <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_201')}>
              Open ทบ.344-201
            </button>
            <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_202')}>
              Open ทบ.344-202
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === 'WEAPONS') {
      return (
        <div className="workspace-intro">
          <header>กระสุน</header>
          <p>หมวดนี้เป็นเจ้าของข้อมูลชนิดกระสุน ชนวน compatibility และ safety state ต้นทาง</p>
          <ul className="domain-list">
            <li>Ammunition selection</li>
            <li>Fuze selection / time setting</li>
            <li>Compatibility / safety checks</li>
            <li>Misfire / interlock source state</li>
          </ul>
        </div>
      );
    }

    if (activePanel === 'MAP') {
      return (
        <div className="workspace-intro">
          <header>Shared Tactical Map</header>
          {role === 'FO' ? (
            <p>FO เห็นเฉพาะข้อมูลที่จำเป็นต่อการสังเกตการณ์และ target acquisition ไม่เห็นตำแหน่งหมวดอื่นตามกฎ OPSEC</p>
          ) : (
            <p>Shared map engine เดียวกัน แต่เปิดเผยข้อมูลตามสิทธิ์ role และ cross-domain workflow</p>
          )}
          <div className="shared-status-grid">
            <div className="status-tile">
              <span className="route-kicker">Role View</span>
              <strong>{roleView}</strong>
              <p>Shared engine / segmented visibility</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">Zoom</span>
              <strong>{mapZoom.toFixed(1)}x</strong>
              <div className="control-row control-row--tight">
                <button type="button" className="ghost-button" onClick={() => setMapZoom(Math.max(0.5, mapZoom - 0.5))}>
                  -
                </button>
                <button type="button" className="ghost-button" onClick={() => setMapZoom(mapZoom + 0.5)}>
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activePanel === 'DOCUMENT') {
      return (
        <div className="document-preview">
          <div className="document-switcher">
            {role === 'SURVEILLANCE' ? (
              <>
                <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_201')}>
                  ทบ.344-201
                </button>
                <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_202')}>
                  ทบ.344-202
                </button>
              </>
            ) : null}
            {role === 'HOWITZER' ? (
              <>
                <button type="button" className="ghost-button" onClick={() => selectDocument('DEPUTY_REPORT')}>
                  Report รอง ผบ.ร้อย
                </button>
                <button type="button" className="ghost-button" onClick={() => selectDocument('COUNTER_BATTERY')}>
                  บขตป.
                </button>
              </>
            ) : null}
            {role === 'FDC' ? (
              <button type="button" className="ghost-button" onClick={() => selectDocument('DEPUTY_REPORT')}>
                Linked Report Preview
              </button>
            ) : null}
          </div>
          {role === 'FO' ? <p className="document-note">FO ไม่มีสิทธิ์ preview เอกสารข้ามหมวดใน shell นี้</p> : renderDocument()}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="workspace-layout" aria-label="workspace-shell">
      <aside className="workspace-sidebar">
        <p className="route-kicker">Role</p>
        <h3>{role}</h3>
        <nav className="workspace-nav" aria-label="workspace-navigation">
          {visiblePanels.map((panel) => (
            <button
              key={panel}
              type="button"
              className={`workspace-nav-button${activePanel === panel ? ' workspace-nav-button--active' : ''}`}
              onClick={() => setActivePanel(panel)}
            >
              {panelContent[panel].title}
            </button>
          ))}
        </nav>
      </aside>

      <article className="workspace-stage">
        <div className="workspace-panel-surface">
          {renderPanelBody()}
          <p className="workspace-panel__meta">Visible for role: {role}</p>
        </div>
      </article>
    </div>
  );
}
