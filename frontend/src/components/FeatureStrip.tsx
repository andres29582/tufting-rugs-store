const features = [
  {
    title: 'Hechas a mano',
    text: 'Cada pieza se trabaja con calma y detalle.',
    icon: '<path d="M8 12V5a2 2 0 0 1 4 0v5m0 1V4a2 2 0 0 1 4 0v8m0 0V6a2 2 0 0 1 4 0v9a7 7 0 0 1-14 0v-3a2 2 0 0 1 4 0v3"/>'
  },
  {
    title: 'Materiales premium',
    text: 'Fibras suaves, resistentes y pensadas para durar.',
    icon: '<path d="M20 4C11 5 5 11 4 20c9-1 15-7 16-16Z"/><path d="M9 15c2-3 5-6 9-9"/>'
  },
  {
    title: 'Personalizables',
    text: 'Medidas, colores y formas adaptadas a tu idea.',
    icon: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="16" cy="14" r="1"/><circle cx="10" cy="16" r="1"/>'
  },
  {
    title: 'Envíos seguros',
    text: 'Empaque protegido y seguimiento del pedido.',
    icon: '<path d="M3 7h11v10H3z"/><path d="M14 11h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>'
  }
];

export function FeatureStrip() {
  return (
    <section className="feature-strip-section" aria-label="Características de la tienda">
      <div className="feature-strip glass-panel">
        {features.map((feature) => (
          <article className="feature-item" key={feature.title}>
            <svg viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: feature.icon }} />
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
