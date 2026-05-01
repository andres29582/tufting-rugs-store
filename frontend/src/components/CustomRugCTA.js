export function renderCustomRugCTA() {
  const section = document.createElement('section');
  section.id = 'personalizadas';
  section.className = 'custom-cta-section';
  section.innerHTML = [
    '<div class="custom-cta glass-panel">',
    '  <div class="magic-icon" aria-hidden="true">',
    '    <svg viewBox="0 0 24 24">',
    '      <path d="m5 19 9.5-9.5"/><path d="m14 4 6 6"/><path d="m12.5 5.5 6 6"/><path d="M5 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/><path d="M18 15l.8 1.5 1.7.8-1.7.8L18 21l-.8-1.9-1.7-.8 1.7-.8L18 15Z"/>',
    '    </svg>',
    '  </div>',
    '  <div>',
    '    <p class="eyebrow">Pedido personalizado</p>',
    '    <h2>¿Tienes una idea en mente?</h2>',
    '    <p>Creamos una alfombra desde tu referencia, tus colores y las medidas exactas para tu espacio.</p>',
    '  </div>',
    '  <button class="button button-light" type="button" data-action="customize">Quiero personalizar la mía</button>',
    '</div>'
  ].join('');

  return section;
}
