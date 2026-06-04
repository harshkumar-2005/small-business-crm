# Lead Management CRM Backend

A RESTful CRM backend built using Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

The system allows businesses to manage customer leads, track lead statuses, update notes, and maintain lead records efficiently.

---

## Features

* Create new leads
* Search leads by:

  * Name
  * Email
  * Phone Number
  * Company Name
* Pagination support
* Update lead status
* Update lead notes/details
* Delete leads
* PostgreSQL database integration
* Prisma ORM
* Docker support
* Health monitoring endpoint

---

## Tech Stack

| Technology | Purpose           |
| ---------- | ----------------- |
| Node.js    | Runtime           |
| Express.js | Backend Framework |
| TypeScript | Type Safety       |
| PostgreSQL | Database          |
| Prisma ORM | Database ORM      |
| Docker     | Containerization  |

---

## Project Structure

```bash
src/
├── controllers/
│   └── lead.controller.ts
│
├── services/
│   └── lead.service.ts
│
├── routes/
│   ├── index.ts
│   └── lead.routes.ts
│
├── interface/
│   └── create.lead.interface.ts
│
├── utils/
│   ├── prisma.ts
│   └── pagination.ts
│
└── index.ts
```

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@host:5432/database"
```

---

## Installation

Clone repository:

```bash
git clone <repository-url>
cd backend
```

Install dependencies:

```bash
npm install
```

---

## Running Locally

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Production:

```bash
npm start
```

Server runs on:

```bash
http://localhost:8080
```

---

## Health Check

### Endpoint

```http
GET /health
```

### Response

```json
{
  "success": true,
  "message": "App is healthy....."
}
```

---

# API Documentation

Base URL

```http
http://localhost:8080/v1/api/backend/customer
```

---

## Create Lead

### Endpoint

```http
POST /create-lead
```

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phoneNumber": "9876543210",
  "companyName": "Acme Inc",
  "status": "NEW",
  "notes": "Interested in CRM solution"
}
```

### Success Response

```json
{
  "success": true,
  "data": {}
}
```

---

## Get All Leads

### Endpoint

```http
GET /all-lead?page=1&limit=10&search=john
```

### Query Parameters

| Parameter | Description      |
| --------- | ---------------- |
| page      | Current page     |
| limit     | Records per page |
| search    | Search keyword   |

### Success Response

```json
{
  "success": true,
  "data": [],
  "pagination": {}
}
```

---

## Update Lead Status

### Endpoint

```http
PATCH /update-lead/status/:id
```

### Request Body

```json
{
  "status": "CONTACTED"
}
```

---

## Update Lead Notes

### Endpoint

```http
PATCH /update-lead/details/:id
```

### Request Body

```json
{
  "notes": "Follow up next week"
}
```

---

## Delete Lead

### Endpoint

```http
DELETE /delete-lead/:id
```

### Success Response

```json
{
  "success": true,
  "message": "Lead deleted successfully"
}
```

---

# Docker

## Build Image

```bash
docker build -t lead-management-backend .
```

---

## Run Container

```bash
docker run -d \
-p 8080:8080 \
--env-file .env \
lead-management-backend
```

---

# Docker Hub

## Login

```bash
docker login
```

---

## Tag Image

```bash
docker tag lead-management-backend YOUR_DOCKER_USERNAME/lead-management-backend:latest
```

---

## Push Image

```bash
docker push YOUR_DOCKER_USERNAME/lead-management-backend:latest
```

---

# Pull and Run From Docker Hub

```bash
docker pull YOUR_DOCKER_USERNAME/lead-management-backend:latest
```

```bash
docker run -d \
-p 8080:8080 \
--env-file .env \
YOUR_DOCKER_USERNAME/lead-management-backend:latest
```

---

# CI/CD Deployment Flow

```text
Developer Pushes Code
        │
        ▼
GitHub Repository
        │
        ▼
GitHub Actions
        │
        ├── Install Dependencies
        ├── Run Build
        ├── Build Docker Image
        ├── Login Docker Hub
        └── Push Docker Image
                │
                ▼
           Docker Hub
                │
                ▼
          Production Server
                │
                ▼
           Docker Pull
                │
                ▼
          Docker Run
```

---

## Author

Harsh Kumar

Backend Developer | Node.js | Express.js | PostgreSQL | Prisma | AWS
