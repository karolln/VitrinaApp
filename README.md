# VitrinaApp

Backend de VitrinaApp (NestJS 10, Prisma 5, PostgreSQL 15), desplegado con Docker Compose y GitHub Actions.

## Ramas y entornos

| Rama | Entorno | Puerto | Se despliega con |
|------|---------|--------|------------------|
| `dev` | Desarrollo | 8082 | `.github/workflows/deploy.yml` |
| `main` | Producción | 8083 | `.github/workflows/deploy-prod.yml` |

Los dos entornos corren en el mismo servidor, pero con contenedores, volumen de base de datos y carpeta propios. Producción usa el proyecto de Docker `vitrina-prod`.

## Flujo de CI/CD

Cada push a `dev` o `main` ejecuta tres trabajos:

1. **test:** instala dependencias, genera el cliente de Prisma y corre `npm test` (pruebas unitarias y de integración con Jest y supertest).
2. **deploy:** solo si las pruebas pasan, entra por SSH al servidor, actualiza el código, construye la imagen y levanta los contenedores. En producción también aplica las migraciones de Prisma.
3. **notify:** escribe el resultado en el resumen de la ejecución y, si algo falló, abre un issue automático.

Si las pruebas fallan, no se despliega y el servidor conserva la versión anterior.

## Variables de entorno

El archivo `.env` no se sube al repositorio. En producción, el workflow lo genera en el servidor a partir de los *Secrets* de GitHub:

- `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_PORT`, `SSH_PASSPHRASE`: acceso al servidor.
- `PROD_DB_PASSWORD`, `PROD_JWT_SECRET`: contraseña de la base de datos y clave JWT de producción.

El puerto de la app se define con `APP_PORT` (por defecto 8082).

## Pruebas

```bash
cd vitrina-backend-nest
npm ci
npx prisma generate
npm test
```

## Documentación de la API

Swagger está disponible en `/docs`.