const es = {
  'ai.direct.eyebrow': 'Para continuar sin ayuda de IA',
  'ai.direct.title': 'Personaliza tu tapete a tu manera',
  'ai.direct.copy':
    'Puedes ir directo al formulario y responder paso a paso para preparar tu pedido por WhatsApp.',
  'ai.direct.cta': 'Personalizar mi tapete',
  'ai.choice.eyebrow': 'Referencia con IA',
  'ai.choice.title': '¿Tienes acceso a una IA que genere imágenes?',
  'ai.choice.copy':
    'Si usas una de estas herramientas, te damos un prompt para crear una referencia visual antes de completar el formulario.',
  'ai.choice.toolsAria': 'Herramientas de IA de referencia',
  'ai.choice.cta': 'Sí, tengo acceso a una IA',
  'ai.guide.eyebrow': 'Usar IA externa',
  'ai.guide.title': 'Crea tu idea antes de completar el pedido',
  'ai.guide.close': 'Cerrar',
  'ai.guide.step.copy': 'Copia el prompt.',
  'ai.guide.step.openAi': 'Abre ChatGPT, Gemini u otra IA.',
  'ai.guide.step.paste': 'Pega el prompt.',
  'ai.guide.step.readGuide': 'La IA leerá la guía pública del sitio.',
  'ai.guide.step.answer': 'Responde las preguntas de la IA.',
  'ai.guide.step.generate': 'Genera una imagen de referencia.',
  'ai.guide.step.return': 'Vuelve aquí y continúa el formulario.',
  'ai.prompt.label': 'Prompt listo para copiar',
  'ai.copy.cta': 'Copiar prompt',
  'ai.copy.success': 'Prompt copiado',
  'ai.copy.error': 'No se pudo copiar. Selecciona el texto manualmente.',
  'ai.whatsapp.cta': 'Ya tengo mi referencia / continuar por WhatsApp',
} as const;

const pt = {
  'ai.direct.eyebrow': 'Para continuar sem ajuda de IA',
  'ai.direct.title': 'Personalize seu tapete do seu jeito',
  'ai.direct.copy':
    'Você pode ir direto ao formulário e responder passo a passo para preparar seu pedido pelo WhatsApp.',
  'ai.direct.cta': 'Personalizar meu tapete',
  'ai.choice.eyebrow': 'Referência com IA',
  'ai.choice.title': 'Você tem acesso a uma IA que gera imagens?',
  'ai.choice.copy':
    'Se você usa uma dessas ferramentas, damos um prompt para criar uma referência visual antes de completar o formulário.',
  'ai.choice.toolsAria': 'Ferramentas de IA de referência',
  'ai.choice.cta': 'Sim, tenho acesso a uma IA',
  'ai.guide.eyebrow': 'Usar IA externa',
  'ai.guide.title': 'Crie sua ideia antes de completar o pedido',
  'ai.guide.close': 'Fechar',
  'ai.guide.step.copy': 'Copie o prompt.',
  'ai.guide.step.openAi': 'Abra ChatGPT, Gemini ou outra IA.',
  'ai.guide.step.paste': 'Cole o prompt.',
  'ai.guide.step.readGuide': 'A IA vai ler a guia pública do site.',
  'ai.guide.step.answer': 'Responda as perguntas da IA.',
  'ai.guide.step.generate': 'Gere uma imagem de referencia.',
  'ai.guide.step.return': 'Volte aqui e continue o formulário.',
  'ai.prompt.label': 'Prompt pronto para copiar',
  'ai.copy.cta': 'Copiar prompt',
  'ai.copy.success': 'Prompt copiado',
  'ai.copy.error': 'Não foi possível copiar. Selecione o texto manualmente.',
  'ai.whatsapp.cta': 'Já tenho minha referência / continuar pelo WhatsApp',
} satisfies Record<keyof typeof es, string>;

export const aiTranslations = { es, pt } as const;
