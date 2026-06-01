import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';
import { formatPrice } from '../../../../utils/money';
import { localizeProduct } from '../../model/productLocalization';
import { RugVisualMockup } from '../RugVisualMockup/RugVisualMockup';

export function RugCard({ rug }: { rug: Product }) {
  const { language, t } = useTranslation();
  const displayRug = localizeProduct(rug, language);

  return (
    <article className="rug-card glass-panel" data-category={rug.category}>
      <div className="rug-card-media">
        <RugVisualMockup rug={displayRug} />
      </div>
      <div className="rug-card-body">
        <div>
          <p className="card-category">{displayRug.category}</p>
          <h3>{displayRug.name}</h3>
          <p>{displayRug.size}</p>
        </div>
        <div className="card-bottom">
          <strong>{formatPrice(rug.priceFrom)}</strong>
          <ButtonLink
            to={'/producto/' + encodeURIComponent(rug.slug)}
            variant="ghost"
            className="card-detail-link"
            aria-label={t('rugCard.details', { name: displayRug.name })}
          >
            {t('product.details')}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
