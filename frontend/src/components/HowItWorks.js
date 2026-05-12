const steps = [
  {
    title: 'Cuéntanos tu idea',
    text: 'Describe medidas, colores y referencias visuales.',
    icon: '<path d="m4 17 1 3 3-1L19 8l-4-4L4 15v2Z"/><path d="m13 6 4 4"/>'
  },
  {
    title: 'Preparamos el diseño',
    text: 'Convertimos tu idea en una propuesta clara.',
    icon: '<path d="M4 4h16v16H4z"/><path d="m8 16 8-8"/><path d="M8 8h.01M16 16h.01"/>'
  },
  {
    title: 'Apruebas detalles',
    text: 'Revisas forma, paleta, tamaño y precio estimado.',
    icon: '<path d="m5 12 4 4L19 6"/>'
  },
  {
    title: 'Creamos la alfombra',
    text: 'La producimos a mano y la preparamos para envío.',
    icon: '<path d="M12 21s-8-4.7-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.3-8 11-10 11Z"/>'
  }
];

export function renderHowItWorks() {
  const section = document.createElement('section');
  section.id = 'como-funciona';
  section.className = 'how-section';
  section.innerHTML = [
    '<div class="how-panel glass-panel">',
    '  <div class="section-copy">',
    '    <p class="eyebrow">Proceso artesanal</p>',
    '    <h2>¿Cómo funciona?</h2>',
    '    <p>Una ruta simple para transformar una idea en una alfombra personalizada y aprobada antes de producir.</p>',
    '  </div>',
    '  <div class="steps-grid">',
    steps
      .map(function (step, index) {
        return [
          '<article class="step-card">',
          '  <span class="step-index">0' + (index + 1) + '</span>',
          '  <svg viewBox="0 0 24 24" aria-hidden="true">' + step.icon + '</svg>',
          '  <h3>' + step.title + '</h3>',
          '  <p>' + step.text + '</p>',
          '</article>'
        ].join('');
      })
      .join(''),
    '  </div>',
    '</div>'
  ].join('');

  return section;
}
