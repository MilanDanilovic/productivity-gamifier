# Troubleshooting Guide

## Frontend Not Accessible

### Step 1: Check if dependencies are installed

```bash
# From root directory
npm install
```

### Step 2: Check if MongoDB is running

```bash
docker-compose up -d
```

Verify MongoDB is running:
```bash
docker ps
```

You should see `gamify-mongo` container running.

### Step 3: Create Environment Files

#### Backend (`apps/api/.env`)
Create this file if it doesn't exist:

```env
MONGO_URI=mongodb://localhost:27017/gamify
JWT_SECRET=change_me_to_a_secure_secret
JWT_EXPIRES=15m
REFRESH_EXPIRES=7d
PORT=4000
```

#### Frontend (`apps/web/.env.local`)
Create this file if it doesn't exist:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Step 4: Start the Development Servers

#### Option A: Start both together (from root)
```bash
npm run dev
```

#### Option B: Start separately

Terminal 1 (Backend):
```bash
cd apps/api
npm run start:dev
```

Terminal 2 (Frontend):
```bash
cd apps/web
npm run dev
```

### Step 5: Check Ports

- **Frontend**: Should be running on http://localhost:3000
- **Backend**: Should be running on http://localhost:4000

### Step 6: Common Issues

#### Issue: Port 3000 already in use
```bash
# Windows: Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change Next.js port
cd apps/web
npm run dev -- -p 3001
```

#### Issue: Dependencies not installed
```bash
# From root
npm install

# Or install in each workspace
cd apps/api && npm install
cd ../web && npm install
```

#### Issue: MongoDB connection error
- Make sure Docker is running
- Check if MongoDB container is up: `docker ps`
- Restart MongoDB: `docker-compose restart`

#### Issue: TypeScript errors
```bash
# Clean and rebuild
cd apps/web
rm -rf .next
npm run dev
```

#### Issue: Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
npm install
```

### Step 7: Verify Setup

1. **Backend is running**: Check http://localhost:4000 (should show error or API response)
2. **Frontend is running**: Check http://localhost:3000 (should show login page)
3. **MongoDB is running**: Check http://localhost:8081 (Mongo Express)

### Step 8: Check Console Output

Look for:
- ✅ "API running on http://localhost:4000" (backend)
- ✅ "Ready in Xms" or "Local: http://localhost:3000" (frontend)
- ❌ Any error messages

### Step 9: Browser Console

Open browser DevTools (F12) and check:
- Network tab: Are API calls failing?
- Console tab: Any JavaScript errors?
- Application tab: Check if tokens are stored

### Step 10: Test API Connection

Open browser and go to:
```
http://localhost:4000/auth/login
```

You should see an error (expected - it's a POST endpoint), but it confirms the API is running.

## Quick Fix Commands

```bash
# Full reset
cd "C:\Wikend SAAS\gamify productivity"
docker-compose down
docker-compose up -d
npm install
cd apps/api && npm run seed
cd ../..
npm run dev
```

