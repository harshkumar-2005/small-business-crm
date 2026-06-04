# Lead Management CRM Frontend

Modern CRM dashboard built using React, TypeScript, Vite, and Tailwind CSS.

The application helps businesses manage leads, track conversions, update statuses, and monitor sales pipelines through a clean and responsive interface.

---

## Features

### Lead Management

* Create new leads
* View all leads
* Edit lead details
* Update lead status
* Delete leads

### Search & Filtering

* Search by:

  * Name
  * Email
  * Company Name
* Filter leads by status
* Reset filters instantly

### Sorting

* Sort by:

  * Newest First
  * Oldest First
  * Name
  * Status

### Dashboard Analytics

* Total Leads
* Open Pipeline
* Converted Leads
* Lost Leads
* Active Leads

### User Experience

* Responsive Design
* Modal-based Forms
* Success & Error Notifications
* Pagination
* Real-time Status Updates

---

## Tech Stack

| Technology     | Purpose               |
| -------------- | --------------------- |
| React 19       | Frontend Library      |
| TypeScript     | Type Safety           |
| Vite           | Build Tool            |
| Tailwind CSS 4 | Styling               |
| Fetch API      | Backend Communication |

---

## Project Structure

```bash
src/
├── App.tsx
├── App.css
├── index.css
├── main.tsx
│
├── components/
│   └── (optional future components)
│
├── hooks/
│   └── (future custom hooks)
│
└── services/
    └── (future API layer)
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## Running Locally

Development Server:

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:5173
```

---

## Build Production Assets

```bash
npm run build
```

Preview Production Build:

```bash
npm run preview
```

---

## Backend Integration

The frontend communicates with the backend through Vite proxy configuration.

```ts
server: {
  proxy: {
    '/v1/api/backend': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

This allows frontend requests to be forwarded automatically to the backend server during development.

---

## CRM Workflow

```text
Create Lead
     │
     ▼
New
     │
     ▼
Contacted
     │
     ▼
Qualified
     │
     ▼
Converted
```

Alternative path:

```text
New
 │
 ▼
Contacted
 │
 ▼
Lost
```

---

## Available Lead Statuses

* New
* Contacted
* Qualified
* Converted
* Lost

---

## API Endpoints Used

### Fetch Leads

```http
GET /v1/api/backend/customer/all-lead
```

### Create Lead

```http
POST /v1/api/backend/customer/create-lead
```

### Update Lead Status

```http
PATCH /v1/api/backend/customer/update-lead/status/:id
```

### Update Lead Notes

```http
PATCH /v1/api/backend/customer/update-lead/details/:id
```

### Delete Lead

```http
DELETE /v1/api/backend/customer/delete-lead/:id
```

---

## Docker

### Build Image

```bash
docker build -t crm-frontend .
```

### Run Container

```bash
docker run -d -p 5173:5173 crm-frontend
```

---

## Future Improvements

* Authentication & Authorization
* Role Based Access Control
* Lead Assignment
* Activity Timeline
* Lead Conversion Reports
* Export CSV
* Dark / Light Themes
* Charts & Analytics
* WebSocket Notifications

---

## Author

Harsh Kumar

Frontend Developer | React | TypeScript | Tailwind CSS | Node.js
