import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { formatPrice } from '../../../../utils/money';

type RugGlassInfoCardProps = {
  rug: Product;
  hero?: boolean;
  onAction?: (() => void) | undefined;
};

export function RugGlassInfoCard({ rug, hero = false, onAction }: RugGlassInfoCardProps) {
  const HeadingTag = hero ? 'h1' : 'h2';

  return (
    <article className="rug-info-card glass-panel">
      <p className="eyebrow">{rug.category} · Tufting hecho a mano</p>
      <HeadingTag id={'showcase-title-' + rug.slug}>{rug.name}</HeadingTag>
      <p className="rug-description">{rug.description}</p>
      <ul className="feature-list">
        {rug.features.map((feature) => (
          <li key={feature}>
            <span aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="price-panel">
        <span>Desde</span>
        <strong>{formatPrice(rug.priceFrom)}</strong>
        <small>{rug.size}</small>
      </div>
      <div className="color-row" aria-label="Colores principales">
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
          Ver detalles
        </ButtonLink>
        <button className="button button-light" type="button" data-action="customize" data-rug-slug={rug.slug} onClick={onAction}>
          Personalizar
        </button>
        <button className="button button-ghost" type="button" data-action="similar" data-rug-slug={rug.slug} onClick={onAction}>
          Quiero una parecida
        </button>
      </div>
    </article>
  );
}
