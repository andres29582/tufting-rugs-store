import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTranslation } from '../../../shared/i18n';
import { AiPromptGuide } from './AiPromptGuide';

type AiPersonalizationGateProps = {
  onContinueToForm: () => void;
};

const aiTools = ['ChatGPT', 'Gemini', 'Copilot'];

export function AiPersonalizationGate({ onContinueToForm }: AiPersonalizationGateProps) {
  const { t } = useTranslation();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const openGuide = () => setIsGuideOpen(true);

  return (
    <section className="ai-gate-section" aria-labelledby="ai-gate-title">
      <div className="ai-choice-grid">
        <PersonalizationChoiceCard className="ai-choice-card-direct" onSelect={onContinueToForm}>
          <p className="eyebrow">{t('ai.direct.eyebrow')}</p>
          <h1 id="ai-gate-title">{t('ai.direct.title')}</h1>
          <p>{t('ai.direct.copy')}</p>
        </PersonalizationChoiceCard>

        <PersonalizationChoiceCard onSelect={openGuide}>
          <p className="eyebrow">{t('ai.choice.eyebrow')}</p>
          <h2>{t('ai.choice.title')}</h2>
          <p>{t('ai.choice.copy')}</p>
          <div className="ai-tool-list" aria-label={t('ai.choice.toolsAria')}>
            {aiTools.map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </PersonalizationChoiceCard>
      </div>

      {isGuideOpen ? <AiPromptGuide onClose={() => setIsGuideOpen(false)} /> : null}
    </section>
  );
}

function PersonalizationChoiceCard({
  children,
  className,
  onSelect,
}: {
  children: ReactNode;
  className?: string;
  onSelect: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  }

  return (
    <div
      className={['ai-choice-card glass-panel', className].filter(Boolean).join(' ')}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
}
