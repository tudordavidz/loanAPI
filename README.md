# Loan Eligibility API

A TypeScript/Node.js API for evaluating loan applications with eligibility checking and crime grade assessment.

## Running the Project

### Locally

```bash
npm install
npm run dev
```

### Docker

```bash
./docker-setup.sh
```

## Running Tests

```bash
npm test
```

For detailed test output:

```bash
npm run test:verbose
```

## Architecture & Design Decisions

**Clean Architecture**: Separated concerns into controllers, services, repositories, and middleware for maintainability.

**In-Memory Storage**: Simple repository pattern with in-memory data store for this demo. Easily replaceable with database.

**Eligibility Logic**: Credit score ≥700, monthly income >1.5x monthly payment, crime grade ≠"F".

**Crime Grade Service**: Mock implementation ready for integration with real crime data APIs.

**API Key Authentication**: Simple middleware for securing endpoints.

**TypeScript**: Strong typing for better code quality and developer experience.
