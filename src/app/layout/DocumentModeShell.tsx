import type { ReactNode } from 'react';

export function DocumentModeShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="document-shell" aria-label="document-mode-shell">
      <header className="document-shell__header">
        <span className="route-kicker">Document Mode</span>
        <h2>{title}</h2>
      </header>
      <div className="document-shell__body">{children}</div>
    </section>
  );
}
