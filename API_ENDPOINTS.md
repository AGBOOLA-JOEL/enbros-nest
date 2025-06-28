# Dev-Blog API Endpoints

## Base URL

`http://localhost:3000`

## Swagger Documentation

`http://localhost:3000/api`

## Public Endpoints

### Posts

- `GET /posts` - Get all posts (public)
- `GET /posts/:id` - Get specific post by ID (public)

## Authentication Endpoints

### Auth

- `POST /auth/register` - Register a new user
  - Body: `{ "username": "string", "password": "string" }`
  - Password must be at least 8 characters

- `POST /auth/login` - Login user
  - Body: `{ "username": "string", "password": "string" }`
  - Returns: `{ "access_token": "jwt_token" }`

## Protected Endpoints (Require JWT Bearer Token)

### Posts (Owner Only)

- `POST /posts` - Create a new post
  - Body: `{ "title": "string", "content": "string" }`
  - Requires authentication

- `PATCH /posts/:id` - Update a post (owner only)
  - Body: `{ "title"?: "string", "content"?: "string" }`
  - Requires authentication + ownership

- `DELETE /posts/:id` - Delete a post (owner only)
  - Requires authentication + ownership

### Users (Admin)

- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get specific user by ID

## Authentication

### JWT Bearer Token

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Example Usage

1. Register: `POST /auth/register`
2. Login: `POST /auth/login` (get JWT token)
3. Use JWT token in Authorization header for protected endpoints

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/posts",
  "message": "Error message"
}
```

## Environment Variables

Create a `.env` file with:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=enbros_nest
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```
