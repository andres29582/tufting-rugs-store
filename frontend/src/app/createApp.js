import { createHashRouter } from './router.js';
import { appRoutes } from './routes.js';
import {
  getFriendlyErrorMessage,
  renderAppErrorState,
  renderAppLoadingState
} from '../shared/components/AppState/AppState.js';

let activeCleanup = null;
let renderRunId = 0;

export async function createApp({ root }) {
  if (!root) {
    throw new Error('App root element was not found.');
  }

  const router = createHashRouter({
    routes: appRoutes,
    onRouteChange: function (routeContext) {
      void renderRoute(root, routeContext);
    }
  });

  router.start();
}

async function renderRoute(root, routeContext) {
  const currentRunId = ++renderRunId;
  cleanupActivePage();
  root.replaceChildren(renderAppLoadingState(getLoadingCopy(routeContext.route)));

  try {
    const page = await routeContext.route.render({
      params: routeContext.params,
      path: routeContext.path
    });

    if (currentRunId !== renderRunId) {
      destroyPage(page);
      return;
    }

    root.replaceChildren(page.element);
    setPageTitle(routeContext.route);

    const mountCleanup =
      typeof page.mount === 'function'
        ? page.mount({
            params: routeContext.params,
            path: routeContext.path
          })
        : null;

    activeCleanup = composeCleanup(page.destroy, mountCleanup);
  } catch (error) {
    if (currentRunId !== renderRunId) {
      return;
    }

    console.error('No se pudo cargar la página.', error);
    root.replaceChildren(
      renderAppErrorState({
        message: getFriendlyErrorMessage(error),
        onRetry: function () {
          void renderRoute(root, routeContext);
        }
      })
    );
  }
}

function cleanupActivePage() {
  if (typeof activeCleanup === 'function') {
    activeCleanup();
  }

  activeCleanup = null;
}

function destroyPage(page) {
  if (page && typeof page.destroy === 'function') {
    page.destroy();
  }
}

function composeCleanup(...callbacks) {
  const cleanups = callbacks.filter(function (callback) {
    return typeof callback === 'function';
  });

  if (!cleanups.length) {
    return null;
  }

  return function cleanupPage() {
    cleanups.forEach(function (cleanup) {
      cleanup();
    });
  };
}

function getLoadingCopy(route) {
  return {
    title: route && route.title ? 'Preparando ' + route.title.toLowerCase() : undefined
  };
}

function setPageTitle(route) {
  const title = route && route.title ? route.title : 'Inicio';
  document.title = title + ' | Tuft Atelier';
}
