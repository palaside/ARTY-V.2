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
import { SurveyTools } from '@/domains/surveillance/SurveyTools';
import { useSharedOperationalState, type DocumentKey } from '@/shared/state/shared-operational-context';
import {
  formatDocumentLabel,
  formatFireMissionStatus,
  formatRoleLabel,
  formatQueueStatus,
  formatSeverityLabel,
} from '@/shared/labels';
import { CapabilityCatalog, type CapabilityItem } from '@/shared/components/CapabilityCatalog';
import { WeaponsWorkspace } from '@/domains/weapons/WeaponsWorkspace';
import sharedMapGridReference from '../../../references/shared-map-grid.png';
import m2Dial from '../../assets/m2/m2-dial.png';
import m2Needle from '../../assets/m2/m2-needle.png';

const workspaceStorageKey = (role: UserRole) => `arty-v2-workspace-${role}`;

const mapCapabilities: CapabilityItem[] = [
  { title: '๑. ระยะลาด → ระยะราบ', description: 'แปลงระยะลาดและมุมดิ่งเป็นระยะราบสำหรับการวางจุดบนแผนที่ฝึก.', state: 'พร้อมแสดงผล' },
  { title: '๒. พิกัดตาราง / พิกัดฉาก UTM', description: 'คำนวณพิกัดตะวันออกและพิกัดเหนือจากสถานีตั้งต้น ระยะราบ และมุมภาคตาราง.', state: 'พร้อมแสดงผล' },
  { title: '๓. ผลต่างทางสูง / ความต่างระดับ', description: 'คำนวณผลต่างระดับจากระยะลาด มุมดิ่ง และความสูงเครื่องมือ/เป้าในชุดข้อมูลฝึก.', state: 'พร้อมแสดงผล' },
  { title: '๔. มุมภาคทิศทาง / มุมภาคตาราง', description: 'แสดงมุมภาคตารางและการตรวจมุมกลับทิศในหน่วยมิลเลียม.', state: 'พร้อมแสดงผล' },
  { title: '๕. การสกัดตรง / การสกัดกลับ', description: 'เลือก workflow จุดตัดจากสถานีทราบที่ตั้ง หรือหาสถานีจากหมุดอ้างอิงในโหมดฝึก.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: '๖. ค่าแก้บรรยากาศ ATM. PPM', description: 'บันทึกอุณหภูมิ ความกดอากาศ และค่า PPM เพื่อคำนวณระยะที่แก้แล้ว.', state: 'พร้อมแสดงผล' },
  { title: '๗. ชั้นความถูกต้องของงานแผนที่', description: 'ตรวจอัตราส่วน closure error ตามชั้นงาน และล็อกชุดข้อมูลเมื่อไม่ผ่านเกณฑ์.', state: 'พร้อมแสดงผล' },
  { title: '๘. การเลื่อนตาราง / การหมุนตาราง', description: 'แสดงผลการเลื่อนแกนและการหมุนตารางจากค่าที่ป้อนในชุดข้อมูลฝึก.', state: 'พร้อมแสดงผล' },
  { title: 'ทบ.344', description: 'ชุดงานคำนวณวงรอบและแบบฟอร์มพิกัดทางทหาร พร้อมพรีวิวเอกสาร ทบ.344-201 และ ทบ.344-202.', state: 'พร้อมแสดงผล' },
  { title: 'เขตความปลอดภัยบนแผนที่', description: 'แสดงชั้นข้อมูลความปลอดภัยตามบทบาทบนแผนที่ร่วม โดยไม่เปิดเผยข้อมูลที่ FO ไม่มีสิทธิ์เห็น.', state: 'พร้อมแสดงผล' },
];

const weaponsCapabilities: CapabilityItem[] = [
  { title: 'แคตาล็อกกระสุนและชนวน', description: 'แสดงรายการชนิดกระสุน ชนวน และข้อมูลอ้างอิงที่หมวดกระสุนเป็นเจ้าของ.', state: 'พร้อมแสดงผล' },
  { title: 'ตรรกะความเข้ากันได้', description: 'แสดงสถานะตรวจสอบชนิดกระสุน ชนวน และข้อจำกัดด้านความปลอดภัย โดยไม่ตั้งค่าหรือควบคุมอาวุธจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
  { title: 'อินเตอร์ล็อกฝ่ายมิตร', description: 'แสดง safety gate จากชั้นข้อมูลร่วมเพื่อใช้ทบทวนในโหมดฝึก.', state: 'พร้อมแสดงผล' },
  { title: 'ขั้นตอนค้างยิงและลำกล้องร้อน', description: 'หน้าจอ SOP และการนับเวลาความปลอดภัยสำหรับการฝึก พร้อมรอการยืนยันข้อความอ้างอิงก่อนใช้งานจริง.', state: 'โหมดฝึก / รอข้อมูลอ้างอิง' },
];

const panelContent: Record<PanelKey, { title: string; detail?: string }> = {
  FO: { title: 'พื้นที่ทำงาน FO' },
  FDC: { title: 'พื้นที่ทำงาน FDC' },
  SURVEILLANCE: { title: 'พื้นที่ทำงานแผนที่ / สำรวจ', detail: 'งานสำรวจ แผนที่ และเอกสาร ทบ.344' },
  HOWITZER: { title: 'พื้นที่ทำงานส่วนยิง' },
  WEAPONS: { title: 'พื้นที่ทำงานกระสุน', detail: 'กระสุน ชนวน และความปลอดภัย' },
  MAP: { title: 'มุมมองแผนที่ร่วม', detail: 'แกนร่วมเดียวแต่แสดงผลตามบทบาท' },
  DOCUMENT: { title: 'โหมดเอกสาร', detail: 'พรีวิวและพิมพ์เอกสารจริง' },
};

type EventSource = UserRole | 'SYSTEM';

function formatEventSource(source: EventSource) {
  return source === 'SYSTEM' ? 'ระบบ' : formatRoleLabel(source);
}

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
  const [compassOpen, setCompassOpen] = useState(false);
  const [magneticHeading, setMagneticHeading] = useState<number | null>(null);
  const [magneticPitch, setMagneticPitch] = useState<number | null>(null);
  const [friendlyRadius, setFriendlyRadius] = useState(18);
  const [fragmentRadius, setFragmentRadius] = useState(9);
  const visibleEvents = filterVisibleEvents(role, eventLog);
  const latestVisibleEvent = visibleEvents[0];

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent & { webkitCompassHeading?: number }) => {
      const heading = typeof event.webkitCompassHeading === 'number'
        ? event.webkitCompassHeading
        : typeof event.alpha === 'number'
          ? (360 - event.alpha) % 360
          : null;
      if (heading !== null && Number.isFinite(heading)) setMagneticHeading(heading);
      if (typeof event.beta === 'number' && Number.isFinite(event.beta)) setMagneticPitch(event.beta);
    };

    window.addEventListener('deviceorientation', handleOrientation as EventListener);
    return () => window.removeEventListener('deviceorientation', handleOrientation as EventListener);
  }, []);

  const openCompass = async () => {
    const orientationApi = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (typeof orientationApi.requestPermission === 'function') {
      try {
        await orientationApi.requestPermission();
      } catch {
        setMagneticHeading(null);
      }
    }

    setCompassOpen(true);
  };

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
      ? 'ผู้ตรวจการณ์หน้า / จำกัดการมองเห็น'
      : role === 'FDC'
        ? 'ศูนย์ตัดสินใจ / มุมมองร่วม'
        : role === 'ADMIN'
          ? 'ผู้ดูแลระบบ / มุมมองเต็ม'
          : 'มุมมองตามบทบาท';

  const visibleLayers =
    role === 'FO'
      ? ['จุดสังเกตการณ์', 'เป้าหมายที่ใช้งาน']
      : visibleMapLayers();

  const renderSharedMapPanel = () => (
    <div className="workspace-intro workspace-intro--map">
      <header>แผนที่ยุทธวิธีร่วม</header>
      {role === 'FO' ? (
        <p>ผู้ตรวจการณ์หน้าเห็นเฉพาะข้อมูลที่จำเป็นต่อการสังเกตการณ์และการระบุเป้าหมาย ไม่เห็นตำแหน่งหมวดอื่นตามกฎ OPSEC</p>
      ) : (
        <p>แกนแผนที่ร่วมตัวเดียว แต่เปิดเผยข้อมูลตามสิทธิ์บทบาทและการทำงานข้ามหมวด</p>
      )}
      <figure className="shared-map-frame" aria-label="shared-tactical-map-reference">
        <div className="shared-map-rail shared-map-rail--top" aria-hidden="true">
          <span>ทิศเหนือ / 000</span>
          <span>เซกเตอร์ / ร่วม-01</span>
          <span>เฟรม / ล็อกกริด</span>
        </div>
        <img src={sharedMapGridReference} alt="ภาพอ้างอิงแผนที่ยุทธวิธีร่วม" className="shared-map-image" />
        <div className="shared-map-overlay" aria-hidden="true">
          <span className="shared-map-crosshair shared-map-crosshair--vertical" />
          <span className="shared-map-crosshair shared-map-crosshair--horizontal" />
          <span className="shared-map-core" />
          <span className="shared-map-label shared-map-label--left">แผนที่ยุทธวิธีร่วม</span>
          <span className="shared-map-label shared-map-label--bottom">มุมมองยุทธวิธีร่วมสำหรับผู้มีสิทธิ์เท่านั้น</span>
          <span className="shared-map-safety-zone shared-map-safety-zone--friendly" style={{ width: `${friendlyRadius * 4}px`, height: `${friendlyRadius * 4}px` }} />
          <span className="shared-map-safety-zone shared-map-safety-zone--fragment" style={{ width: `${fragmentRadius * 4}px`, height: `${fragmentRadius * 4}px` }} />
        </div>
        <figcaption className="shared-map-caption">
          <span className="route-kicker">อ้างอิงแผนที่</span>
          <strong>{mapScopeLabel}</strong>
          <span>{role === 'FO' ? 'ปกปิดรายละเอียดปฏิบัติการ / มุมมองปลอดภัยสำหรับสาธารณะ' : 'ตัวอย่างชั้นยุทธวิธีร่วม'}</span>
        </figcaption>
      </figure>
      <div className="shared-map-zone-controls" aria-label="วงกลมเขตความปลอดภัยแบบฝึก">
        <label>เขตปลอดภัยฝ่ายเรา ({friendlyRadius} ม.)<input type="range" min="6" max="30" value={friendlyRadius} onChange={(event) => setFriendlyRadius(Number(event.target.value))} /></label>
        <label>รัศมีสะเก็ดแบบฝึก ({fragmentRadius} ม.)<input type="range" min="3" max="20" value={fragmentRadius} onChange={(event) => setFragmentRadius(Number(event.target.value))} /></label>
      </div>
      <div className="workspace-readout-grid">
        <div className="status-tile">
          <span className="route-kicker">ขอบเขต</span>
          <strong>{mapScopeLabel}</strong>
          <p>{role === 'FO' ? 'มุมมองผู้สังเกตการณ์แบบจำกัด' : 'ชั้นร่วมที่เปิดเผยแบบแบ่งระดับ'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">เหตุการณ์ล่าสุด</span>
          <strong>{latestVisibleEvent ? formatSeverityLabel(latestVisibleEvent.severity) : 'ไม่มี'}</strong>
          <p>{latestVisibleEvent?.message ?? 'ยังไม่มีเหตุการณ์ร่วมที่มองเห็นได้'}</p>
        </div>
        <div className="status-tile">
          <span className="route-kicker">สรุปสถานะ</span>
          <strong>{role === 'FO' ? 'ผู้ตรวจการณ์หน้า / เฉพาะแผนที่' : 'สรุปสถานะที่อนุญาต'}</strong>
          <p>{role === 'FO' ? 'เฉพาะบริบทผู้สังเกตการณ์และเป้าหมาย' : 'ดูบริบทภารกิจ เป้าหมาย และความปลอดภัยได้'}</p>
        </div>
      </div>
      <div className="shared-status-grid">
        <div className="status-tile">
          <span className="route-kicker">มุมมองตามบทบาท</span>
          <strong>{formatRoleLabel(roleView)}</strong>
          <p>{role === 'FO' ? 'มุมมองผู้สังเกตการณ์แบบจำกัด' : 'แกนร่วมเดียวแต่แสดงผลแบบแบ่งระดับ'}</p>
        </div>
        {role !== 'FO' ? (
          <>
            <div className="status-tile">
              <span className="route-kicker">ภารกิจ</span>
              <strong>{missionId ?? 'ไม่มีภารกิจ'}</strong>
              <p>{formatFireMissionStatus(fireMissionStatus)}</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">ชั้นเป้าหมาย</span>
              <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
              <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'รอเป้าหมายร่วม'}</p>
            </div>
            <div className="status-tile">
              <span className="route-kicker">ชั้นความปลอดภัย</span>
              <strong>{fireLocked ? 'ล็อก' : 'พร้อม'}</strong>
              <p>สถานะความปลอดภัยแสดงให้เฉพาะบทบาทที่อนุญาต</p>
            </div>
          </>
        ) : (
          <div className="status-tile">
            <span className="route-kicker">ชั้นเป้าหมาย</span>
            <strong>{activeTarget?.id ?? 'ไม่มีเป้าหมาย'}</strong>
            <p>{activeTarget ? `${activeTarget.easting} / ${activeTarget.northing}` : 'รอเป้าหมายร่วม'}</p>
          </div>
        )}
        <div className="status-tile">
          <span className="route-kicker">ซูม</span>
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
          <span>พื้นที่ทำงานผู้ตรวจการณ์หน้า / จำกัด</span>
          <span>สถานะร่วม / แผนที่</span>
          <span>พื้นที่ทำงานศูนย์ตัดสินใจ / แกนตัดสินใจ</span>
        </div>
        <div className="workspace-split__panel workspace-split__panel--fo">
          <FoWorkspace mode={foMode} />
        </div>
        <div className="workspace-split__center">{renderSharedMapPanel()}</div>
        <div className={`workspace-split__panel workspace-split__panel--fdc${fdcMode === 'restricted' ? ' is-restricted' : ''}`}>
          {fdcMode === 'restricted' ? (
            <div className="workspace-lock-card" aria-label="fdc-workspace-restricted">
              <span className="route-kicker">FDC</span>
              <h3>พื้นที่ทำงานศูนย์อำนวยการยิง</h3>
              <p>มุมมองของ FO ไม่สามารถตรวจรายละเอียดการทำงานภายใน FDC ได้ แผนที่ร่วมยังมองเห็นได้ แต่รายละเอียดภายใน FDC ถูกปกปิด</p>
              <div className="workspace-lock-card__note">ประตูบทบาท / ป้องกันตาม OPSEC</div>
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
    return <p className="document-note">ยังไม่มีเอกสารที่เลือกในบทบาทนี้</p>;
  };

  const selectDocument = (document: DocumentKey) => {
    setOpenDocument(document);
    setActivePanel('DOCUMENT');
  };

  function visibleMapLayers() {
    if (role === 'FO') return ['จุดสังเกตการณ์', 'เป้าหมายที่ใช้งาน', 'บริบทจุดตกกระทบ'];
    if (role === 'FDC') return ['การสังเกตของ FO', 'เป้าหมายที่ใช้งาน', 'สถานะภารกิจ', 'สถานะความปลอดภัย'];
    if (role === 'ADMIN') return ['ทุกโดเมนปฏิบัติการ', 'ทุกชั้นร่วม', 'ทุกสถานะระบบ'];
    return ['ชั้นโดเมนของตนเอง', 'บริบทเป้าหมายที่ใช้งาน', 'บริบทภารกิจ'];
  }

  const renderPanelBody = () => {
    if (activePanel === 'FO' || activePanel === 'FDC') return renderSplitWorkspace();
    if (activePanel === 'HOWITZER') return <HowitzerWorkspace />;

    if (activePanel === 'SURVEILLANCE') {
      return (
        <div className="workspace-intro">
          <header>แผนที่ / สำรวจ</header>
          <p>โดเมนนี้เป็นงานแผนที่/สำรวจ/ระบุพิกัด ไม่ใช่งานเฝ้าระวังหรือสอดส่อง</p>
          <SurveyTools />
          <CapabilityCatalog title="งานแผนที่และสำรวจ" items={mapCapabilities} />
          <div className="control-row">
            <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_201')}>
              เปิด ทบ.344-201
            </button>
            <button type="button" className="ghost-button" onClick={() => selectDocument('FORM_344_202')}>
              เปิด ทบ.344-202
            </button>
          </div>
        </div>
      );
    }

    if (activePanel === 'WEAPONS') {
      return <WeaponsWorkspace />;
    }

    if (activePanel === 'MAP') {
      return renderSharedMapPanel();
    }

    if (activePanel === 'DOCUMENT') {
      return (
        <div className="document-preview">
        <div className="workspace-readout-grid workspace-readout-grid--document">
          <div className="status-tile">
              <span className="route-kicker">โหมด</span>
              <strong>มุมมองเอกสาร</strong>
              <p>{role === 'FO' ? 'การเข้าถึงเอกสารของ FO ถูกจำกัดในเชลล์นี้' : 'พื้นที่พรีวิว / พิมพ์ที่ผูกกับบทบาท'}</p>
          </div>
          <div className="status-tile">
              <span className="route-kicker">คิว</span>
              <strong>{reportQueue.length}</strong>
              <p>ผลลัพธ์ที่เข้าคิวพร้อมสำหรับกระบวนการเอกสาร</p>
          </div>
          <div className="status-tile">
              <span className="route-kicker">บทบาท</span>
              <strong>{role}</strong>
              <p>{role === 'FDC' ? 'ศูนย์ตัดสินใจ' : role === 'HOWITZER' ? 'ขั้นตอนส่วนยิง' : 'พื้นที่ทำงานตามขอบเขต'}</p>
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
                  รายงานรอง ผบ.ร้อย
                </button>
                <button type="button" className="ghost-button" onClick={() => selectDocument('COUNTER_BATTERY')}>
                  บขตป.
                </button>
              </>
            ) : null}
            {role === 'FDC' ? (
              <button type="button" className="ghost-button" onClick={() => selectDocument('DEPUTY_REPORT')}>
                พรีวิวรายงานที่เชื่อมโยง
              </button>
            ) : null}
          </div>
          {role === 'FO' ? <p className="document-note">ผู้ตรวจการณ์หน้าไม่มีสิทธิ์พรีวิวเอกสารข้ามหมวดใน shell นี้</p> : renderDocument()}
          <div className="event-log-panel">
            <span className="route-kicker">คิวรายงาน</span>
            {reportQueue.length ? (
              reportQueue.slice(0, 3).map((item) => (
                <p key={item.id}>
                  {formatDocumentLabel(item.document)} — {formatRoleLabel(item.source)} — {formatQueueStatus(item.status)}
                </p>
              ))
            ) : (
              <p>ยังไม่มีรายการในคิวรายงาน</p>
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
        <p className="route-kicker">บทบาท</p>
        <h3>{formatRoleLabel(role)}</h3>
        <button type="button" className="m2-launch-button" onClick={openCompass}>
          M.2
          <span>เข็มทิศเหนือแม่เหล็ก</span>
        </button>
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
          <p className="workspace-panel__meta">มองเห็นได้สำหรับบทบาท: {formatRoleLabel(role)}</p>
          <div className="event-log-panel event-log-panel--compact">
            <span className="route-kicker">บันทึกเหตุการณ์ร่วม</span>
            {visibleEvents.length ? (
              visibleEvents.slice(0, 3).map((entry) => (
                <p key={entry.id}>
                  {entry.createdAt} [{formatSeverityLabel(entry.severity)}] {formatEventSource(entry.source)}: {entry.message}
                </p>
              ))
            ) : (
              <p>ยังไม่มีเหตุการณ์ในชั้นร่วม</p>
            )}
          </div>
        </div>
      </article>
      {compassOpen ? (
        <section className="m2-compass-overlay" aria-label="เข็มทิศ M.2" role="dialog" aria-modal="false">
          <div className="m2-compass-card">
            <header className="m2-compass-card__header">
              <div>
                <span className="route-kicker">M.2 / เครื่องมือเบื้องหลัง</span>
                <h2>เข็มทิศเหนือแม่เหล็ก</h2>
              </div>
              <button type="button" className="ghost-button" onClick={() => setCompassOpen(false)}>ปิด</button>
            </header>
              <div
                className="m2-compass-dial"
                aria-label="หน้าปัดเข็มทิศ M.2 แบบสามมิติ"
                style={{ transform: `perspective(700px) rotateX(${Math.max(-28, Math.min(28, (magneticPitch ?? 0) - 90))}deg)` }}
              >
              <img src={m2Dial} alt="หน้าปัดเข็มทิศ M.2" className="m2-compass-dial__face" />
              <img
                src={m2Needle}
                alt="เข็มทิศสองด้าน สีขาวและสีดำ"
                className="m2-compass-dial__needle"
                style={{ transform: `translate(-50%, -50%) rotate(${magneticHeading ?? 0}deg)` }}
              />
              <span className="m2-compass-dial__center" aria-hidden="true" />
              </div>
            <div className="m2-compass-readout" aria-live="polite">
              <span>ทิศเหนือแม่เหล็ก</span>
              <strong>{magneticHeading === null ? 'รอเซนเซอร์' : `${Math.round(magneticHeading)}°`}</strong>
              <small>{magneticHeading === null ? 'อนุญาตการเข้าถึงเซนเซอร์ของอุปกรณ์เพื่อหมุนเข็มอัตโนมัติ' : 'เข็มสีขาวชี้ทิศเหนือแม่เหล็ก'}</small>
              <small>มุมกลับทิศ: {magneticHeading === null ? '--' : `${Math.round((((magneticHeading / 360) * 6400) + 3200) % 6400)} มิล`} · เอียง {magneticPitch === null ? '--' : `${Math.round(magneticPitch)}°`}</small>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}


