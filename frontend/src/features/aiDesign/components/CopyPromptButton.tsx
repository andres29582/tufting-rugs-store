import { useState } from 'react';
import { Button } from '../../../shared/components/Button/Button';
import { useTranslation } from '../../../shared/i18n';

type CopyPromptButtonProps = {
  prompt: string;
};

export function CopyPromptButton({ prompt }: CopyPromptButtonProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState('');

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus(t('ai.copy.success'));
    } catch {
      setStatus(t('ai.copy.error'));
    }
  }

  return (
    <div className="ai-copy-action">
      <Button type="button" variant="primary" onClick={copyPrompt}>
        {t('ai.copy.cta')}
      </Button>
      <span aria-live="polite">{status}</span>
    </div>
  );
}
