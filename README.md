<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Teslo Shop API</h1>

<p align="center">
  API REST para la gestión de productos de una tienda de ropa, con autenticación JWT, control de acceso por roles y carga de imágenes. Construida con <b>NestJS</b>, <b>TypeORM</b> y <b>PostgreSQL</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Passport-34E27A?style=flat&logo=passport&logoColor=white" alt="Passport" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Descripción

Teslo Shop API es el backend de una tienda de ropa. Permite registrar usuarios, iniciar sesión con JWT y gestionar productos con su título, slug, precio, stock, descripción, género, tallas, etiquetas e imágenes.

Cada producto guarda qué usuario lo creó o lo editó por última vez. Las acciones de escritura están restringidas por rol, y las imágenes se suben al servidor y se consultan por URL.

## Características

- **Autenticación con JWT** (registro, login y revalidación del token)
- **Contraseñas cifradas** con bcrypt
- **Autorización por roles** (`admin`, `super-user`, `user`) con un decorador propio `@Auth()` que combina guards y metadata
- Usuarios inactivos bloqueados aunque tengan un token válido
- CRUD de productos con paginación y búsqueda por id, slug o título
- Actualización de productos e imágenes dentro de una **transacción** con rollback
- Relación usuario → productos para saber quién creó cada uno
- Carga de imágenes con validación de formato y nombres únicos con UUID
- Seed que crea usuarios y productos de prueba
- Base de datos en Docker

## Requisitos

- Node.js 18 o superior
- Yarn
- Docker y Docker Compose

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/Leandrop011/Teslo-Store-Backend.git
cd Teslo-Store-Backend
```

2. Instalar dependencias:

```bash
yarn install
```

3. Copiar `.env.template`, renombrarlo a `.env` y ajustar las variables.

4. Levantar la base de datos:

```bash
docker compose up -d
```

5. Levantar el servidor en modo desarrollo:

```bash
yarn start:dev
```

6. Poblar la base de datos con datos de prueba:

```
GET http://localhost:3000/api/seed
```

> El seed **borra todos los usuarios y productos** antes de insertar los nuevos.

## Usuarios de prueba

Después de ejecutar el seed puedes iniciar sesión con:

| Email              | Contraseña | Rol     |
| ------------------ | ---------- | ------- |
| `test1@google.com` | `Test123`  | `admin` |
| `test2@google.com` | `Test123 v2` | `admin` |

## Variables de entorno

| Variable         | Descripción                                          | Ejemplo                     |
| ---------------- | ---------------------------------------------------- | --------------------------- |
| `DB_PASSWORD`    | Contraseña de PostgreSQL                             | `MySecretPassword`          |
| `DB_NAME`        | Nombre de la base de datos                           | `TesloDb`                   |
| `DB_HOST`        | Host de la base de datos                             | `localhost`                 |
| `DB_PORT`        | Puerto de la base de datos                           | `5432`                      |
| `DB_USERNAME`    | Usuario de la base de datos                          | `postgres`                  |
| `PORT`           | Puerto del servidor                                  | `3000`                      |
| `HOST_API`       | URL base de la API, se usa para armar la URL de las imágenes | `http://localhost:3000/api` |
| `JWT_SECRET`     | Clave secreta para firmar los tokens                 | `una-clave-larga-y-segura`  |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token                       | `2h`                        |

## Autenticación

Al registrarte o iniciar sesión la API devuelve un `token`. Envíalo en cada petición protegida:

```
Authorization: Bearer <token>
```

Ejemplo de login:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test1@google.com", "password": "Test123"}'
```

```json
{
  "id": "6f1c0e0a-2c1b-4c63-9a3e-2b7d9f5e8a10",
  "email": "test1@google.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

La contraseña debe tener entre 6 y 50 caracteres, con al menos una mayúscula, una minúscula y un número o símbolo.

## Endpoints

Base URL: `http://localhost:3000/api`

### Auth

| Método | Ruta                       | Acceso      | Descripción                       |
| ------ | -------------------------- | ----------- | --------------------------------- |
| POST   | `/auth/register`           | Público     | Registra un usuario               |
| POST   | `/auth/login`              | Público     | Inicia sesión y devuelve un token |
| GET    | `/auth/check-auth-status`  | Autenticado | Revalida la sesión y renueva el token |

### Productos

| Método | Ruta                            | Acceso                 | Descripción                         |
| ------ | ------------------------------- | ---------------------- | ----------------------------------- |
| GET    | `/products?limit=10&offset=0`   | Autenticado            | Lista productos con paginación      |
| GET    | `/products/:term`               | Autenticado            | Busca por id, slug o título         |
| POST   | `/products`                     | `admin`                | Crea un producto                    |
| PATCH  | `/products/:id`                 | `admin`                | Actualiza un producto               |
| DELETE | `/products/:id`                 | `admin`, `super-user`  | Elimina un producto                 |

### Archivos

| Método | Ruta                          | Acceso                 | Descripción                       |
| ------ | ----------------------------- | ---------------------- | --------------------------------- |
| POST   | `/files/product`              | `admin`, `super-user`  | Sube una imagen de producto       |
| GET    | `/files/product/:imageName`   | Autenticado            | Devuelve una imagen por su nombre |

### Seed

| Método | Ruta    | Acceso  | Descripción                         |
| ------ | ------- | ------- | ----------------------------------- |
| GET    | `/seed` | Público | Reinicia la base con datos de prueba |

## Subida de imágenes

`POST /files/product` recibe la imagen como `multipart/form-data` en el campo **`file`**.

```bash
curl -X POST http://localhost:3000/api/files/product \
  -H "Authorization: Bearer <token>" \
  -F "file=@./mi-imagen.jpg"
```

La API valida que sea `jpg`, `jpeg`, `png` o `gif`, le asigna un nombre único con UUID, la guarda en `static/products` y devuelve su URL:

```json
{
  "secureUrl": "http://localhost:3000/api/files/product/3f1c2a9e-7b4d-4e8a-9c21-5d6f8a1b2c3d.jpg"
}
```

## Ejemplo de respuesta de producto

```json
{
  "id": "0b379447-8b58-4ca5-a79e-ef834c592d73",
  "title": "Men's 3D Large Wordmark Tee",
  "description": "Designed for fit, comfort and style, the Men's 3D Large Wordmark Tee is made from 100% Peruvian cotton.",
  "gender": "men",
  "slug": "men_3d_large_wordmark_tee",
  "sizes": ["XS", "S", "M"],
  "price": 35,
  "stock": 12,
  "tags": ["shirt"],
  "images": ["8764734-00-A_0_2000.jpg", "8764734-00-A_1.jpg"],
  "user": {
    "id": "6f1c0e0a-2c1b-4c63-9a3e-2b7d9f5e8a10",
    "email": "test1@google.com",
    "fullName": "Test Seed",
    "isActive": true,
    "roles": ["admin"]
  }
}
```

## Estructura del proyecto

```
src/
├── auth/        # Usuarios, JWT, strategy, guards, decoradores y roles
├── products/    # Entidades Product y ProductImage, CRUD
├── files/       # Carga y consulta de imágenes
├── seed/        # Datos de prueba
└── common/      # DTOs compartidos (paginación)
```

## Contribuir

Este proyecto es de código abierto. Haz un fork, crea una rama con tu mejora y abre un Pull Request.

Si este proyecto te sirvió, dale una ⭐ al repositorio. Es una forma sencilla de apoyarlo y ayuda a que más personas lo encuentren.

## Licencia

Distribuido bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

<p align="center">Hecho por <a href="https://github.com/Leandrop011">Leandro Pozo</a></p>