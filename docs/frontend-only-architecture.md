# Frontend-only architecture

This document captures the current production shape of the storefront while the backend is not active.

## Public routes

The frontend uses `HashRouter`, so public navigation is served from the static Vercel build:

- `/` renders the home storefront.
- `/catalogo` renders the public catalog.
- `/producto/:slug` renders a product detail page.
- `/personalizar` renders the personalization flow.
- `/como-funciona` renders home and scrolls to the process section.
- `/solicitud/:id` renders the legacy success page.
- `/inicio` redirects to `/`.
- `*` renders the not found page.

## Current customer flow

1. Home introduces the brand and featured rugs.
2. Catalog shows local mock products.
3. Product detail can send a product reference to WhatsApp.
4. Personalization starts with the AI/manual gate and then the guided form.
5. The final guided summary opens WhatsApp with the prepared message.

Header, footer, product detail, AI reference, and the customization form are the active WhatsApp entry points.

## Active frontend modules

- `frontend/src/app`: route wiring and app shell.
- `frontend/src/pages`: public pages for home, catalog, product detail, personalization, success, and not found.
- `frontend/src/features/products`: mock catalog data, product localization, catalog cards, showcase, and product visuals.
- `frontend/src/features/customizations`: guided customization form and WhatsApp summary generation.
- `frontend/src/features/aiDesign`: external-AI prompt guide and WhatsApp reference handoff.
- `frontend/src/shared/config`: shared contact configuration, including the single WhatsApp number source.
- `frontend/src/shared/i18n`: Spanish and Portuguese UI copy.
- `frontend/src/shared/styles`: global tokens and component styles.

## Legacy or backend-ready modules

These modules remain in the repo but should not be enabled for production without a configured backend:

- Root Nest/Prisma backend in `src`, `prisma`, and related tests.
- Admin pages and admin feature modules under `frontend/src/pages/Admin*` and `frontend/src/features/admin`.
- Orders feature modules under `frontend/src/features/orders`.
- API clients and mappers for products, orders, and customizations.
- Backend-oriented fixtures/builders and draft persistence utilities.

## Do not touch for now

- Do not change `HashRouter` or the route structure.
- Do not enable real API calls in production.
- Do not activate admin or order management flows.
- Do not change Vercel config unless the deployment root changes.
- Do not edit global CSS tokens or visible copy without an explicit visual/content phase.
- Do not duplicate the WhatsApp number outside `frontend/src/shared/config/contact.ts`.

## Predeploy checks

Run these before deploying frontend-only changes:

```powershell
npm --prefix frontend run typecheck
npm --prefix frontend run build
npm --prefix frontend test -- --run
rg -n "5541985291212" frontend/src
rg -n "Ã|Â|â|�" frontend/public frontend/src
```

Expected results:

- Typecheck passes.
- Build passes. If local sandbox blocks esbuild with `spawn EPERM`, rerun the build with approved elevated permissions.
- Tests pass without requiring a backend.
- The WhatsApp number appears only in `frontend/src/shared/config/contact.ts`.
- The mojibake scan returns no matches.
