import { defaultSession } from '../auth/auth-state';
import { canViewPanel, panelOrder } from '../auth/role-visibility';
import { FdcWorkspace } from '@/domains/fdc/FdcWorkspace';
import { FoWorkspace } from '@/domains/fo/FoWorkspace';
import { HowitzerWorkspace } from '@/domains/howitzer/HowitzerWorkspace';

const panelContent: Record<string, { title: string; detail?: string; node?: JSX.Element }> = {
  FO: { title: 'FO Workspace', node: <FoWorkspace /> },
  FDC: { title: 'FDC Workspace', node: <FdcWorkspace /> },
  SURVEILLANCE: { title: 'Surveillance Workspace', detail: 'Survey / Map / ทบ.344 document workflow' },
  HOWITZER: { title: 'Howitzer Workspace', node: <HowitzerWorkspace /> },
  WEAPONS: { title: 'Weapons Workspace', detail: 'Ammo / Fuze / Safety workflow' },
  MAP: { title: 'Shared Map View', detail: 'Shared engine with role-segmented visibility' },
  DOCUMENT: { title: 'Document Mode', detail: 'Preview / print artifacts for real forms' },
};

export function WorkspaceShell() {
  const role = defaultSession.role ?? 'FDC';
  const visiblePanels = panelOrder.filter((panel) => canViewPanel(role, panel));

  return (
    <div className="workspace-shell" aria-label="workspace-shell">
      {visiblePanels.map((panel) => (
        <article key={panel} className="workspace-panel">
          {panelContent[panel].node ?? (
            <>
              <header>{panelContent[panel].title}</header>
              <p>{panelContent[panel].detail}</p>
            </>
          )}
          <p className="workspace-panel__meta">Visible for role: {role}</p>
        </article>
      ))}
    </div>
  );
}
