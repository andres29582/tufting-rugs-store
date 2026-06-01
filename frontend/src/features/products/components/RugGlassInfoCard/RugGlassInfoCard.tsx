import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';
import { formatPrice } from '../../../../utils/money';
import { localizeProduct } from '../../model/productLocalization';

type RugGlassInfoCardProps = {
  rug: Product;
  hero?: boolean;
  onAction?: (() => void) | undefined;
};

export function RugGlassInfoCard({ rug, hero = false, onAction }: RugGlassInfoCardProps) {
  const { language, t } = useTranslation();
  const displayRug = localizeProduct(rug, language);
  const HeadingTag = hero ? 'h1' : 'h2';

  return (
    <article className="rug-info-card glass-panel">
      <p className="eyebrow">{t('product.handmadeEyebrow', { category: displayRug.category })}</p>
      <HeadingTag id={'showcase-title-' + rug.slug}>{displayRug.name}</HeadingTag>
      <p className="rug-description">{displayRug.description}</p>
      <ul className="feature-list">
        {displayRug.features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="price-panel">
        <span>{t('product.from')}</span>
        <strong>{formatPrice(rug.priceFrom)}</strong>
        <small>{displayRug.size}</small>
      </div>
      <div className="color-row" aria-label={t('product.colorsAria')}>
        {rug.colors.map((color) => (
          <span
            className="color-swatch"
            style={{ '--swatch-color': color } as React.CSSProperties}
            aria-label={color}
            key={color}
          />
        ))}
      </div>
      <div className="button-row">
        <ButtonLink to={'/producto/' + encodeURIComponent(rug.slug)} variant="secondary">
          {t('product.details')}
        </ButtonLink>
        {onAction ? (
          <>
            <button
              className="button button-light"
              type="button"
              data-action="customize"
              data-rug-slug={rug.slug}
              onClick={onAction}
            >
              {t('product.customize')}
            </button>
            <button
              className="button button-ghost"
              type="button"
              data-action="similar"
              data-rug-slug={rug.slug}
              onClick={onAction}
            >
              {t('product.similar')}
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
