# Backend de Registro y Autenticación con NestJS y Google OAuth2

Este proyecto implementa un backend en NestJS con autenticación por Google OAuth2 y emisión de JWT para rutas protegidas.

## Requisitos

- Node.js 18 o superior
- npm
- una cuenta de Google Cloud Console
- una base de datos local compatible con TypeORM (en este proyecto se usa SQLite/SQL.js para desarrollo local)

## Variables de entorno

Crear un archivo `.env` en la raíz con este contenido:

```env
PORT=3000
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/redirect
JWT_SECRET=super_secret_key
JWT_EXPIRES_IN=1h
FRONTEND_REDIRECT_URL=http://localhost:4200/login-success
```

También existe un archivo `.env.example` con el mismo formato.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run start:dev
```

La app queda levantada en:

```bash
http://localhost:3000
```

## Flujo de autenticación

### 1) Login con Google

```http
GET /auth/google
```

Esto redirige al usuario a la pantalla de consentimiento de Google.

### 2) Callback de Google

```http
GET /auth/google/redirect
```

Si la autenticación es exitosa, el backend genera un JWT y redirige al frontend con el token por query param:

```http
http://localhost:4200/login-success?token=YOUR_JWT
```

### 3) Ruta protegida con JWT

```http
GET /auth/profile
Authorization: Bearer YOUR_JWT
```

Si el token es válido, retorna el perfil del usuario autenticado.

## Estructura principal

- `src/app.module.ts` — configuración global
- `src/auth/auth.controller.ts` — endpoints de autenticación
- `src/auth/auth.service.ts` — lógica de validación y generación de JWT
- `src/auth/google.strategy.ts` — estrategia OAuth2 de Google
- `src/auth/jwt-auth.guard.ts` — guard para rutas protegidas
- `src/users/user.entity.ts` — entidad de usuario
- `src/users/users.service.ts` — persistencia de usuarios

## Testing

```bash
npm test
```

## Build

```bash
npm run build
```

## Notas

- El proyecto ya está preparado para desarrollo local con SQLite/SQL.js.
- Para producción, se recomienda migrar la base de datos a PostgreSQL o MySQL.
- Las credenciales de Google no deben subirse al repositorio; se usan únicamente a través de variables de entorno.