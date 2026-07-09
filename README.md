# Express TypeScript Boilerplate

A production-ready starter template for building secure, robust, and scalable backend REST APIs using Node.js, Express, TypeScript, and MongoDB/Mongoose.

---

## 🚀 Features

-   **TypeScript Setup**: Pre-configured TS compilation, path mappings, and hot-reloading development via [tsx](https://github.com/privatenumber/tsx).
-   **Security & Performance**:
    -   [Helmet](https://helmetjs.github.io/) to secure HTTP headers.
    -   [CORS](https://github.com/expressjs/cors) middleware configured.
    -   [Compression](https://github.com/expressjs/compression) to reduce response sizes.
-   **Robustness**:
    -   Global exception & unhandled rejection handlers.
    -   Custom error classes (`AppError`, `NotFoundError`, `BadRequestError`, etc.) to unify error handling.
    -   Graceful shutdown mechanisms.
-   **Code Quality & Standards**:
    -   [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) configured for clean, uniform formatting.
    -   [Husky](https://typicode.github.io/husky/) and [commitlint](https://commitlint.js.org/) to enforce conventional commits and lint check before committing.
-   **API Documentation**: Built-in interactive [Swagger UI](https://swagger.io/tools/swagger-ui/) for quick testing and API usage reference.
-   **Validation**: Schema validation with [Zod](https://github.com/colinhacks/zod).
-   **Logging**: Professional logger with [Winston](https://github.com/winstonjs/winston) and request logs via [Morgan](https://github.com/expressjs/morgan).

---

## 📁 Project Structure

```text
backend/
├── .husky/              # Git hooks config
├── src/
│   ├── config/          # Environment & Database config
│   ├── constants/       # App constants (HTTP status codes, role names, etc.)
│   ├── errors/          # Custom error definitions and global handler
│   ├── middlewares/     # Authentication, logging, error, & validation middlewares
│   ├── routes/          # Express API route endpoints
│   ├── utils/           # Helper functions & classes
│   ├── validators/      # Zod validation schemas
│   ├── app.ts           # Express App setup (middlewares, route mappings)
│   └── server.ts        # Server entrypoint & DB connection
├── .env.example         # Template for environment variables
├── eslintrc.js          # ESLint configuration
├── tsconfig.json        # TypeScript configuration
└── README.md
```

---

## 🛠️ Getting Started

### 📋 Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cloud cluster)

### ⚙️ Setup

1. Clone or download this boilerplate template.
2. Navigate to the root directory and install dependencies:
    ```bash
    npm install
    ```
3. Copy the template environment variables file:
    ```bash
    cp .env.example .env
    ```
4. Update the `.env` file with your credentials and configuration (e.g. `MONGO_URI`, `PORT`, `JWT_SECRET`).

---

## 🏃 Running the Application

### Development Mode (with hot-reloading)
```bash
npm run dev
```

### Production Build
Compile TypeScript to production JavaScript:
```bash
npm run build
```

### Start Production Server
Ensure you have run the build script first, then execute:
```bash
npm run start
```

---

## 🛡️ Linting & Formatting

Keep code consistent and catch bugs early:

-   **Lint verification (no emitting)**:
    ```bash
    npm run lint
    ```
-   **Fix lint issues**:
    ```bash
    npm run lint:fix
    ```
-   **Format code with Prettier**:
    ```bash
    npm run format
    ```

---

## 📑 API Documentation

Interactive Swagger documentation is available once the server is running. 

Navigate to:
```text
http://localhost:<PORT>/api-docs
```
*(Replace `<PORT>` with your configured port from the `.env` file, default is `5000`)*
