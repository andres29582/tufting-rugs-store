export function createHashRouter({ routes, onRouteChange }) {
  function start() {
    window.addEventListener('hashchange', handleRouteChange);

    if (!window.location.hash || !isRouteHash(window.location.hash)) {
      navigate('/');
      return;
    }

    handleRouteChange();
  }

  function navigate(path) {
    window.location.hash = '#' + normalizePath(path);
  }

  function handleRouteChange() {
    if (!isRouteHash(window.location.hash)) {
      return;
    }

    onRouteChange(resolveRoute(window.location.hash));
  }

  function resolveRoute(hash) {
    const path = normalizePath(hash.replace(/^#/, ''));
    const match = findRouteMatch(routes, path) || findRouteMatch(routes, '*');

    return {
      params: match.params,
      path,
      route: match.route
    };
  }

  return {
    navigate,
    start
  };
}

function findRouteMatch(routes, path) {
  for (const route of routes) {
    const params = matchPath(route.path, path);

    if (params) {
      return {
        params,
        route
      };
    }
  }

  return null;
}

function matchPath(pattern, path) {
  if (pattern === '*') {
    return {};
  }

  const patternSegments = normalizePath(pattern).split('/').filter(Boolean);
  const pathSegments = normalizePath(path).split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return null;
  }

  return patternSegments.reduce(function (params, segment, index) {
    if (params === null) {
      return null;
    }

    const value = pathSegments[index];

    if (segment.startsWith(':')) {
      params[segment.slice(1)] = decodeURIComponent(value);
      return params;
    }

    return segment === value ? params : null;
  }, {});
}

function isRouteHash(hash) {
  return !hash || hash.startsWith('#/');
}

function normalizePath(path) {
  if (!path || path === '#') {
    return '/';
  }

  const normalizedPath = path.startsWith('/') ? path : '/' + path;

  if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
    return normalizedPath.slice(0, -1);
  }

  return normalizedPath;
}
