import { useEffect } from 'react';
import { Button, ButtonLink } from '../../../shared/components/Button/Button';
import { useTranslation } from '../../../shared/i18n';
import { buildAiReferenceWhatsAppUrl, buildAiRugPrompt } from '../lib/aiRugPrompt';
import { CopyPromptButton } from './CopyPromptButton';

type AiPromptGuideProps = {
  onClose: () => void;
};

export function AiPromptGuide({ onClose }: AiPromptGuideProps) {
  const { language, t } = useTranslation();
  const prompt = buildAiRugPrompt(language);
  const guideSteps = [
    t('ai.guide.step.copy'),
    t('ai.guide.step.openAi'),
    t('ai.guide.step.paste'),
    t('ai.guide.step.readGuide'),
    t('ai.guide.step.answer'),
    t('ai.guide.step.generate'),
    t('ai.guide.step.return'),
  ];

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <div className="ai-guide-overlay" role="presentation">
      <section
        className="ai-guide-panel glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-guide-title"
      >
        <div className="ai-guide-head">
          <div>
            <p className="eyebrow">{t('ai.guide.eyebrow')}</p>
            <h1 id="ai-guide-title">{t('ai.guide.title')}</h1>
          </div>
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('ai.guide.close')}
          </Button>
        </div>
        <ol className="ai-steps">
          {guideSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <label className="ai-prompt-label" htmlFor="ai-rug-prompt">
          {t('ai.prompt.label')}
        </label>
        <textarea id="ai-rug-prompt" className="ai-prompt-textarea" readOnly value={prompt} />
        <div className="ai-guide-actions">
          <CopyPromptButton prompt={prompt} />
          <ButtonLink
            href={buildAiReferenceWhatsAppUrl(language)}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ai.whatsapp.cta')}
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
