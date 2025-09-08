# 🎬 Pop & Play Backend

Backend para la plataforma **Pop & Play**, una aplicación estilo Netflix. Este backend está construido con **Node.js**, **Express**, **TypeScript**, y utiliza **Prisma** como ORM para conectarse a una base de datos PostgreSQL.

---

## 📁 Estructura de Carpetas

```bash
pop-play-backend/
├── src/
│   └── app.ts             # Archivo principal del servidor Express
├── dist/                  # Carpeta generada automáticamente por TypeScript al compilar
├── prisma/
│   └── schema.prisma      # Definición del esquema de base de datos para Prisma
├── .env                   # Variables de entorno (como la conexión a PostgreSQL)
├── tsconfig.json          # Configuración de TypeScript
├── package.json           # Configuración y scripts del proyecto
└── README.md              # Documentación del proyecto
```

---
## 🚀 Inicializalización del Proyecto

## 1. Crear la carpeta del backend
    mkdir pop-play-backend && cd pop-play-backend

## 2. Inicializar proyecto Node con TypeScript
    npm init -y
    npm install typescript --save-dev
    npx tsc --init

## 3. Instalar Express y Prisma con soporte TypeScript
    npm install express @prisma/client dotenv
    npm install --save-dev prisma ts-node ts-node-dev nodemon @types/express @types/node

## 📦 Explicación de Dependencias

## Dependencias principales:
-- express	// Framework minimalista para crear APIs HTTP.
-- @prisma/client	// Cliente generado automáticamente por Prisma para interactuar con la base de datos.
-- dotenv	// Carga variables de entorno desde un archivo .env.

## Dependencias de desarrollo:
-- typescript	// Añade soporte para TypeScript.
-- ts-node	// Permite ejecutar archivos .ts directamente sin compilar.
-- ts-node-dev	// Similar a nodemon pero optimizado para TypeScript.
-- nodemon	// Reinicia el servidor automáticamente al guardar cambios.
-- @types/express	// Tipos de Express para TypeScript.
-- @types/node	// Tipos del entorno de Node.js para TypeScript.
-- prisma	// CLI para manejar el esquema, migraciones y generación del cliente Prisma.

---

## 🚀 Inicialización de Prisma

## 1. Inicializar Prisma
    npx prisma init

## 2. Configurar el esquema de base de datos
    npx prisma generate

## 3. Configurar la base de datos
    npx prisma db push

## 📦 Explicación de Comandos

## Comandos principales:
-- prisma init	// Inicializa Prisma en el proyecto.
-- prisma generate	// Genera el esquema de base de datos.
-- prisma db push	// Crea la base de datos.

## Comandos de desarrollo:
-- prisma db push	// Crea la base de datos.
-- prisma db studio	// Abre el Studio de Prisma para interactuar con la base de datos.
-- prisma migrate dev	// Aplica las migraciones de desarrollo.

---

## 🚀 Inicialización del Servidor

## 1. Inicializar el servidor
    npm run dev --> nodemon --watch src/app.ts

## 2. Compilar el proyecto
    npm run build --> tsc

## 3. Iniciar el servidor
    npm start --> node dist/app.js

## 📦 Explicación de Comandos

## Comandos principales:
-- nodemon --watch src/app.ts	// Inicia el servidor en modo desarrollo con nodemon, --watch permite reiniciar el servidor al guardar cambios.
-- tsc	// Compila el proyecto con TypeScript y genera el archivo app.js en la carpeta dist.
-- node dist/app.js	// Inicia el servidor con el archivo app.js generado por tsc en la carpeta dist.   