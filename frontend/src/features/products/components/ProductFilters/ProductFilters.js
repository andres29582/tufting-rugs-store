export function renderProductFilters(options) {
  const categories = options.categories || [];
  const onCategoryChange = options.onCategoryChange || function () {};
  let activeCategory = categories[0] || 'Todas';

  const group = document.createElement('div');
  group.className = 'category-filters';
  group.setAttribute('id', 'categorias');
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Filtrar por categoría');

  function setActive(category) {
    activeCategory = category;
    group.querySelectorAll('button').forEach(function (button) {
      const isActive = button.dataset.category === activeCategory;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  }

  categories.forEach(function (category) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'category-filter';
    button.dataset.category = category;
    button.textContent = category;
    button.setAttribute('aria-pressed', String(category === activeCategory));
    button.addEventListener('click', function () {
      setActive(category);
      onCategoryChange(category);
    });
    group.appendChild(button);
  });

  setActive(activeCategory);

  return {
    element: group,
    setActive
  };
}
