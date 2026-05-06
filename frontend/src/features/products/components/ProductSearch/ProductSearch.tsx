import { IconButton } from '../../../../shared/components/Button/Button';

type ProductSearchProps = {
  query: string;
  onSearch: (query: string) => void;
  onSubmit?: () => void;
};

export function ProductSearch({ query, onSearch, onSubmit }: ProductSearchProps) {
  return (
    <form
      className="search-bar"
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        onSubmit?.();
      }}
    >
      <label className="sr-only" htmlFor="rug-search">
        Buscar alfombra por nombre
      </label>
      <input
        id="rug-search"
        type="search"
        autoComplete="off"
        placeholder="Buscar por nombre..."
        value={query}
        onChange={(event) => onSearch(event.currentTarget.value)}
      />
      <IconButton icon="search" type="submit" className="search-submit" aria-label="Buscar" />
    </form>
  );
}
