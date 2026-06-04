# Small Business CRM

A full-stack Lead Management CRM built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Docker, and GitHub Actions.

This project helps businesses manage customer leads, track lead progression through the sales pipeline, and maintain lead records through a modern dashboard interface.

---

## Architecture

```text
Frontend (React + Vite)
          │
          ▼
Backend API (Node.js + Express)
          │
          ▼
PostgreSQL Database
          │
          ▼
Prisma ORM
```

---

## Features

### Lead Management

* Create leads
* View leads
* Search leads
* Filter leads
* Sort leads
* Update lead status
* Update lead notes
* Delete leads

### Dashboard

* Total leads
* Open pipeline tracking
* Converted leads
* Lost leads
* Pagination support

### Infrastructure

* Dockerized frontend
* Dockerized backend
* PostgreSQL integration
* CI/CD with GitHub Actions
* Docker Hub image publishing

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL

### DevOps

* Docker
* GitHub Actions
* Docker Hub

---

## Repository Structure

```bash
.
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
└── .github/
    └── workflows/
        ├── cd_frontend.yml
        └── cd_backend.yml
```

---

## Local Development

### Clone Repository

```bash
git clone <repository-url>
cd small-business-crm
```

---

## Start Backend

```bash
cd backend

npm install

npm run dev
```

Backend:

```text
http://localhost:8080
```

---

## Start Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Environment Variables

Backend `.env`

```env
DATABASE_URL=postgresql://username:password@localhost:5432/crm
```

---

## Docker

### Backend

Build:

```bash
docker build -t crm-backend ./backend
```

Run:

```bash
docker run -p 8080:8080 crm-backend
```

---

### Frontend

Build:

```bash
docker build -t crm-frontend ./frontend
```

Run:

```bash
docker run -p 5173:5173 crm-frontend
```

---

# CI/CD Pipeline

The project uses GitHub Actions for automated Docker image builds and publishing.

## Backend Workflow

When code is pushed to the `main` branch:

1. Checkout repository
2. Configure Docker Buildx
3. Authenticate with Docker Hub
4. Build backend Docker image
5. Push image to Docker Hub

Published image:

```text
<dockerhub-username>/crm-backend:<commit-sha>
```

---

## Frontend Workflow

When code is pushed to the `main` branch:

1. Checkout repository
2. Configure Docker Buildx
3. Authenticate with Docker Hub
4. Build frontend Docker image
5. Push image to Docker Hub

Published image:

```text
<dockerhub-username>/crm-frontend:<commit-sha>
```

---

## Deployment Flow

```text
Developer Push
      │
      ▼
GitHub Repository
      │
      ▼
GitHub Actions
      │
      ├── Build Backend Image
      ├── Push Backend Image
      │
      ├── Build Frontend Image
      └── Push Frontend Image
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
Application Running
```

---

## Future Enhancements

* Authentication
* Role-Based Access Control
* Lead Assignment
* Activity Logs
* Email Notifications
* CSV Export
* Analytics Dashboard
* AWS Deployment
* Kubernetes Deployment

---

## Author

Harsh Kumar

Engineering Student | MERN Stack Developer | Node.js | React | PostgreSQL | Docker
