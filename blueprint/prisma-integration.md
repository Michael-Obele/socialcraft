# Prisma & PostgreSQL Integration Guide

This document provides a guide for setting up and using Prisma with a PostgreSQL database for the SocialCraft project.

## 1. Connecting to PostgreSQL

Prisma connects to your database using a connection URL. This URL should be stored in an environment variable for security.

### Connection URL Format

The standard format for a PostgreSQL connection URL is:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

-   **USER**: Your database username.
-   **PASSWORD**: Your database password.
-   **HOST**: The IP address or domain of your database server.
-   **PORT**: The port your database server is running on (usually `5432`).
-   **DATABASE**: The name of your database.
-   **SCHEMA**: The database schema to use (e.g., `public`).

### Environment Variable Setup

In your `.env` file, you will define the `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

For Amazon RDS, the `HOST` will be the endpoint provided by AWS.

## 2. Prisma Schema Setup

The `prisma/schema.prisma` file is the heart of your Prisma setup. It contains your database schema and configuration.

### Datasource Configuration

To connect to your PostgreSQL database, you need to configure the `datasource` block in your `schema.prisma` file:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

This tells Prisma to use the PostgreSQL provider and to get the connection URL from the `DATABASE_URL` environment variable.

## 3. Core Prisma Commands

### Initialize Prisma

To start a new Prisma setup in your project, run:

```bash
bunx prisma init
```

This command creates the `prisma` directory with a `schema.prisma` file and a `.env` file for your database URL.

### Migrating the Database

Prisma Migrate is used to keep your database schema in sync with your Prisma schema. To create and apply a new migration, run:

```bash
bunx prisma migrate dev --name your-migration-name
```

For the initial migration, you can use:

```bash
bunx prisma migrate dev --name init
```

This command will:
1.  Create a new SQL migration file in `prisma/migrations`.
2.  Apply the migration to the database, creating tables and columns as defined in your schema.
3.  Generate the Prisma Client based on your schema.

### Prisma Studio

Prisma Studio is a visual editor for your database. You can open it with:

```bash
bunx prisma studio
```

## 4. Using Prisma Client

Prisma Client is a type-safe query builder that's auto-generated from your Prisma schema.

### Instantiation

To use Prisma Client, you first need to import and instantiate it. For this project, we'll use a single, shared instance to avoid running out of database connections. The blueprint specifies using **Prisma Accelerate** for connection pooling, which is crucial for serverless environments.

Create a file at `src/lib/server/prisma.ts` (as planned in the blueprint):

```typescript
import { PrismaClient } from './generated/prisma/client'; // Adjust path if needed
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

export default prisma;
```

This creates a global Prisma Client instance with connection pooling enabled.

### Basic Queries

You can now import this `prisma` instance into your server-side code (e.g., `+page.server.ts` files) to interact with your database.

```typescript
import prisma from '$lib/server/prisma';

// Example: Fetch all users
const allUsers = await prisma.user.findMany();

// Example: Create a new image record
const newImage = await prisma.image.create({
  data: {
    prompt: 'A futuristic city at sunset',
    style: 'Cyberpunk',
    imageUrl: 'https://...',
    isPublic: true,
  },
});
```

## 5. Data Type Mapping

Prisma maps its schema types to corresponding PostgreSQL column types:

| Prisma ORM | PostgreSQL       |
| ---------- | ---------------- |
| `String`   | `text`           |
| `Boolean`  | `boolean`        |
| `Int`      | `integer`        |
| `BigInt`   | `bigint`         |
| `Float`    | `double precision` |
| `Decimal`  | `decimal(65,30)` |
| `DateTime` | `timestamp(3)`   |
| `Json`     | `jsonb`          |
| `Bytes`    | `bytea`          |

This information will be used to expand the `02-tech-stack-and-setup.md` blueprint with more detailed, actionable steps for setting up the database connection and Prisma integration.