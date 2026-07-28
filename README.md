# TypeScript Express REST API Scaffold

> A production-ready, highly scalable boilerplate for building secure RESTful APIs with Node.js, Express, TypeScript, and MongoDB (Mongoose).

---

## 🌟 Key Features

- **TypeScript Native**: Full end-to-end type safety, strict mode enabled, custom interfaces, and strict type checking.
- **Clean Architecture & SOLID Principles**:
  - **Controller Layer**: Handles HTTP request parsing, input extraction, and response formatting.
  - **Service Layer**: Pure domain & business logic decoupled from HTTP transport.
  - **Repository Layer**: Data abstraction using generic base repository patterns (`BaseRepository<T>`).
  - **DTO & Mapper Layer**: Prevents database model leakage to API consumers.
- **Robust Security**:
  - **Helmet**: Secure HTTP header defaults.
  - **CORS**: Configurable cross-origin resource sharing.
  - **Rate Limiting**: Protection against brute-force and DDoS attacks.
  - **JWT Authentication**: Access tokens & HTTP-only secure cookie refresh tokens.
  - **Password Hashing**: Pre-save password hashing with `bcrypt`.
- **Validation & Parsing**: Runtime environment and request body schema validation using **Zod**.
- **Observability & Logging**:
  - Structured application logging with **Winston**.
  - HTTP request logging via **Morgan**.
  - Health check endpoint (`/api/health`).
- **Interactive Documentation**: Auto-generated Swagger/OpenAPI documentation served at `/api-docs`.
- **Testing & Quality Assurance**:
  - **Jest** & **Supertest** setup for unit and integration testing.
  - In-memory database testing using **mongodb-memory-server**.
  - Git hooks via **Husky** & conventional commit enforcement via **commitlint**.
  - Code formatting with **ESLint** & **Prettier**.

---

## 🏗️ Architecture Overview

The boilerplate strictly segregates concerns into distinct, single-responsibility layers:

```text
               ┌────────────────────────┐
               │    HTTP Client / Web   │
               └───────────┬────────────┘
                           │ Request
                           ▼
               ┌────────────────────────┐
               │   Routes & Middleware  │ (CORS, Rate Limit, Auth, Validation)
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │       Controllers      │ (Input extraction & response formatting)
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │        Services        │ (Core Business & Domain Logic)
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │      Repositories      │ (Database Query Abstraction)
               └───────────┬────────────┘
                           │
                           ▼
               ┌────────────────────────┐
               │    Mongoose Models     │ (Database Schemas & Persistence)
               └────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
backend/
├── .husky/                  # Git hooks configuration
├── src/
│   ├── config/              # Centralized application, CORS, DB, & Swagger configurations
│   ├── constants/           # HTTP status codes, error messages, and app constants
│   ├── controllers/         # Express controllers (HTTP handlers)
│   ├── dtos/                # Data Transfer Objects
│   ├── errors/              # Custom AppError hierarchy & global error middleware
│   ├── mappers/             # Model-to-DTO transform logic
│   ├── middlewares/         # Auth, Rate Limiter, Validation, Logger middlewares
│   ├── models/              # Mongoose schema definitions & interfaces
│   ├── repositories/        # Base & entity-specific database repository classes
│   ├── routes/              # Express API route modules
│   ├── services/            # Pure business logic services
│   ├── utils/               # Helper utilities (Async handler, Logger, JWT helpers)
│   ├── validators/          # Zod schema definitions
│   ├── app.ts               # Express app instance setup
│   └── server.ts            # Application entry point & server lifecycle
├── tests/
│   ├── integration/         # Integration & API tests
│   └── setup.ts             # Jest test suite bootstrap
├── .env.example             # Environment variable template
├── eslintrc.js              # ESLint rules
├── jest.config.ts           # Jest test runner configuration
├── tsconfig.json            # TypeScript compiler configuration
└── package.json             # NPM dependencies & scripts
```

---

## 🛠️ Quick Start

### 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection URI

---

### ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/fasluolassery/ts-express-scaffold.git
   cd ts-express-scaffold
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file values as needed:
   ```ini
   PORT=5000
   NODE_ENV=development
   SERVER_URL=http://localhost:5000
   MONGO_URI=mongodb://localhost:27017/express_ts_template_db
   JWT_SECRET=your_super_secret_jwt_key
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

---

## 🏃 Running the Application

### Development Mode (with hot reloading)
```bash
npm run dev
```

### Production Build
Compile TypeScript to production-ready JavaScript in `dist/`:
```bash
npm run build
```

### Production Server
Start the compiled JavaScript application:
```bash
npm run start
```

---

## 📖 How to Add a New Domain Entity (Developer Guide)

Follow these steps to add a new entity (e.g., `Product`) into the architecture:

### 1. Define the Mongoose Model (`src/models/product.model.ts`)
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct {
  title: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductDocument extends IProduct, Document {}

const productSchema = new Schema<IProductDocument>(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProductDocument>('Product', productSchema);
```

### 2. Create the Repository (`src/repositories/product.repository.ts`)
```typescript
import { BaseRepository } from './base.repository';
import { Product, IProductDocument } from '../models/product.model';

export class ProductRepository extends BaseRepository<IProductDocument> {
  constructor() {
    super(Product);
  }
}
export const productRepository = new ProductRepository();
```

### 3. Create the Service (`src/services/product.service.ts`)
```typescript
import { productRepository, ProductRepository } from '../repositories/product.repository';
import { NotFoundError } from '../errors';

export class ProductService {
  constructor(private repo: ProductRepository = productRepository) {}

  async getAllProducts() {
    return this.repo.find();
  }

  async getProductById(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundError('Product not found');
    return product;
  }
}
export const productService = new Service();
```

### 4. Create Controller & Validator (`src/controllers/product.controller.ts`)
```typescript
import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { asyncHandler } from '../utils';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts();
  res.status(200).json({ success: true, data: products });
});
```

### 5. Define Routes (`src/routes/product.routes.ts`)
```typescript
import { Router } from 'express';
import { getProducts } from '../controllers/product.controller';

const router = Router();
router.get('/', getProducts);

export default router;
```

---

## 📑 Interactive API Documentation

Interactive Swagger API documentation is available at:

```text
http://localhost:5000/api-docs
```

---

## 🧪 Testing & Code Quality

### Run Integration & Unit Tests
```bash
npm test
```

### Run Type Checking
```bash
npm run lint
```

### Format Code with Prettier
```bash
npm run format
```

---
