import { describe, expect, it } from 'vitest';
import {
  buildGeneralContactMessage,
  buildProductContactMessage,
  buildWhatsappUrl,
  storeWhatsappBaseUrl,
  storeWhatsappDisplayNumber,
  storeWhatsappNumber,
} from './contact';

const sourceFiles = import.meta.glob<string>('/src/**/*.{ts,tsx,css}', {
  eager: true,
  import: 'default',
  query: '?raw',
});
const contactConfigPath = '/src/shared/config/contact.ts';

describe('contact config', () => {
  it('builds encoded WhatsApp links from the shared number', () => {
    const message = 'Hola! Medidas: 60 x 60 cm & colores rosa/azul';
    const url = buildWhatsappUrl(message);

    expect(url).toBe(
      storeWhatsappBaseUrl + storeWhatsappNumber + '?text=' + encodeURIComponent(message)
    );
    expect(decodeURIComponent(url.split('?text=')[1] || '')).toBe(message);
    expect(storeWhatsappDisplayNumber).toContain('98529-1212');
  });

  it('keeps reusable contact messages readable without embedding the phone number', () => {
    const generalMessage = buildGeneralContactMessage();
    const productMessage = buildProductContactMessage('Bola Ocho');
    const portugueseGeneralMessage = buildGeneralContactMessage('pt');
    const portugueseProductMessage = buildProductContactMessage('Bola Oito', 'pt');

    expect(generalMessage).toContain('alfombra tufting personalizada');
    expect(productMessage).toContain('Producto de referencia: Bola Ocho');
    expect(productMessage).toContain('WhatsApp');
    expect(portugueseGeneralMessage).toContain('tapete tufting personalizado');
    expect(portugueseProductMessage).toContain('Produto de referência: Bola Oito');
    expect(portugueseProductMessage).toContain('orçamento pelo WhatsApp');
    expect(generalMessage).not.toContain(storeWhatsappNumber);
    expect(productMessage).not.toContain(storeWhatsappNumber);
    expect(portugueseGeneralMessage).not.toContain(storeWhatsappNumber);
    expect(portugueseProductMessage).not.toContain(storeWhatsappNumber);
  });

  it('keeps the WhatsApp number centralized in this config file', () => {
    const matches = Object.entries(sourceFiles)
      .filter(([filePath]) => filePath !== contactConfigPath)
      .filter(([, source]) => source.includes(storeWhatsappNumber))
      .map(([filePath]) => filePath);

    expect(matches).toEqual([]);
  });
});
