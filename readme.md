# User Contacts and Spam Management API

## Overview

This project is a Node.js Express application built with TypeScript that provides an API for managing user contacts, marking phone numbers as spam, and searching for users and contacts. It utilizes Vercel/Postgres for database storage.

## Technologies Used

-   **Node.js**: JavaScript runtime for building scalable server-side applications.
-   **Express**: Web framework for building RESTful APIs.
-   **TypeScript**: Superset of JavaScript for static typing and enhanced development.
-   **Drizzle ORM**: ORM for database interactions.
-   **Postgres**: Relational database for storing user and contact data.
-   **Vercel/Postgres**: Managed PostgreSQL database service.

## Getting Started

### Prerequisites

-   Node.js (v14 or later)
-   PostgreSQL (for local development or use Vercel/Postgres)

### Installation

1. Change the env variables in the `.env` file. and add your postgres database url

```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
```

2. Install dependencies: `npm install`

3. Run the migrations:

```
npx drizzle-orm migration:run
```

4. Enter dummy data by running the

    ```
    npm run seed
    ```

5. Start the server: `npm run dev`

```
npm run dev
```

6. The server should be running on `http://localhost:3001`
7. You can now test the API using Postman or any other API testing tool.
8. All the endpoints are given in the attached postman collection.
9. All the api/v1/ endpoints are protected and require a valid JWT token to access them.
10. You can get the JWT token by signing up or logging in using the `/auth/login` and `/auth/signup` endpoints.
    Token will be printed in the console after successful login/signup.


