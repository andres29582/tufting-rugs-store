# System Improvement Plan - Tuft Atelier

Este plan describe el estado real del proyecto despues de la estabilizacion de
CI y documentacion realizada sobre el storefront de alfombras.

## Objetivo actual

Mantener estable el producto publico sin ampliar alcance todavia.

El alcance activo es:

- Storefront React/Vite estatico desplegado en Vercel.
- Arquitectura frontend-only con `HashRouter`.
- Datos locales/mock para catalogo, personalizacion y flujo publico.
- Conversion y continuidad de pedidos por WhatsApp.
- Backend NestJS/Prisma disponible en el repositorio para desarrollo futuro.
- Admin, orders y API real preparados en codigo, pero no activos en produccion.

La prioridad de producto ahora es el storefront publico: home, catalogo,
detalle de producto, personalizacion y WhatsApp.

## Estado implementado

### Produccion actual

- Vercel instala y compila el frontend.
- La salida publica es `frontend/dist`.
- El deploy publico no depende de backend activo.
- El enrutamiento publico usa `HashRouter`.
- Los clientes navegan catalogo/mock y envian solicitudes por WhatsApp.
- El numero de WhatsApp esta centralizado en `frontend/src/shared/config/contact.ts`.

### Calidad y CI

Ya fue implementado:

- Scripts frontend para `test:run`, `typecheck`, `lint`, `format`,
  `format:check`, `test:e2e` y `analyze`.
- ESLint configurado con TypeScript y React Hooks.
- Prettier configurado para el frontend.
- Vitest configurado para unit tests sin incluir E2E.
- Playwright configurado con pruebas E2E minimas de storefront.
- GitHub Actions en `.github/workflows/ci.yml`.
- CI separado para backend y frontend.
- Build/test/lint/typecheck/format/E2E validados.
- Web Vitals liviano con carga dinamica y logging tecnico controlado.
- Bundle analysis opcional con `rollup-plugin-visualizer`.

### Documentacion

Ya fue documentado:

- Modo frontend-only en `README.md`.
- Arquitectura de produccion en `docs/frontend-only-architecture.md`.
- Rutas publicas activas.
- Modulos legacy/backend-ready que no deben activarse sin backend configurado.
- Checks recomendados antes de deploy.

### Verificacion reciente

Comandos verificados durante la estabilizacion:

```powershell
npm test -- --runInBand
npm run build
npm --prefix frontend run format:check
npm --prefix frontend run test:run
npm --prefix frontend run test:e2e
npm --prefix frontend run typecheck
npm --prefix frontend run lint
npm --prefix frontend run build
```

Nota local: en este entorno, Vite/Vitest/Playwright pueden fallar dentro del
sandbox con errores `spawn EPERM` o permisos sobre `test-results`. Cuando eso
ocurre, las mismas verificaciones pasan fuera del sandbox o con permisos
aprobados.

## Pendiente inmediato

### 1. Metadata publica para asistentes IA

Archivo: `frontend/public/llms.txt`.

Acciones:

- Revisar el contenido orientado a WhatsApp.
- Corregir la lista de tamanos donde quedo una linea suelta.
- Confirmar que las instrucciones no prometen capacidades no presentes en el
  storefront.

Commit sugerido:

```text
docs(frontend): update llms metadata
```

### 2. Configuracion runtime frontend-only

Archivo: `frontend/src/app/config.ts`.

Acciones:

- Revisar que la configuracion exprese claramente el modo frontend-only.
- Mantener mocks activos para catalogo y personalizacion.
- Mantener API/admin/orders reales desactivados en produccion.
- Evitar que variables legacy sugieran integracion API activa.

Commit sugerido:

```text
chore(frontend): lock frontend-only runtime config
```

### 3. Storefront publico

Areas prioritarias:

- Home.
- Catalogo.
- Detalle de producto.
- Flujo de personalizacion.
- Integracion WhatsApp.
- Guia IA/manual para referencia visual.

Objetivo:

- Mejorar conversion sin activar backend.
- Mantener copy, UI y rutas coherentes con el flujo publico actual.
- Asegurar que cada cambio tenga test o verificacion proporcional.

## Pendiente no inmediato

### Backend/API

No es prioridad inmediata.

El backend NestJS/Prisma sigue siendo util para desarrollo futuro, pero la
produccion actual no debe depender de el. Antes de activar API real:

- Definir `VITE_API_URL`.
- Revisar CORS.
- Ajustar CSP `connect-src`.
- Decidir persistencia real de productos, personalizaciones y pedidos.
- Probar admin y orders de punta a punta.
- Actualizar documentacion de despliegue.

### Admin y orders

No deben activarse en rutas publicas todavia.

Antes de habilitarlos:

- Confirmar backend disponible.
- Validar auth admin.
- Revisar permisos y secretos.
- Probar carga, edicion y publicacion de productos.
- Probar review de pedidos y estados.

### Performance avanzada

Pendiente para una fase posterior:

- Baseline Lighthouse.
- Revision de imagenes y assets.
- Definir destino real para metricas Web Vitals en produccion.
- Revisar bundle si supera objetivos.

### Seguridad

Pendiente:

- Ejecutar `npm audit` en root y frontend.
- Revisar CSP si se agregan assets externos o API real.
- Mantener `.env` fuera de git.
- No documentar deploy con secrets si no estan configurados.

## Principios de trabajo

- Separar commits por responsabilidad.
- No mezclar UI, API, docs y tooling en un mismo commit.
- No activar admin/API sin una decision explicita.
- Mantener `HashRouter` mientras el deploy sea estatico en Vercel.
- Mantener WhatsApp como canal principal de conversion en esta fase.
- Preferir cambios verificables y pequenos.

## Orden recomendado desde este punto

1. Revisar y commitear `frontend/public/llms.txt`.
2. Revisar y commitear `frontend/src/app/config.ts`.
3. Agrupar cambios de personalizacion/WhatsApp.
4. Agrupar cambios de catalogo/producto.
5. Agrupar mejoras de UI/estilos compartidos.
6. Dejar admin/orders/API para una fase separada.

## Definicion de listo para la fase actual

La fase actual se considera ordenada cuando:

- CI pasa.
- Documentacion refleja el modo frontend-only real.
- Metadata publica no promete capacidades inexistentes.
- Runtime config coincide con produccion estatica/mock.
- Storefront publico y WhatsApp quedan priorizados.
- Admin/API/orders permanecen como futuro, no como dependencia del deploy.
