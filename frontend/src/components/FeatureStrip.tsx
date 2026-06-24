import { useTranslation, type TranslationKey } from '../shared/i18n';

const features: Array<{
  titleKey: TranslationKey;
  textKey: TranslationKey;
  icon: string;
}> = [
  {
    titleKey: 'features.handmade.title',
    textKey: 'features.handmade.text',
    icon: '<path d="M8 12V5a2 2 0 0 1 4 0v5m0 1V4a2 2 0 0 1 4 0v8m0 0V6a2 2 0 0 1 4 0v9a7 7 0 0 1-14 0v-3a2 2 0 0 1 4 0v3"/>',
  },
  {
    titleKey: 'features.materials.title',
    textKey: 'features.materials.text',
    icon: '<path d="M20 4C11 5 5 11 4 20c9-1 15-7 16-16Z"/><path d="M9 15c2-3 5-6 9-9"/>',
  },
  {
    titleKey: 'features.custom.title',
    textKey: 'features.custom.text',
    icon: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="8" r="1"/><circle cx="16" cy="14" r="1"/><circle cx="10" cy="16" r="1"/>',
  },
  {
    titleKey: 'features.shipping.title',
    textKey: 'features.shipping.text',
    icon: '<path d="M3 7h11v10H3z"/><path d="M14 11h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  },
];

export function FeatureStrip() {
  const { t } = useTranslation();

  return (
    <section className="feature-strip-section" aria-label={t('features.aria')}>
      <div className="feature-strip glass-panel">
        {features.map((feature) => (
          <article className="feature-item" key={feature.titleKey}>
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: feature.icon }}
            />
            <div>
              <h3>{t(feature.titleKey)}</h3>
              <p>{t(feature.textKey)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
