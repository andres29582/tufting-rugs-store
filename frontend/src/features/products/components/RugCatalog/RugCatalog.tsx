import type { Product } from '../../../../shared/types';
import { ButtonLink } from '../../../../shared/components/Button/Button';
import { RugCard } from '../RugCard/RugCard';

type RugCatalogProps = {
  rugs: Product[];
  query: string;
  category: string;
};

export function RugCatalog({ rugs, query, category }: RugCatalogProps) {
  const categoryText = category && category !== 'Todas' ? ' en ' + category : '';
  const queryText = query ? ' para "' + query + '"' : '';

  return (
    <section id="catalogo" className="catalog-section">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">Catálogo destacado</p>
          <h2>Alfombras únicas, hechas para inspirar</h2>
        </div>
        <ButtonLink to="/personalizar" variant="ghost">
          Quiero personalizar la mía
        </ButtonLink>
      </div>
      <p className="result-summary" aria-live="polite">
        {rugs.length} resultado{rugs.length === 1 ? '' : 's'}
        {categoryText}
        {queryText}
      </p>
      <div className="catalog-grid">
        {rugs.length ? rugs.map((rug) => <RugCard rug={rug} key={rug.id} />) : <EmptyState />}
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="empty-state glass-panel">
      <h3>No encontramos una alfombra con esos filtros</h3>
      <p>Prueba con otra categoría o busca por un nombre más corto.</p>
    </div>
  );
}
