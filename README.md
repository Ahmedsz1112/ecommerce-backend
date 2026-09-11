# E-Commerce REST API

A REST API for an e-commerce storefront, built with Express and TypeScript.
Mongoose models, JWT authentication, bcrypt password hashing.

## Overview

The service exposes three route groups (users, products and cart), backed by
Mongoose models against MongoDB. Authenticated routes are guarded by a JWT
middleware that verifies the bearer token and attaches the user to the request.
Business logic sits in a services layer so the routers stay thin.

## Features

- User registration and login with bcrypt-hashed passwords
- JWT issuing and verification via an Express middleware
- Product catalog endpoints backed by Mongoose models
- Cart operations: add items, update quantities, and checkout to an order
- CORS enabled for browser clients
- Containerised with a Dockerfile for deployment

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | MongoDB via Mongoose |
| Auth | jsonwebtoken, bcrypt |
| Tooling | nodemon, ts-node, Docker |

## API Routes

| Prefix | Purpose |
| --- | --- |
| `/user` | Registration, login and user lookup |
| `/product` | Product catalog |
| `/cart` | Cart items, quantities and checkout |

## Getting Started

```bash
git clone https://github.com/Ahmedsz1112/ecommerce-backend.git
cd ecommerce-backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the project root. **Do not commit it.** Add `.env` to
`.gitignore` first.

```bash
# MongoDB connection string
MONGO_URL=

# Secret used to sign and verify JWTs
JWT_SECRET=

# Port the server listens on
PORT=
```

## Scripts

```bash
npm run dev      # Start with nodemon
npm run build    # Compile TypeScript to dist/
npm run start    # Run the compiled server
```

## Project Structure

```
src/
  index.ts            # App entry, route mounting
  middleware/         # JWT verification
  models/             # User, Product, Cart, Order schemas
  routers/            # user, product, cart routes
  services/           # Business logic
  types/              # Shared request types
Dockerfile
```
