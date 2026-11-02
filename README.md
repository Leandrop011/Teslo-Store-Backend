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
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## Descripción

Teslo Shop API es el backend de una tienda de ropa. Permite crear, consultar, actualizar y eliminar productos, cada uno con su título, slug, precio, stock, descripción, género, tallas, etiquetas e imágenes.

Las imágenes se guardan en su propia tabla y un producto puede tener varias.

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

## Endpoints

Base URL: `http://localhost:3000/api`

- `POST /products` crea un producto
- `GET /products?limit=10&offset=0` lista productos con paginación
- `GET /products/:term` busca un producto por id, slug o título
- `PATCH /products/:id` actualiza un producto
- `DELETE /products/:id` elimina un producto
- `GET /seed` carga datos de prueba

## Ejemplo de respuesta

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
