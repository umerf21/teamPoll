# Live Polling App

A real-time polling web application with WebSocket-based live vote updates, anonymous JWT authentication, rate-limited voting via Redis, and PostgreSQL-backed persistence.

---

## Features

- Anonymous user auth using JWT
- Cast votes on polls with options
- Real-time vote count updates via WebSocket
- Rate-limited voting (via Redis)
- Secure REST + WebSocket API
- Dockerized frontend, backend, DB, and Redis
- Built with Node.js, React, PostgreSQL, Redis, WebSockets

---

## Tech Stack

| Layer     | Tech                           |
|-----------|--------------------------------|
| Frontend  | React, React Router, Axios     |
| Backend   | Node.js, Express, WebSocket    |
| Auth      | JWT (Anonymous tokens)         |
| DB        | PostgreSQL                     |
| Cache     | Redis (for rate-limiting)      |
| DevOps    | Docker, Docker Compose         |

---

## Project Structure

project-root/
│
├── backend/ # Express API server
│ ├── src/
│ ├── Dockerfile
│ └── ...
│
├── frontend/ # React frontend
│ ├── src/
│ ├── Dockerfile
│ └── ...
│
├── docker-compose.yml # Container orchestration
└── README.md


---

## 🐳 Docker Setup

### 1. Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### 2. Start all services

```bash
docker-compose up --build
```
3. Services
Service	URL
Frontend	http://localhost:3000
Backend	http://localhost:3001
Redis	localhost:6379
Postgres	localhost:5432

## Frontend (React)
Key Features:
* Anonymous token stored in sessionStorage
* Static Poll ID loads poll data
* Submit vote
* results page with live updates via WebSocket

## Backend (Node.js + WebSocket)
Endpoints
Method	Route	Description
POST	/auth/anon	Get anonymous JWT token
GET	/poll/:id	Get poll with options
POST	/poll/:id/vote	Cast a vote (JWT required)
WS	/poll/:id	WebSocket updates for poll

Environment Variables
Set in docker-compose.yml:
```bash
JWT_SECRET=supersecret
PG_HOST=db
PG_USER=postgres
PG_PASSWORD=postgres
PG_DATABASE=polling
REDIS_HOST=redis
REDIS_PORT=6379
```