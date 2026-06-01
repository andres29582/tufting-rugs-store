import type { Language } from '../../shared/i18n';

export const storeDomain = 'https://tu-dominio-vercel.app';
export const storeWhatsappNumber = '5541985291212';
export const aiRugGuideUrl = storeDomain + '/ai-rug-guide/';
export const llmsUrl = storeDomain + '/llms.txt';

const aiReferenceWhatsAppMessages: Record<Language, string> = {
  es: 'Hola, quiero hablar sobre la referencia que hice con IA. Sigue la imagen:',
  pt: 'Ola, quero falar sobre a referencia que fiz com IA. Segue a imagem:'
};

export function buildAiReferenceWhatsAppUrl(language: Language): string {
  return (
    'https://wa.me/' +
    storeWhatsappNumber +
    '?text=' +
    encodeURIComponent(aiReferenceWhatsAppMessages[language])
  );
}

export function buildAiRugPrompt(language: Language): string {
  return language === 'pt' ? buildPortuguesePrompt() : buildSpanishPrompt();
}

function buildSpanishPrompt(): string {
  return [
    'Quiero que actues como asistente de diseno para tapetes tufting personalizados.',
    '',
    'Primero lee la guia publica de la tienda:',
    aiRugGuideUrl,
    '',
    'Tambien revisa las instrucciones para IA:',
    llmsUrl,
    '',
    'Tu tarea es ayudarme a crear una referencia visual para un tapete tufting hecho a mano.',
    '',
    'Reglas:',
    '- El diseno debe ser simple.',
    '- Evita detalles pequenos.',
    '- Evita lineas finas.',
    '- Prioriza lineas gruesas y formas claras.',
    '- Usa pocas areas de color bien separadas.',
    '- No uses personajes protegidos por copyright.',
    '- No uses marcas ni logos ajenos.',
    '- El diseno debe ser facil de producir manualmente.',
    '- El precio final y la viabilidad seran confirmados por la tienda.',
    '',
    'Hazme preguntas simples, una por una.',
    '',
    'Preguntame:',
    '1. Donde usare el tapete.',
    '2. Que tamano aproximado quiero.',
    '3. Que forma prefiero.',
    '4. Que estilo visual me gusta.',
    '5. Que colores quiero.',
    '6. Que colores quiero evitar.',
    '7. Si quiero texto, iniciales o un simbolo propio.',
    '',
    'Despues de mis respuestas:',
    '- Resume mi idea.',
    '- Propon una composicion simple.',
    '- Crea un prompt final para generar una imagen.',
    '- Ayudame a generar una referencia visual.',
    '- Cuando tenga la imagen, recuerdame volver al sitio o contactar por WhatsApp al numero: ' +
      storeWhatsappNumber +
      '.'
  ].join('\n');
}

function buildPortuguesePrompt(): string {
  return [
    'Quero que voce atue como assistente de design para tapetes tufting personalizados.',
    '',
    'Primeiro leia a guia publica da loja:',
    aiRugGuideUrl,
    '',
    'Tambem revise as instrucoes para IA:',
    llmsUrl,
    '',
    'Sua tarefa e me ajudar a criar uma referencia visual para um tapete tufting feito a mao.',
    '',
    'Regras:',
    '- O design deve ser simples.',
    '- Evite detalhes pequenos.',
    '- Evite linhas finas.',
    '- Priorize linhas grossas e formas claras.',
    '- Use poucas areas de cor bem separadas.',
    '- Nao use personagens protegidos por copyright.',
    '- Nao use marcas nem logos de terceiros.',
    '- O design deve ser facil de produzir manualmente.',
    '- O preco final e a viabilidade serao confirmados pela loja.',
    '',
    'Faca perguntas simples, uma por vez.',
    '',
    'Pergunte:',
    '1. Onde vou usar o tapete.',
    '2. Qual tamanho aproximado eu quero.',
    '3. Qual forma eu prefiro.',
    '4. Qual estilo visual eu gosto.',
    '5. Quais cores eu quero.',
    '6. Quais cores eu quero evitar.',
    '7. Se quero texto, iniciais ou um simbolo proprio.',
    '',
    'Depois das minhas respostas:',
    '- Resuma minha ideia.',
    '- Proponha uma composicao simples.',
    '- Crie um prompt final para gerar uma imagem.',
    '- Ajude-me a gerar uma referencia visual.',
    '- Quando eu tiver a imagem, lembre-me de voltar ao site ou chamar no WhatsApp pelo numero: ' +
      storeWhatsappNumber +
      '.'
  ].join('\n');
}
