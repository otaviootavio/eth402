# L402

## Overview

This project is a Fastify-based server that handles adding balance and retrieving secret information, with middleware for verifying signatures and payment requirements. It uses Redis for storage and Zod for schema validation.

## Project Structure

```bash
.
├── docker-compose.yml                # Docker Compose configuration file for running Redis
├── package.json                      # Node.js dependencies and scripts
├── package-lock.json                 # Lockfile for Node.js dependencies
├── src
│   ├── envLoader.ts                  # Environment variables loader
│   ├── middleware
│   │   ├── addPaymentMiddleware.ts   # Middleware to handle adding payments
│   │   ├── requirePaymentMiddleware.ts # Middleware to handle payment requirements
│   │   └── verifySignatureMiddleware.ts # Middleware to verify signatures
│   ├── schemas
│   │   ├── addBalanceSchema.ts       # Schema for adding balance
│   │   ├── addPaymentSchema.ts       # Schema for adding payments
│   │   ├── requirePaymentSchema.ts   # Schema for payment requirements
│   │   └── secretSchema.ts           # Schema for retrieving secrets
│   ├── server.ts                     # Main server file
│   ├── types
│   │   ├── AddRequestBody.d.ts       # Type definition for add request body
│   │   ├── RequirePaymentRequestBody.d.ts # Type definition for require payment request body
│   │   └── SecretRequestBody.d.ts    # Type definition for secret request body
│   └── utils
│       └── getTxByTxHash.ts          # Utility function to get transaction by hash
├── tests
│   └── integration
│       ├── server.test.ts            # Integration tests for the server
│       └── utils
│           └── client.ts             # Utility functions for tests
└── tsconfig.json                     # TypeScript configuration file
```

## Prerequisites

- Node.js v14 or later
- Docker and Docker Compose

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Redis using Docker Compose:

   ```bash
   docker compose up -d
   ```

4. Create a `.env` file in the root directory and add the necessary environment variables (refer to `envLoader.ts` for required variables).

## Running the Server

To start the server locally, run:

```bash
npm start
```

The server will be available at `http://localhost:3000`.

## Running Tests

To run the integration tests, use:

```bash
npm test
```

## Available Endpoints

### Add Balance

**POST** `/add`

**Body:**

```json
{
  "txid": "0x...",
  "address": "0x...",
  "signature": "0x...",
  "message": "string"
}
```

### Get Secret

**POST** `/secret`

**Body:**

```json
{
  "address": "0x...",
  "signature": "0x...",
  "message": "string"
}
```

## Middleware

- `addPaymentMiddleware.ts`: Handles adding payments by validating and updating user balances.
- `requirePaymentMiddleware.ts`: Ensures users have sufficient balance and deducts the required amount.
- `verifySignatureMiddleware.ts`: Verifies the signature of the request to ensure its authenticity.

## Schemas

- `addBalanceSchema.ts`: Schema for validating add balance requests.
- `addPaymentSchema.ts`: Schema for validating add payment requests.
- `requirePaymentSchema.ts`: Schema for validating payment requirements.
- `secretSchema.ts`: Schema for validating requests to retrieve secrets.

## Utils

- `getTxByTxHash.ts`: Utility function to retrieve transaction details by hash.
