export function renderFooter() {
  const footer = document.createElement('footer');
  footer.id = 'contacto';
  footer.className = 'site-footer';
  footer.innerHTML = [
    '<div class="footer-grid">',
    '  <div>',
    '    <strong>Tuft Atelier</strong>',
    '    <p>Alfombras tufting personalizadas, hechas a mano y preparadas para pedidos únicos.</p>',
    '  </div>',
    '  <div>',
    '    <span>Atención personalizada</span>',
    '    <p>Te acompañamos durante todo el proceso.</p>',
    '  </div>',
    '  <div>',
    '    <span>Pagos seguros</span>',
    '    <p>Preparado para integrar métodos reales más adelante.</p>',
    '  </div>',
    '  <div>',
    '    <span>Calidad garantizada</span>',
    '    <p>Piezas suaves, firmes y hechas para durar.</p>',
    '  </div>',
    '</div>'
  ].join('');

  return footer;
}
