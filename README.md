# Notes API

A RESTful API service for managing notes with CRUD operations built with Node.js, Express, and MongoDB.

## Features

- Create, Read, Update, and Delete notes
- User authentication with JWT
- Short-lived JWT tokens (5 minutes) for enhanced security
- MongoDB database integration
- RESTful API design
- Error handling
- Docker support for easy deployment
- Interactive API documentation with Swagger UI

## Prerequisites

- Node.js (v14 or higher) - for local development
- MongoDB (local or Atlas) - for local development
- Docker and Docker Compose - for containerized deployment

## Installation

### Local Development

1. Clone the repository:

```
git clone <repository-url>
cd notes-api
```

2. Install dependencies:

```
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/notes-api
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=5m
```

### Docker Deployment

1. Clone the repository:

```
git clone <repository-url>
cd notes-api
```

2. Build and run the containers:

```
docker-compose up -d
```

This will start both the Node.js application and MongoDB in containers.

## Running the Application

### Local Development

Start the development server:

```
npm run dev
```

For production:

```
npm start
```

### Docker

Start the application:

```
docker-compose up -d
```

Stop the application:

```
docker-compose down
```

Restart the application:

```
docker-compose restart
```

View logs:

```
docker-compose logs -f app
```

Initialize the database with sample data:

```
docker-compose exec app npm run init-db
```

Open a shell in the app container:

```
docker-compose exec app /bin/sh
```

Open a MongoDB shell:

```
docker-compose exec mongo mongo
```

## API Documentation

The API documentation is available at:

```
http://localhost:3000/api-docs
```

This interactive documentation is built with Swagger UI and provides:

- Detailed information about all API endpoints
- Request and response examples
- Authentication requirements
- Schema definitions
- Try-it-out functionality to test the API directly from the browser

## Troubleshooting

### Missing Dependencies

If you encounter a `MODULE_NOT_FOUND` error, you can manually install the missing dependencies:

```
docker-compose exec app sh /app/install-deps.sh
```

This will install the essential packages (jsonwebtoken, bcryptjs, validator) that might be missing.

### Volume Mounting Issues

If you're experiencing issues with dependencies not being found despite being in package.json, it might be due to volume mounting issues. Try rebuilding the container:

```
docker-compose down
docker-compose up -d --build
```

## API Endpoints

### Authentication

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | /api/auth/register      | Register a new user           |
| POST   | /api/auth/login         | Login and get JWT token       |
| GET    | /api/auth/me            | Get current user (protected)  |
| POST   | /api/auth/refresh-token | Refresh JWT token (protected) |

### Notes (All Protected Routes)

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| GET    | /api/notes     | Get all notes             |
| POST   | /api/notes     | Create a new note         |
| GET    | /api/notes/:id | Get a specific note by ID |
| PUT    | /api/notes/:id | Update a specific note    |
| DELETE | /api/notes/:id | Delete a specific note    |

## Request & Response Examples

### Authentication

#### Register a new user

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "5m",
  "user": {
    "id": "60f7b0b9e6c7a83b3c3f3e5a",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "5m",
  "user": {
    "id": "60f7b0b9e6c7a83b3c3f3e5a",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Login successful. Token will expire in 5m"
}
```

#### Refresh Token

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "5m",
  "message": "Token refreshed successfully"
}
```

### Notes

#### GET /api/notes

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60f7b0b9e6c7a83b3c3f3e5a",
      "title": "Meeting Notes",
      "content": "Discuss project timeline",
      "category": "Work",
      "isCompleted": false,
      "user": "60f7b0b9e6c7a83b3c3f3e5b",
      "createdAt": "2023-07-21T10:30:00.000Z",
      "updatedAt": "2023-07-21T10:30:00.000Z"
    },
    {
      "_id": "60f7b0c9e6c7a83b3c3f3e5c",
      "title": "Shopping List",
      "content": "Milk, Eggs, Bread",
      "category": "Personal",
      "isCompleted": true,
      "user": "60f7b0b9e6c7a83b3c3f3e5b",
      "createdAt": "2023-07-20T15:45:00.000Z",
      "updatedAt": "2023-07-21T09:15:00.000Z"
    }
  ]
}
```

#### POST /api/notes

Headers:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Request:

```json
{
  "title": "Task for Today",
  "content": "Complete API documentation",
  "category": "Work"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "_id": "60f7b0d9e6c7a83b3c3f3e5d",
    "title": "Task for Today",
    "content": "Complete API documentation",
    "category": "Work",
    "isCompleted": false,
    "user": "60f7b0b9e6c7a83b3c3f3e5b",
    "createdAt": "2023-07-21T11:00:00.000Z",
    "updatedAt": "2023-07-21T11:00:00.000Z"
  }
}
```

## Authentication Flow

1. **Register or Login**: Get a JWT token that expires in 5 minutes
2. **Access Protected Routes**: Include the token in the Authorization header
3. **Token Expiration**: When the token expires (after 5 minutes), you'll receive a 401 error
4. **Refresh Token**: Use the `/api/auth/refresh-token` endpoint to get a new token before the current one expires

## Database Initialization

To initialize the database with sample data:

### Local Development

```
npm run init-db
```

### Docker

```
docker-compose exec app npm run init-db
```

This will create a sample user with the following credentials:

- Email: test@example.com
- Password: password123

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400: Bad request (validation error)
- 401: Unauthorized (invalid credentials or missing/expired token)
- 404: Resource not found
- 500: Server error

## License

MIT
