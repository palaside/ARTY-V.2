export function FoWorkspace() {
  return (
    <section className="domain-workspace" aria-label="fo-workspace">
      <header className="domain-workspace__header">
        <span className="route-kicker">FO</span>
        <h3>Forward Observer Workspace</h3>
      </header>
      <ul className="domain-list">
        <li>Grid / Polar / Shift target acquisition</li>
        <li>Flash-to-Bang and Mil Formula tools</li>
        <li>Target adjustment workflow</li>
        <li>Restricted map visibility per OPSEC rule</li>
      </ul>
    </section>
  );
}
