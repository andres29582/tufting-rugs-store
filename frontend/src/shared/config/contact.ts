import type { Language } from '../i18n';

export const storeWhatsappNumber = '5541985291212';
export const storeWhatsappDisplayNumber = '+55 41 98529-1212';
export const storeWhatsappBaseUrl = 'https://wa.me/';

export function buildWhatsappUrl(message: string): string {
  return storeWhatsappBaseUrl + storeWhatsappNumber + '?text=' + encodeURIComponent(message);
}

export function buildGeneralContactMessage(language: Language = 'es'): string {
  return language === 'pt'
    ? 'Olá! Quero pedir um tapete tufting personalizado.'
    : 'Hola! Quiero pedir una alfombra tufting personalizada.';
}

export function buildProductContactMessage(productName: string, language: Language = 'es'): string {
  if (language === 'pt') {
    return [
      'Olá! Quero pedir um tapete tufting.',
      '',
      'Produto de referência: ' + productName,
      'Origem: Detalhe do produto',
      '',
      'Observações: Quero validar viabilidade, prazo e orçamento pelo WhatsApp.',
    ].join('\n');
  }

  return [
    'Hola! Quiero pedir una alfombra tufting.',
    '',
    'Producto de referencia: ' + productName,
    'Origen: Detalle de producto',
    '',
    'Observaciones: Quiero validar viabilidad, plazo y presupuesto por WhatsApp.',
  ].join('\n');
}
