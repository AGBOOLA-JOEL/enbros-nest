# Dev-Blog API

A robust, modular, and secure RESTful API for a developer blogging platform, built with [NestJS](https://nestjs.com/), TypeORM, and PostgreSQL. This API supports user authentication, post management, and follows best practices for validation, error handling, and security.

---

## 📦 Project Overview

Dev-Blog API is designed for modern web applications, providing endpoints for user registration, authentication, and full CRUD operations on blog posts. The project is structured for scalability and maintainability, leveraging NestJS's modular architecture.

---

## 🗂️ Folder Structure

```
src/
  ├── app.module.ts           # Root module
  ├── main.ts                 # App bootstrap, global pipes/filters, Swagger
  ├── ormconfig.ts            # TypeORM/PostgreSQL config
  ├── auth/                   # Auth module: JWT, guards, strategies, DTOs
  ├── users/                  # Users module: entity, controller, service
  ├── posts/                  # Posts module: entity, controller, service, DTOs
  └── common/                 # Shared decorators, filters
test/                         # E2E tests
```

- **Naming:** Semantic, descriptive, and consistent with NestJS conventions.
- **Modules:** `AuthModule`, `UsersModule`, `PostsModule`—each encapsulates its own logic.

---

## 🚀 Features

### 1️⃣ Project Setup

- **Initialized with:** `nest new`
- **Modules:**
  - `AuthModule`: Handles registration, login, JWT, and guards.
  - `UsersModule`: User entity and user management.
  - `PostsModule`: CRUD for blog posts.
- **Key Config Files:**
  - `main.ts`: Sets up global validation, error filters, CORS, and Swagger docs.
  - `ormconfig.ts`: TypeORM + PostgreSQL configuration (uses environment variables).
  - `.env` (not committed): For DB and JWT secrets.

---

### 2️⃣ Database Integration

- **ORM:** [TypeORM](https://typeorm.io/) with PostgreSQL.
- **Config:** Dynamic via `ormconfig.ts` and `ConfigModule` (reads from `.env`).
- **Entities:**
  - **User**
    - `id` (UUID, PK)
    - `username` (unique)
    - `password` (hashed)
    - `createdAt`, `updatedAt`
    - `posts`: One-to-many relation to Post
  - **Post**
    - `id` (UUID, PK)
    - `title`, `content`, `desc`, `tags`
    - `authorId` (FK to User)
    - `createdAt`, `updatedAt`
    - `author`: Many-to-one relation to User

---

### 3️⃣ Authentication

- **Endpoints:**
  - `POST /auth/register`: Register a new user
  - `POST /auth/login`: Login and receive JWT
- **JWT:** Issued on login, validated on protected routes via `JwtAuthGuard` and Passport strategy.
- **Password Security:** Passwords are hashed with `bcrypt` (10 salt rounds).
- **Validation:** Registration and login DTOs enforce strong password and username rules.

---

### 4️⃣ API Endpoints (CRUD for Posts)

| Method | Endpoint     | Description                         | Auth Required | Notes                       |
| ------ | ------------ | ----------------------------------- | ------------- | --------------------------- |
| GET    | `/posts`     | Get all posts (most recent first)   | No            | Public                      |
| GET    | `/posts/:id` | Get a single post by ID             | No            | Public                      |
| POST   | `/posts`     | Create a new post                   | Yes           | Authenticated users only    |
| PATCH  | `/posts/:id` | Update a post (owner or admin only) | Yes           | Only owner/admin can update |
| DELETE | `/posts/:id` | Delete a post (owner or admin only) | Yes           | Only owner/admin can delete |

- **Protection:** `JwtAuthGuard` secures create, update, and delete routes.
- **Ownership:** Only the post's author or an admin can update/delete.
- **Auto-link:** New posts are automatically linked to the authenticated user.

---

### 5️⃣ Validation

- **Libraries:** `class-validator`, `class-transformer`
- **Rules:**
  - **User Registration:** Username (3-30 chars, alphanumeric/underscore), password (8-128 chars, must include upper, lower, number), password confirmation.
  - **Login:** Username and password required.
  - **Post Creation/Update:** Title and content required, length limits, tags as string array.
- **Global Validation:** Enforced via `ValidationPipe` in `main.ts` (whitelisting, transformation, non-whitelisted rejection).

---

### 6️⃣ Error Handling

- **Global Filter:** `HttpExceptionFilter` catches all errors and formats responses.
- **404:** Returns structured not found error.
- **401/403:** Unauthorized and forbidden errors for protected/ownership routes.
- **Validation:** Returns first validation error in a user-friendly format.
- **Other:** Internal errors are logged but not exposed to clients.

---

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Auth:** JWT (Passport.js)
- **Password Hashing:** bcrypt
- **Validation:** class-validator, class-transformer
- **API Docs:** Swagger (auto-generated at `/api`)
- **Security:** Helmet, CORS, Throttling (100 req/min)
- **Testing:** Jest (E2E tests scaffolded)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd enbros-nest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root with:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=devblog
JWT_SECRET=your_jwt_secret
ALLOWED_ORIGINS=http://localhost:3000
PORT=3000
```

### 4. Run the App (Development)

```bash
npm run start:dev
```

### 5. Run the App (Production)

```bash
npm run build
npm run start:prod
```

### 6. API Documentation

Visit [http://localhost:3000/api](http://localhost:3000/api) for interactive Swagger docs.

---

## 🔒 Security & Best Practices

- All sensitive routes are protected by JWT.
- Passwords are never stored in plain text.
- Rate limiting and security headers are enabled by default.
- Validation and error handling are robust and user-friendly.

---

**Contributions and issues are welcome!**
