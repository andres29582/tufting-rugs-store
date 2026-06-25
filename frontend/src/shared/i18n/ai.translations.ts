const es = {
  'ai.direct.eyebrow': 'Para continuar sin ayuda de IA',
  'ai.direct.title': 'Crea tu alfombra personalizada',
  'ai.direct.copy':
    'Responde el formulario y sal con un brief claro para solicitar presupuesto por WhatsApp.',
  'ai.direct.cta': 'Crear mi alfombra personalizada',
  'ai.choice.eyebrow': 'Referencia con IA',
  'ai.choice.title': '¿Tienes acceso a una IA que genere imágenes?',
  'ai.choice.copy':
    'Si usas una de estas herramientas, te damos un prompt para crear una referencia visual antes de completar el formulario.',
  'ai.choice.toolsAria': 'Herramientas de IA de referencia',
  'ai.choice.cta': 'Crear referencia con IA',
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
  'ai.whatsapp.cta': 'Enviar referencia y pedir presupuesto',
} as const;

const pt = {
  'ai.direct.eyebrow': 'Para continuar sem ajuda de IA',
  'ai.direct.title': 'Crie seu tapete personalizado',
  'ai.direct.copy':
    'Responda o formulário e saia com um briefing claro para solicitar orçamento pelo WhatsApp.',
  'ai.direct.cta': 'Criar meu tapete personalizado',
  'ai.choice.eyebrow': 'Referência com IA',
  'ai.choice.title': 'Você tem acesso a uma IA que gera imagens?',
  'ai.choice.copy':
    'Se você usa uma dessas ferramentas, damos um prompt para criar uma referência visual antes de completar o formulário.',
  'ai.choice.toolsAria': 'Ferramentas de IA de referência',
  'ai.choice.cta': 'Criar referência com IA',
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
  'ai.whatsapp.cta': 'Enviar referência e pedir orçamento',
} satisfies Record<keyof typeof es, string>;

export const aiTranslations = { es, pt } as const;
