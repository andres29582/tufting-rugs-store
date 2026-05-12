import type { Product } from '../../../../shared/types';
import { IconButton, IconLink } from '../../../../shared/components/Button/Button';
import { formatPrice } from '../../../../utils/money';
import { RugVisualMockup } from '../RugVisualMockup/RugVisualMockup';

export function RugCard({ rug }: { rug: Product }) {
  return (
    <article className="rug-card glass-panel" data-category={rug.category}>
      <div className="rug-card-media">
        <RugVisualMockup rug={rug} />
      </div>
      <div className="rug-card-body">
        <div>
          <p className="card-category">{rug.category}</p>
          <h3>{rug.name}</h3>
          <p>{rug.size}</p>
        </div>
        <div className="card-bottom">
          <strong>{formatPrice(rug.priceFrom)}</strong>
          <div className="mini-actions">
            <IconButton icon="favorite" type="button" aria-label={'Agregar ' + rug.name + ' a favoritos'} />
            <IconLink
              to={'/producto/' + encodeURIComponent(rug.slug)}
              icon="shoppingCart"
              aria-label={'Ver detalles de ' + rug.name}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
