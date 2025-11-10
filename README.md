# Gamify Productivity

A full-stack gamified productivity app built with NestJS and Next.js.

## Features

- **Quests**: Main Quests and Sub-quests with boss fights
- **Missions**: Daily tasks that grant XP
- **XP & Levels**: Earn XP to level up
- **Streaks**: Maintain daily completion streaks
- **Rewards**: Unlock rewards at XP thresholds
- **Achievements**: Auto-awarded achievements for milestones
- **Boss Fights**: Special milestones with deadlines and bonus XP

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- MongoDB (via Docker Compose)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MongoDB

```bash
docker-compose up -d
```

This starts MongoDB on port 27017 and Mongo Express on port 8081.

### 3. Configure Environment Variables

#### Backend (`apps/api/.env`)

```env
MONGO_URI=mongodb://localhost:27017/gamify
JWT_SECRET=change_me_to_a_secure_secret
JWT_EXPIRES=15m
REFRESH_EXPIRES=7d
PORT=4000
```

#### Frontend (`apps/web/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Seed Database

```bash
cd apps/api
npm run seed
```

This creates a demo user:
- Email: `demo@demo.dev`
- Password: `demo1234`
- Initial XP: 130

### 5. Run Development Servers

From the root directory:

```bash
npm run dev
```

Or run separately:

```bash
# Backend (port 4000)
npm run dev:api

# Frontend (port 3000)
npm run dev:web
```

## Project Structure

```
gamify-productivity/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/           # Next.js frontend
├── docker-compose.yml
└── package.json
```

## API Endpoints

### Auth
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user profile

### Quests
- `POST /quests` - Create quest
- `GET /quests` - List quests (filtered by type/status)
- `PATCH /quests/:id` - Update quest
- `POST /quests/:id/complete` - Complete quest (boss fight bonus XP)

### Missions
- `POST /missions` - Create mission
- `GET /missions` - List missions (filtered by day/status)
- `POST /missions/:id/done` - Complete mission (grants XP, updates streak)

### Rewards
- `GET /rewards` - List rewards (available/locked/claimed)
- `POST /rewards/:id/claim` - Claim reward

### Achievements
- `GET /achievements` - List awarded achievements

### XP
- `GET /xp/events` - List XP events (paginated)

## Testing

```bash
# Backend tests
cd apps/api
npm test

# Lint
npm run lint
```

## Production Build

```bash
npm run build
```

## Admin Notes

- Mongo Express UI: http://localhost:8081
- Default credentials: admin/admin
- Demo user is seeded with initial data for testing

