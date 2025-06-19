# Vacúnate - Backend

Sistema de gestión de vacunación para República Dominicana - Backend con Express, Prisma y PostgreSQL.

## Tecnologías

- **Runtime**: Bun
- **Framework**: Express.js
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: JWT
- **Validación**: Zod

## Instalación

```bash
# Instalar dependencias
bun install

# Configurar base de datos
bunx prisma generate
bunx prisma migrate dev

# Seed inicial (roles y esquema nacional)
bunx prisma db seed

# Iniciar en modo desarrollo
bun dev
```

## Scripts disponibles

- `bun dev` - Ejecutar en modo desarrollo con hot reload
- `bun password` - Generar contraseña aleatoria
- `bun email` - Probar envío de emails
- `bunx prisma studio` - Abrir Prisma Studio para gestión de BD
