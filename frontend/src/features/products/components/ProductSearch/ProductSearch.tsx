import { IconButton } from '../../../../shared/components/Button/Button';
import { useTranslation } from '../../../../shared/i18n';

type ProductSearchProps = {
  query: string;
  onSearch: (query: string) => void;
  onSubmit?: () => void;
};

export function ProductSearch({ query, onSearch, onSubmit }: ProductSearchProps) {
  const { t } = useTranslation();

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
        {t('search.label')}
      </label>
      <input
        id="rug-search"
        type="search"
        autoComplete="off"
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(event) => onSearch(event.currentTarget.value)}
      />
      <IconButton
        icon="search"
        type="submit"
        className="search-submit"
        aria-label={t('search.submit')}
      />
    </form>
  );
}
