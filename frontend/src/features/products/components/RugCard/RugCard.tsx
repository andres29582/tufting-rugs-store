import type { Product } from '../../../../shared/types';
import { IconButton, IconLink } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';
import { formatPrice } from '../../../../utils/money';
import { localizeProduct } from '../../productLocalization';
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
          <div className="mini-actions">
            <IconButton icon="favorite" type="button" aria-label={t('rugCard.favorite', { name: displayRug.name })} />
            <IconLink
              to={'/producto/' + encodeURIComponent(rug.slug)}
              icon="shoppingCart"
              aria-label={t('rugCard.details', { name: displayRug.name })}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
