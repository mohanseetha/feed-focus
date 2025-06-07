# feed-focus-backend
A modular backend for a modern news aggregation platform.

## Repository Contents
This repository contains:  
- **feed-focus-backend**: Spring Boot backend (Java, MongoDB) for user management, RSS feed fetching, article storage, and bookmarks.  

## Tech Stack
- Java 17+, Spring Boot 3.x  
- Spring Data MongoDB  
- Spring Security (JWT)  
- MongoDB (NoSQL database)  
- Maven or Gradle  

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/mohanseetha/feed-focus.git
cd feed-focus-backend
```

### 2. Configure MongoDB
Ensure MongoDB is running locally (default port 27017) or update the connection string in `application.properties`:
```
spring.data.mongodb.uri=mongodb://localhost:27017/databaseName
jwt.secret=your_super_secret_key
```

### 3. Run the Spring Boot Backend
```bash
./mvnw spring-boot:run
```
or
```bash
./gradlew bootRun
```

## Data Models

### Article
| Field       | Type      | Description             |
|-------------|-----------|-------------------------|
| id          | String    | MongoDB ObjectId        |
| title       | String    | Article title           |
| url         | String    | Article URL (unique)    |
| source      | String    | Source name             |
| publishedAt | String    | Publication date/time   |
| content     | String    | Article summary/content |
| topic       | String    | Extracted topics        |

### User
| Field       | Type         | Description                   |
|-------------|--------------|-------------------------------|
| id          | String       | MongoDB ObjectId              |
| username    | String       | Username (unique)             |
| email       | String       | Email address (unique)        |
| password    | String       | Hashed password               |
| preferences | List<String> | Preferred topics/sources      |
| bookmarks   | List<Article>| Bookmarked articles           |

## API Endpoints

## Article Endpoints

| Method | Endpoint                | Description                                 | Params / Body         |
|--------|------------------------|---------------------------------------------|-----------------------|
| GET    | `/api/articles`        | Get all articles or filter by topic         | `topic` (query)       |
| GET    | `/api/articles/{id}`   | Get a single article by its ID              | `id` (path)           |

---

## User Endpoints

| Method | Endpoint                              | Description                                 | Body / Params                        |
|--------|---------------------------------------|---------------------------------------------|--------------------------------------|
| POST   | `/api/users/register`                 | Register a new user                         | `{ username, email, password, preferences }` |
| POST   | `/api/users/login`                    | Login and receive JWT                       | `{ username, password }`             |
| PUT    | `/api/users/update-preferences`       | Update user preferences                     | `[ "preference1", ... ]`             |
| PATCH  | `/api/users/add-bookmark`             | Add an article to user bookmarks            | `Article` object                     |
| DELETE | `/api/users/remove-bookmark`          | Remove an article from bookmarks            | `Article` object                     |
| GET    | `/api/users/profile`                  | Get current user's profile (JWT required)   | —                                    |
| GET    | `/api/users/recommended-articles`     | Get articles matching user preferences      | —                                    |

## Example Usage
- Get all articles:
  ```http
  GET /api/articles
  ```
- Get articles by topic:
  ```http
  GET /api/articles?topic=technology
  ```
- Register a user:
  ```http
  POST /api/users/register
  Body: {
    "username": "alice",
    "email": "alice@email.com",
    "password": "pass123",
    "preferences": ["entertainment", "sports", "technology", "business", "health"]
  }
  ```

## Notes
- All endpoints (except `/register` and `/login`) require a valid JWT in the `Authorization` header.  
- MongoDB is used for all data storage (users, articles, bookmarks).

## Contributing
Pull requests are welcome! Please open an issue to discuss major changes.
