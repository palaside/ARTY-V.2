export type CapabilityItem = {
  title: string;
  description: string;
  state: 'พร้อมแสดงผล' | 'โหมดฝึก / รอข้อมูลอ้างอิง';
};

type CapabilityCatalogProps = {
  title: string;
  items: CapabilityItem[];
};

export function CapabilityCatalog({ title, items }: CapabilityCatalogProps) {
  return (
    <section className="capability-catalog" aria-label={title}>
      <div className="capability-catalog__header">
        <span className="route-kicker">ความสามารถประจำหมวด</span>
        <h4>{title}</h4>
      </div>
      <div className="capability-grid">
        {items.map((item) => (
          <details key={item.title} className="capability-card">
            <summary>
              <span>{item.title}</span>
              <small>{item.state}</small>
            </summary>
            <p>{item.description}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
