# VitrinaApp — Backend (NestJS)


Backend de VitrinaApp construido con **NestJS**, reemplazando la versión inicial en Express por una arquitectura más estructurada (módulos, inyección de dependencias, validación automática y documentación Swagger).

## Stack

- **NestJS** (sobre Node.js + Express internamente) — framework backend con arquitectura modular
- **TypeScript** — tipado estático
- **PostgreSQL + Prisma** — base de datos relacional y ORM
- **class-validator** — validación automática de los datos que llegan en cada petición
- **Swagger (@nestjs/swagger)** — documentación interactiva de la API, generada automáticamente
- **Jest** (integrado con `@nestjs/testing`) — pruebas unitarias con inyección de dependencias simulada

## Por qué NestJS y no Express "plano"

- **Módulos por dominio**: `producto`, `negocio`, `onboarding` — cada uno con su controller, service y tests, igual que antes, pero ahora con inyección de dependencias real (más fácil de simular en las pruebas).
- **Documentación automática**: al levantar el servidor, `/docs` muestra todos los endpoints, sus parámetros y respuestas — sin escribirla a mano.
- **Validación automática**: los DTOs (`CrearProductoDto`, etc.) validan los datos de entrada antes de que lleguen al controller; si falta un campo obligatorio, Nest responde 400 automáticamente con el detalle del error.

## Estructura de carpetas

```
vitrina-backend-nest/
├── prisma/
│   └── schema.prisma          # Modelo de datos: Usuario, Negocio, Producto
├── src/
│   ├── main.ts                 # Punto de entrada + configuración de Swagger
│   ├── app.module.ts           # Módulo raíz, importa los módulos de dominio
│   ├── prisma/
│   │   ├── prisma.service.ts   # Cliente de Prisma inyectable
│   │   └── prisma.module.ts
│   ├── producto/                # HU-05, HU-08, HU-09
│   │   ├── dto/crear-producto.dto.ts
│   │   ├── producto.controller.ts
│   │   ├── producto.service.ts
│   │   ├── producto.service.spec.ts
│   │   └── producto.module.ts
│   ├── negocio/                 # HU-10, HU-12
│   │   ├── negocio.controller.ts
│   │   ├── negocio.service.ts
│   │   ├── negocio.service.spec.ts
│   │   └── negocio.module.ts
│   └── onboarding/              # Extra: recorrido guiado (no numerada en el backlog oficial de Jira)
│       ├── onboarding.controller.ts
│       ├── onboarding.service.ts
│       ├── onboarding.service.spec.ts
│       └── onboarding.module.ts
```

Cada módulo es independiente: un integrante puede trabajar en `producto/` mientras otro trabaja en `negocio/` sin generar conflictos de merge.

## Cómo correrlo

```bash
npm install
npx prisma generate
cp .env.example .env          # completar DATABASE_URL con su Postgres
npx prisma migrate dev --name init
npm run start:dev             # http://localhost:3000
```

Documentación interactiva (Swagger) disponible en **http://localhost:3000/docs** una vez levantado el servidor.

> Nota: `npx prisma generate` necesita descargar el motor de Prisma desde internet la primera vez. Si tu red corporativa/universitaria lo bloquea, prueba desde otra red o revisa la documentación de Prisma sobre binarios.

## Cómo correr las pruebas

```bash
npm test
```

13 pruebas unitarias, 100% de cobertura en la lógica de negocio (`producto.service`, `negocio.service`, `onboarding.service`). Usan `@nestjs/testing` con `PrismaService` simulado, por lo que no requieren una base de datos real.

## Endpoints implementados

| Método | Ruta                              | Historia | Descripción |
|--------|------------------------------------|----------|-------------|
| POST   | /api/productos                     | HU-05    | Crear producto con foto |
| GET    | /api/productos/negocio/:negocioId  | HU-09    | Listar productos de un negocio |
| PATCH  | /api/productos/:id/estado          | HU-08    | Alternar disponible/agotado |
| GET    | /api/negocios/:id                  | HU-10    | Perfil público del negocio |
| GET    | /api/negocios/buscar?nombre=&barrio= | HU-12  | Buscar negocios |
| GET    | /api/onboarding/:usuarioId         | Extra    | Consultar estado de onboarding |
| POST   | /api/onboarding/:usuarioId/completar | Extra  | Completar/saltar onboarding |

## Flujo de Git sugerido

Igual al de la versión anterior: rama por historia de usuario (`feature/hu-01-agregar-producto`, etc.), PR a `main` con revisión cruzada, y `main` solo recibe código con `npm test` en verde.
