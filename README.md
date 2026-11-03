<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Teslo Shop API</h1>

<p align="center">
  API REST de código abierto para la gestión de productos de una tienda, construida con <b>NestJS</b>, <b>TypeORM</b> y <b>PostgreSQL</b>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=flat&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Multer-FF6600?style=flat&logoColor=white" alt="Multer" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Descripción

Teslo Shop API es el backend de una tienda de ropa. Permite crear, consultar, actualizar y eliminar productos, cada uno con su título, slug, precio, stock, descripción, género, tallas, etiquetas e imágenes.

Las imágenes se guardan en su propia tabla y un producto puede tener varias.

Además, la API permite **subir imágenes de productos** al servidor y consultarlas mediante una URL pública.

## Características

- CRUD completo de productos con paginación
- Búsqueda de productos por id, slug o título
- Seed para poblar la base de datos en desarrollo
- Carga de imágenes con validación de formato (`jpg`, `jpeg`, `png`, `gif`)
- Nombres únicos para cada archivo generados con UUID
- Servicio de imágenes por URL y contenido estático desde la carpeta `public`

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

3. Copiar el archivo `.env.template` y renombrarlo a `.env`.

4. Ajustar las variables de entorno según tu caso.

5. Levantar la base de datos:

```bash
docker compose up -d
```

6. Levantar el servidor en modo desarrollo:

```bash
yarn start:dev
```

7. Poblar la base de datos con datos de prueba:

```
GET http://localhost:3000/api/seed
```

> El seed borra todos los productos existentes antes de insertar los nuevos.

## Variables de entorno

| Variable      | Descripción                                        | Ejemplo                     |
| ------------- | -------------------------------------------------- | --------------------------- |
| `DB_PASSWORD` | Contraseña de PostgreSQL                           | `MySecretPassword`          |
| `DB_NAME`     | Nombre de la base de datos                         | `TesloDb`                   |
| `DB_HOST`     | Host de la base de datos                           | `localhost`                 |
| `DB_PORT`     | Puerto de la base de datos                         | `5432`                      |
| `DB_USERNAME` | Usuario de la base de datos                        | `postgres`                  |
| `PORT`        | Puerto del servidor                                | `3000`                      |
| `HOST_API`    | URL base de la API, se usa para armar la URL de las imágenes subidas | `http://localhost:3000/api` |

## Endpoints

Base URL: `http://localhost:3000/api`

### Productos

- `POST /products` crea un producto
- `GET /products?limit=10&offset=0` lista productos con paginación
- `GET /products/:term` busca un producto por id, slug o título
- `PATCH /products/:id` actualiza un producto
- `DELETE /products/:id` elimina un producto

### Archivos

- `POST /files/product` sube una imagen de producto
- `GET /files/product/:imageName` devuelve una imagen de producto por su nombre

### Seed

- `GET /seed` carga datos de prueba

## Subida de imágenes

El endpoint `POST /files/product` recibe la imagen como `multipart/form-data` en el campo **`file`**.

```bash
curl -X POST http://localhost:3000/api/files/product \
  -F "file=@./mi-imagen.jpg"
```

Al recibir el archivo, la API:

1. Valida que sea una imagen `jpg`, `jpeg`, `png` o `gif`. Si no lo es, responde `400 Bad Request`.
2. Le asigna un nombre único con UUID, conservando su extensión.
3. La guarda en la carpeta `static/products`.
4. Devuelve la URL para consultarla:

```json
{
  "secureUrl": "http://localhost:3000/api/files/product/3f1c2a9e-7b4d-4e8a-9c21-5d6f8a1b2c3d.jpg"
}
```

Para ver la imagen basta con abrir esa URL. Si el nombre no existe, la API responde `400 Bad Request`.

## Ejemplo de respuesta de producto

```json
{
  "id": "0b379447-8b58-4ca5-a79e-ef834c592d73",
  "title": "Men's 3D Large Wordmark Tee",
  "description": "Designed for fit, comfort and style, the Men's 3D Large Wordmark Tee is made from 100% Peruvian cotton with a 3D silicone-printed Tesla wordmark printed across the chest.",
  "gender": "men",
  "slug": "men_3d_large_wordmark_tee",
  "sizes": ["XS", "S", "M"],
  "price": 35,
  "stock": 12,
  "tags": ["shirt"],
  "images": ["8764734-00-A_0_2000.jpg", "8764734-00-A_1.jpg"]
}
```

## Contribuir

Este proyecto es de código abierto. Haz un fork, crea una rama con tu mejora y abre un Pull Request.

Si este proyecto te sirvió, dale una ⭐ al repositorio. Es una forma sencilla de apoyarlo y ayuda a que más personas lo encuentren.

---