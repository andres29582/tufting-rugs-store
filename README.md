# Tufting Rugs Store

Proyecto fullstack para una tienda de alfombras personalizadas hechas con tufting.

El repositorio contiene un storefront React/Vite y un backend NestJS con Prisma y
PostgreSQL. El estado publicado actualmente es frontend-first: Vercel sirve el
storefront estatico generado desde `frontend`, mientras que el backend queda
disponible en el repositorio para desarrollo local, administracion e integracion
API futura.

> Estado actual (Mayo 2026)
>
> El sitio publicado en Vercel funciona actualmente como un storefront estatico
> construido con React + Vite.
>
> El frontend utiliza datos mock para catalogo, personalizacion y flujo de
> pedidos.
>
> El backend NestJS, Prisma y PostgreSQL continua disponible dentro del
> repositorio, pero no forma parte del runtime actualmente desplegado en Vercel.
>
> La integracion frontend <-> API esta planificada para una version futura.

La V1 se enfoca en el flujo operativo basico:

```text
FULL_CUSTOM Product -> Customization -> Order -> AdminReview
```

No ejecuta generacion automatica de imagenes, Mercado Pago ni pagos
automaticos. El modelo queda preparado para esas etapas futuras, pero la V1
prioriza reglas de negocio claras, trazabilidad admin y una API estable para
una integracion frontend futura.

## Stack

- React
- Vite
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- REST API
- Jest
- Vitest
- Supertest para pruebas HTTP reales

## Modos de operación

| Modo | Estado | Descripcion |
| --- | --- | --- |
| Static storefront mode | Activo | Frontend React/Vite publicado en Vercel usando mocks. |
| API-integrated mode | Futuro | Frontend conectado a una API real mediante `apiUrl`. |
| Backend admin/API mode | Disponible en el repositorio | Backend NestJS + Prisma + PostgreSQL para administracion y operaciones. |

### Static storefront mode

Es el modo activo del sitio publicado. Vercel instala y compila la app dentro de
`frontend`:

```powershell
npm --prefix frontend install
npm --prefix frontend run build
```

Comandos locales del storefront:

```powershell
cd frontend
npm run dev
npm run build
npm run test -- --run
```

La salida publicada es:

```text
frontend/dist
```

En este modo, el frontend usa datos mock configurados en:

```text
frontend/src/app/config.ts
```

Esto permite operar el storefront publico sin ejecutar el backend.

### API-integrated mode

Este modo queda planificado para una version futura. La idea es que el frontend
deje de usar mocks y consuma una API real mediante `apiUrl`.

Para habilitarlo se debera ajustar la configuracion runtime del frontend en
`frontend/src/app/config.ts`, definir las variables de entorno necesarias y
validar los flujos contra endpoints reales.

### Backend admin/API mode

El backend esta disponible en el repositorio para desarrollo local,
administracion y operaciones. Usa NestJS, Prisma y PostgreSQL, y expone endpoints
para productos, personalizaciones, pedidos y admin.

Comandos principales desde la raiz:

```powershell
npm install
npm run db:migrate
npm run dev
npm run build
npm start
```

Por defecto la API escucha en:

```text
http://localhost:3001
```

## Requisitos

- Node.js instalado
- npm instalado
- PostgreSQL corriendo localmente
- Una base de datos PostgreSQL para el proyecto

En desarrollo local usamos por defecto:

```text
host: localhost
port: 5432
database: custom_tufting_rugs
user: postgres
```

La password depende de tu instalacion local de PostgreSQL.

## Instalacion

Desde la carpeta del proyecto:

```powershell
cd "C:\Users\andre\OneDrive\Documentos\New project"
npm install
```

## Configuracion de .env

Crea un archivo `.env` en la raiz del proyecto.

Ejemplo:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/custom_tufting_rugs?schema=public"
JWT_SECRET="local-development-secret-for-tufting-rugs-store"
ADMIN_EMAIL="admin@rugs.local"
ADMIN_PASSWORD="admin123"
```

Notas importantes:

- `.env` no se sube a GitHub.
- `.env.example` si se versiona como referencia.
- `admin@rugs.local` y `admin123` son credenciales solo para desarrollo local.
- En produccion se deben usar `ADMIN_EMAIL`, `ADMIN_PASSWORD` y `JWT_SECRET` fuertes.
- En produccion, el sistema bloquea secretos debiles como `secret`, `admin`, `password` o `change-me`.

## Crear la base de datos

Opcion con pgAdmin:

1. Abrir pgAdmin.
2. Entrar al servidor local.
3. Click derecho en `Databases`.
4. Crear una base llamada:

```text
custom_tufting_rugs
```

Opcion con SQL:

```sql
CREATE DATABASE custom_tufting_rugs;
```

Opcion con `createdb`:

```powershell
createdb -h localhost -p 5432 -U postgres custom_tufting_rugs
```

Si `createdb` no esta en el PATH, en Windows suele estar en:

```text
C:\Program Files\PostgreSQL\18\bin\createdb.exe
```

## Migraciones Prisma

Para aplicar migraciones en desarrollo:

```powershell
npm run db:migrate
```

Para revisar el estado de la base:

```powershell
npm run db:status
```

Para regenerar Prisma Client:

```powershell
npx prisma generate
```

La migracion inicial esta en:

```text
prisma/migrations/20260430033530_init/migration.sql
```

## Ejecutar el backend

Modo desarrollo con recarga automatica:

```powershell
npm run dev
```

Este comando usa `nest start --watch` a traves de `@nestjs/cli`, instalado como dependencia de desarrollo del proyecto. No necesitas instalar Nest CLI globalmente.

Modo compilado:

```powershell
npm run build
```

Luego ejecuta:

```powershell
npm start
```

Por defecto la API escucha en:

```text
http://localhost:3001
```

El puerto se puede cambiar con:

```env
PORT=3002
```

## Seeds locales

Al arrancar la app se crean datos minimos si no existen.

Admin local:

```text
email: admin@rugs.local
password: admin123
```

Producto ancla:

```text
name: Alfombra 100% Personalizada
slug: alfombra-100-personalizada
type: FULL_CUSTOM
basePriceCents: 22000
sizeCategory: CUSTOM
sizeLabel: Sob orçamento
format: CUSTOM
```

Este producto no representa una alfombra lista para compra directa. Es la entrada del catalogo hacia el formulario de personalizacion.

## Tests

Tests unitarios:

```powershell
npm test
```

Tests HTTP reales contra Nest + PostgreSQL local:

```powershell
npm run test:e2e
```

Requests manuales:

```text
docs/api-examples.http
```

Ese archivo contiene ejemplos ejecutables para probar login admin, productos, personalizaciones, pedidos, review admin, deposito y casos invalidos. Se puede usar con la extension REST Client de VS Code o como referencia para Postman/Insomnia.

Build:

```powershell
npm run build
```

Chequeo recomendado antes de subir cambios:

```powershell
npm run test:all
npm run build
npm run db:status
```

## Endpoints principales

### Admin auth

Login admin:

```http
POST /admin/auth/login
Content-Type: application/json

{
  "email": "admin@rugs.local",
  "password": "admin123"
}
```

Respuesta:

```json
{
  "accessToken": "...",
  "admin": {
    "id": "...",
    "email": "admin@rugs.local",
    "role": "ADMIN"
  }
}
```

Las rutas admin usan:

```http
Authorization: Bearer ACCESS_TOKEN
```

### Products

Publicos:

```http
GET /products
GET /products/:id
```

Admin:

```http
POST /products
PATCH /products/:id
PATCH /products/:id/deactivate
```

Regla importante:

- `FULL_CUSTOM` puede existir en el catalogo.
- `FULL_CUSTOM` no permite crear `Order` directo sin `Customization`.

### Customizations

Crear una personalizacion publica:

```http
POST /customizations
Content-Type: application/json

{
  "productId": "FULL_CUSTOM_PRODUCT_ID",
  "customerName": "Ana",
  "customerEmail": "ana@example.com",
  "customerPhone": "555",
  "description": "Quiero una alfombra con mi logo",
  "preferredColors": ["red", "blue"],
  "designReferences": [
    {
      "url": "https://example.com/reference.png",
      "originalName": "reference.png"
    }
  ]
}
```

Reglas:

- `productId` es obligatorio en V1.
- El producto debe estar activo.
- El producto debe ser `FULL_CUSTOM`.
- `preferredColors` es `String[]`.
- Colores repetidos se normalizan en backend.
- `DesignReference` queda como entidad generica para referencias visuales presentes y futuras.

Crear pedido desde una personalizacion:

```http
POST /customizations/:id/order
Content-Type: application/json

{
  "estimatedPriceCents": 22000,
  "notes": "Pedido creado desde solicitud personalizada"
}
```

Regla:

- Una `Customization` solo puede generar un `Order`.
- Prisma lo refuerza con `Order.customizationId @unique`.

Admin:

```http
GET /customizations
GET /customizations/:id
```

### Orders

Crear pedido directo:

```http
POST /orders
```

Reglas:

- Debe tener `productId` o `customizationId`.
- Puede tener ambos.
- No puede crearse sin ninguno.
- Si el producto es `FULL_CUSTOM`, debe existir `customizationId`.

Admin:

```http
GET /orders
GET /orders/:id
PATCH /orders/:id/status
PATCH /orders/:id/final-price
PATCH /orders/:id/confirm-deposit
PATCH /orders/:id/review
```

Confirmar deposito:

```http
PATCH /orders/:id/confirm-deposit
Authorization: Bearer ACCESS_TOKEN
```

Reglas:

- Solo funciona si el pedido esta en `WAITING_DEPOSIT`.
- Actualiza juntos:

```text
depositPaid = true
status = DEPOSIT_CONFIRMED
```

- `DEPOSIT_CONFIRMED` no puede setearse desde `PATCH /orders/:id/status`.
- `DEPOSIT_CONFIRMED` no puede setearse desde `PATCH /orders/:id/review`.

Review admin:

```http
PATCH /orders/:id/review
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json

{
  "status": "WAITING_CUSTOMER_APPROVAL",
  "productionPossible": true,
  "estimatedPriceCents": 24000,
  "finalPriceCents": 31001,
  "comment": "Cotizacion final lista para aprobacion del cliente."
}
```

Este endpoint actualiza el pedido y crea un `AdminReview` historico en la misma transaccion.

## Flujo de negocio V1

### 1. Catalogo

El cliente ve productos publicos con:

```http
GET /products
```

Entre ellos existe el producto ancla:

```text
Alfombra 100% Personalizada
type: FULL_CUSTOM
```

### 2. Personalizacion

El cliente entra por ese producto y crea una solicitud:

```http
POST /customizations
```

Aqui se guardan:

- datos del cliente;
- descripcion;
- colores preferidos;
- referencias visuales;
- formato;
- tamano/categoria.

### 3. Pedido

Desde la solicitud se crea un pedido:

```http
POST /customizations/:id/order
```

El pedido nace en:

```text
WAITING_ANALYSIS
```

### 4. Revision admin

El admin entra, revisa el pedido y usa:

```http
PATCH /orders/:id/review
```

Cada review:

- puede cambiar estado;
- puede marcar si se puede producir;
- puede definir precio estimado;
- puede definir precio final;
- recalcula adelanto si corresponde;
- guarda comentario;
- crea `AdminReview`.

La operacion es transaccional: si falla una parte, no se guarda nada parcial.

### 5. Aprobacion y adelanto

Cuando el pedido llega a `WAITING_DEPOSIT`, el deposito se confirma con:

```http
PATCH /orders/:id/confirm-deposit
```

Ese endpoint es el unico camino permitido hacia:

```text
DEPOSIT_CONFIRMED
```

## Estados principales de Order

```text
WAITING_ANALYSIS
IN_ANALYSIS
WAITING_CUSTOMER_APPROVAL
APPROVED
WAITING_DEPOSIT
DEPOSIT_CONFIRMED
DESIGN_APPROVED
IN_PRODUCTION
READY_FOR_DELIVERY
DELIVERED
CANCELED
```

Reglas importantes:

- `CANCELED` es final.
- `DELIVERED` es final.
- Cancelacion comun no esta permitida despues de `IN_PRODUCTION`.
- Si `productionPossible = false`, el pedido solo puede quedar en `IN_ANALYSIS` o `CANCELED`.
- `DEPOSIT_CONFIRMED` solo se alcanza con `confirm-deposit`.

## Precios

Todos los precios se guardan como enteros en centavos.

Ejemplo:

```text
22000 = 220.00
```

Campos relevantes:

```text
estimatedPriceCents
finalPriceCents
depositAmountCents
```

Regla:

```text
depositAmountCents = Math.round(finalPriceCents / 2)
```

Si no hay `finalPriceCents`, se usa `estimatedPriceCents` para calcular el deposito inicial.

## Decisiones de dominio

- Enums internos en ingles.
- Traducciones solo en UI futura.
- `preferredColors` es `String[]`, no texto plano.
- `sizeCategory` y `sizeLabel` estan separados.
- `DesignReference` es generico para referencias actuales y futuras.
- `AdminReview` es historico 1:N.
- Admin esta protegido desde V1.
- `AdminModule` mantiene autenticacion y proteccion.
- `FULL_CUSTOM` se modela como producto ancla, no como producto listo.

## Comandos utiles

```powershell
npm install
npm run db:migrate
npm run dev
npm test
npm run test:e2e
npm run test:all
npm run build
npm start
```

## Estado actual

Storefront publico actual:

- frontend React/Vite publicado como sitio estatico;
- build de Vercel apuntando a `frontend/dist`;
- datos mock para catalogo, personalizacion y flujo de pedidos;
- guia de IA externa para ayudar a crear referencias visuales;
- contacto y continuidad del pedido orientados a WhatsApp.

Backend disponible en el repo:

- schema Prisma;
- migracion inicial;
- seed admin local;
- seed producto `FULL_CUSTOM`;
- endpoints REST principales;
- DTO validation;
- admin auth;
- admin review historico;
- tests unitarios;
- tests e2e HTTP contra PostgreSQL local.
