import { useEffect, useState } from 'react';
import type { PanelKey, UserRole } from '../auth/auth-types';
import { canViewPanel, filterVisibleEvents, panelOrder } from '../auth/role-visibility';
import { FdcWorkspace } from '@/domains/fdc/FdcWorkspace';
import { FoWorkspace } from '@/domains/fo/FoWorkspace';
import { CounterBatteryDocument } from '@/domains/howitzer/documents/CounterBatteryDocument';
import { DeputyCommanderReportDocument } from '@/domains/howitzer/documents/DeputyCommanderReportDocument';
import { HowitzerWorkspace } from '@/domains/howitzer/HowitzerWorkspace';
import { Form344201Document } from '@/domains/surveillance/documents/Form344201Document';
import { Form344202Document } from '@/domains/surveillance/documents/Form344202Document';
import { useSharedOperationalState, type DocumentKey } from '@/shared/state/shared-operational-context';
import sharedMapGridReference from '../../../references/shared-map-grid.png';

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
  const {
    activeTarget,
    eventLog,
    fireLocked,
    fireMissionStatus,
    mapZoom,
    missionId,
    openDocument,
    reportQueue,
    roleView,
    setMapZoom,
    setOpenDocument,
    setRoleView,
  } = useSharedOperationalState();
  const [activePanel, setActivePanel] = useState<PanelKey>(() => readInitialPanel(role, visiblePanels));
  const visibleEvents = filterVisibleEvents(role, eventLog);
  const latestVisibleEvent = visibleEvents[0];

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

  const mapScopeLabel =
    role === 'FO'
      ? 'FO / RESTRICTED'
      : role === 'FDC'
        ? 'FDC / DECISION CORE'
        : role === 'ADMIN'
          ? 'ADMIN / FULL VIEW'
          : 'ROLE / SEGMENTED VIEW';

  const visibleLayers =
    role === 'FO'
      ? ['Observer Point', 'Active Target']
      : visibleMapLayers();

  const renderSharedMapPanel = () => (
    <div className="workspace-intro workspace-intro--map">
      <header>Shared Tactical Map</header>
      {role === 'FO' ? (
        <p>FO เห็นเฉพาะข้อมูลที่จำเป็นต่อการสังเกตการณ์และ target acquisition ไม่เห็นตำแหน่งหมวดอื่นตามกฎ OPSEC</p>
      ) : (
        <p>Shared map engine เดียวกัน แต่เปิดเผยข้อมูลตามสิทธิ์ role และ cross-domain workflow</p>
      )}
      <figure className="shared-map-frame" aria-label="shared-tactical-map-reference">
        <div className="shared-map-rail shared-map-rail--top" aria-hidden="true">
          <span>NORTH / 000</span>
          <span>SECTOR / SHARED-01</span>
          <span>FRAME / GRID-LOCK</span>
        </div>
        <img src={sharedMapGridReference} alt="Shared tactical map reference image" className="shared-map-image" />
        <div className="shared-map-overlay" aria-hidden="true">
          <span className="shared-map-crosshair shared-map-crosshair--vertical" />
          <span className="shared-map-crosshair shared-map-crosshair--horizontal" />
          <span className="shared-map-core" />
          <span className="shared-map-label shared-map-label--left">SHARED TACTICAL MAP</span>
          <span className="shared-map-label shared-map-label--bottom">Common tactical view for authorized roles only</span>
        </div>
        <figcaption className="shared-map-caption">
          <span className="route-kicker">Map Reference</span>
          <strong>{mapScopeLabel}</strong>
          <span>{role === 'FO' ? 'Hidden operational detail / public-safe view only' : 'Shared tactical layer preview'}</span>
        </figcaption>
      </figure>
      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">Scope</span>
          <strong>{mapScopeLabel}</strong>
          <p>{role === 'FO' ? 'Restricted observer view' : 'Shared layer with segmented disclosure'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Latest Event</span>
          <strong>{latestVisibleEvent?.severity ?? 'NONE'}</strong>
          <p>{latestVisibleEvent?.message ?? 'No visible shared event yet'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">Readout</span>
          <strong>{role === 'FO' ? 'FO / MAP ONLY' : 'AUTHORIZED READOUT'}</strong>
          <p>{role === 'FO' ? 'Observer + target context only' : 'Mission / target / safety context available'}</p>
        </div>
      </div>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">Role View</span>
          <strong>{roleView}</strong>
          <p>{role === 'FO' ? 'Restricted observer view' : 'Shared engine / segmented visibility'}</p>
        </div>
        {role !== 'FO' ? (
          <>
            <div className="status-tile">
              <span className="route-kicker">Mission</span>
              <strong>{missionId ?? 'No Mission'}</strong>
              <p>{fireMissionStatus}</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">Target Layer</span>
              <strong>{activeTarget?.id ?? 'No Target'}</strong>
              <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'Waiting for shared target'}</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">Safety Layer</span>
              <strong>{fireLocked ? 'LOCKED' : 'READY'}</strong>
              <p>Safety state visible to authorized roles</p>
            </div>
          </>
        ) : (
          <div className="status-tile">
            <span className="route-kicker">Target Layer</span>
            <strong>{activeTarget?.id ?? 'No Target'}</strong>
            <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'Waiting for shared target'}</p>
          </div>
        )}
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
      <div className="map-layer-list">
        {visibleLayers.map((layer) => (
          <span key={layer} className="pill pill--success">
            {layer}
          </span>
        ))}
      </div>
    </div>
  );

  const renderSplitWorkspace = () => {
    const foMode = role === 'FO' || role === 'FDC' || role === 'ADMIN' ? 'full' : 'preview';
    const fdcMode = role === 'FO' ? 'restricted' : 'full';

    return (
      <div className="workspace-split" aria-label="fo-fdc-split-workspace">
        <div className="workspace-split__rail" aria-hidden="true">
          <span>FO WORKSPACE / RESTRICTED</span>
          <span>SHARED STATE / MAP</span>
          <span>FDC WORKSPACE / DECISION CORE</span>
        </div>
        <div className="workspace-split__panel workspace-split__panel--fo">
          <FoWorkspace mode={foMode} />
        </div>
        <div className="workspace-split__center">{renderSharedMapPanel()}</div>
        <div className={`workspace-split__panel workspace-split__panel--fdc${fdcMode === 'restricted' ? ' is-restricted' : ''}`}>
          {fdcMode === 'restricted' ? (
            <div className="workspace-lock-card" aria-label="fdc-workspace-restricted">
              <span className="route-kicker">FDC</span>
              <h3>Fire Direction Center Workspace</h3>
              <p>FO perspective cannot inspect FDC operational details. Shared map stays visible, FDC internals stay hidden.</p>
              <div className="workspace-lock-card__note">ROLE GATE / OPSEC PROTECTED</div>
            </div>
          ) : (
            <FdcWorkspace mode="full" />
          )}
        </div>
      </div>
    );
  };

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

  function visibleMapLayers() {
    if (role === 'FO') return ['Observer Point', 'Active Target', 'Impact Context'];
    if (role === 'FDC') return ['FO Observation', 'Active Target', 'Mission State', 'Safety State'];
    if (role === 'ADMIN') return ['All Operational Domains', 'All Shared Layers', 'All System States'];
    return ['Own Domain Layer', 'Active Target Context', 'Mission Context'];
  }

  const renderPanelBody = () => {
    if (activePanel === 'FO' || activePanel === 'FDC') return renderSplitWorkspace();
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
      return renderSharedMapPanel();
    }

    if (activePanel === 'DOCUMENT') {
      return (
        <div className="document-preview">
          <div className="workspace-readout-grid workspace-readout-grid--document">
            <div className="status-tile">
              <span className="route-kicker">Mode</span>
              <strong>Document View</strong>
              <p>{role === 'FO' ? 'FO document access is limited in this shell' : 'Role-bound preview / print surface'}</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">Queue</span>
              <strong>{reportQueue.length}</strong>
              <p>Queued outputs ready for document workflow</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">Role</span>
              <strong>{role}</strong>
              <p>{role === 'FDC' ? 'Decision core' : role === 'HOWITZER' ? 'Section workflow' : 'Scoped workspace'}</p>
            </div>
          </div>
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
          <div className="event-log-panel">
            <span className="route-kicker">Report Queue</span>
            {reportQueue.length ? (
              reportQueue.slice(0, 3).map((item) => (
                <p key={item.id}>
                  {item.document} — {item.source} — {item.status}
                </p>
              ))
            ) : (
              <p>ยังไม่มีรายการ report queue</p>
            )}
          </div>
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
          <div className="event-log-panel event-log-panel--compact">
            <span className="route-kicker">Shared Event Log</span>
            {visibleEvents.length ? (
              visibleEvents.slice(0, 3).map((entry) => (
                <p key={entry.id}>
                  {entry.createdAt} [{entry.severity}] {entry.source}: {entry.message}
                </p>
              ))
            ) : (
              <p>ยังไม่มี event ใน shared layer</p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}


