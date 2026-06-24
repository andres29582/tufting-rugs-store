import type { Language } from '../i18n';

export const storeWhatsappNumber = '5541985291212';
export const storeWhatsappDisplayNumber = '+55 41 98529-1212';
export const storeWhatsappBaseUrl = 'https://wa.me/';

export function buildWhatsappUrl(message: string): string {
  return storeWhatsappBaseUrl + storeWhatsappNumber + '?text=' + encodeURIComponent(message);
}

export function buildGeneralContactMessage(language: Language = 'es'): string {
  return language === 'pt'
    ? 'Olá! Quero solicitar orçamento para um tapete tufting personalizado.'
    : 'Hola! Quiero solicitar presupuesto para una alfombra tufting personalizada.';
}

export function buildProductContactMessage(productName: string, language: Language = 'es'): string {
  if (language === 'pt') {
    return [
      'Olá! Quero solicitar orçamento para um tapete tufting.',
      '',
      'Produto/base de referência: ' + productName,
      'Origem: Detalhe do produto',
      '',
      'Solicitação: Confirmar viabilidade, prazo de produção e orçamento final pelo WhatsApp.',
    ].join('\n');
  }

  return [
    'Hola! Quiero solicitar presupuesto para una alfombra tufting.',
    '',
    'Producto/base de referencia: ' + productName,
    'Origen: Detalle de producto',
    '',
    'Solicitud: Confirmar viabilidad, plazo de producción y presupuesto final por WhatsApp.',
  ].join('\n');
}
