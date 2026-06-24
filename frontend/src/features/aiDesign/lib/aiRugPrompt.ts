import type { Language } from '../../../shared/i18n';
import { buildWhatsappUrl, storeWhatsappNumber } from '../../../shared/config/contact';

export const storeDomain = 'https://tu-dominio-vercel.app';
export const aiRugGuideUrl = storeDomain + '/ai-rug-guide/';
export const llmsUrl = storeDomain + '/llms.txt';

const aiReferenceWhatsAppMessages: Record<Language, string> = {
  es: 'Hola, quiero hablar sobre la referencia que hice con IA. Sigue la imagen:',
  pt: 'Olá, quero falar sobre a referência que fiz com IA. Segue a imagem:',
};

export function buildAiReferenceWhatsAppUrl(language: Language): string {
  return buildWhatsappUrl(aiReferenceWhatsAppMessages[language]);
}

export function buildAiRugPrompt(language: Language): string {
  return language === 'pt' ? buildPortuguesePrompt() : buildSpanishPrompt();
}

function buildSpanishPrompt(): string {
  return [
    'Quiero que actúes como asistente de diseño para tapetes tufting personalizados.',
    '',
    'Primero lee la guía pública de la tienda:',
    aiRugGuideUrl,
    '',
    'También revisa las instrucciones para IA:',
    llmsUrl,
    '',
    'Tu tarea es ayudarme a crear una referencia visual para un tapete tufting hecho a mano.',
    '',
    'Reglas:',
    '- El diseño debe ser simple.',
    '- Evita detalles pequeños.',
    '- Evita líneas finas.',
    '- Prioriza líneas gruesas y formas claras.',
    '- Usa pocas áreas de color bien separadas.',
    '- No uses personajes protegidos por copyright.',
    '- No uses marcas ni logos ajenos.',
    '- El diseño debe ser fácil de producir manualmente.',
    '- El precio final y la viabilidad serán confirmados por la tienda.',
    '',
    'Hazme preguntas simples, una por una.',
    '',
    'Pregúntame:',
    '1. Dónde usaré el tapete.',
    '2. Qué tamaño aproximado quiero.',
    '3. Qué forma prefiero.',
    '4. Qué estilo visual me gusta.',
    '5. Qué colores quiero.',
    '6. Qué colores quiero evitar.',
    '7. Si quiero texto, iniciales o un símbolo propio.',
    '',
    'Después de mis respuestas:',
    '- Resume mi idea.',
    '- Propón una composición simple.',
    '- Crea un prompt final para generar una imagen.',
    '- Ayúdame a generar una referencia visual.',
    '- Cuando tenga la imagen, recuérdame volver al sitio o contactar por WhatsApp al número: ' +
      storeWhatsappNumber +
      '.',
  ].join('\n');
}

function buildPortuguesePrompt(): string {
  return [
    'Quero que você atue como assistente de design para tapetes tufting personalizados.',
    '',
    'Primeiro leia a guia pública da loja:',
    aiRugGuideUrl,
    '',
    'Também revise as instruções para IA:',
    llmsUrl,
    '',
    'Sua tarefa é me ajudar a criar uma referência visual para um tapete tufting feito à mão.',
    '',
    'Regras:',
    '- O design deve ser simples.',
    '- Evite detalhes pequenos.',
    '- Evite linhas finas.',
    '- Priorize linhas grossas e formas claras.',
    '- Use poucas áreas de cor bem separadas.',
    '- Não use personagens protegidos por copyright.',
    '- Não use marcas nem logos de terceiros.',
    '- O design deve ser fácil de produzir manualmente.',
    '- O preço final e a viabilidade serão confirmados pela loja.',
    '',
    'Faça perguntas simples, uma por vez.',
    '',
    'Pergunte:',
    '1. Onde vou usar o tapete.',
    '2. Qual tamanho aproximado eu quero.',
    '3. Qual forma eu prefiro.',
    '4. Qual estilo visual eu gosto.',
    '5. Quais cores eu quero.',
    '6. Quais cores eu quero evitar.',
    '7. Se quero texto, iniciais ou um símbolo próprio.',
    '',
    'Depois das minhas respostas:',
    '- Resuma minha ideia.',
    '- Proponha uma composição simples.',
    '- Crie um prompt final para gerar uma imagem.',
    '- Ajude-me a gerar uma referência visual.',
    '- Quando eu tiver a imagem, lembre-me de voltar ao site ou chamar no WhatsApp pelo número: ' +
      storeWhatsappNumber +
      '.',
  ].join('\n');
}
