# Quick Start Guide

## 🚀 Getting Started

### Step 1: Install Dependencies (if not done)
```bash
npm install
```

### Step 2: Setup Environment Files
```bash
# Run the setup script
powershell -ExecutionPolicy Bypass -File setup-env.ps1

# Or manually create:
# apps/api/.env
# apps/web/.env.local
```

### Step 3: Start MongoDB
```bash
docker-compose up -d
```

Wait for MongoDB to be ready (about 10 seconds).

### Step 4: Seed Database (First Time Only)
```bash
cd apps/api
npm run seed
cd ../..
```

### Step 5: Start Development Servers

#### Option A: Start Both Together (Recommended)
```bash
npm run dev
```

This will start:
- **Backend API**: http://localhost:4000
- **Frontend Web**: http://localhost:3000

#### Option B: Start Separately

**Terminal 1 - Backend:**
```bash
cd apps/api
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
npm run dev
```

### Step 6: Access the App

1. Open your browser
2. Go to: **http://localhost:3000**
3. You should see the login page

### Step 7: Login

Use the demo account:
- **Email**: `demo@demo.dev`
- **Password**: `demo1234`

## 🔧 Troubleshooting

### Frontend Not Loading?

1. **Check if frontend is running:**
   - Look for: `✓ Ready in Xms` or `Local: http://localhost:3000`
   - If not, check for errors in the terminal

2. **Check if backend is running:**
   - Look for: `API running on http://localhost:4000`
   - If not, check for errors in the terminal

3. **Check ports:**
   ```bash
   # Check if ports are in use
   netstat -ano | findstr ":3000 :4000"
   ```

4. **Check environment files:**
   - `apps/api/.env` should exist
   - `apps/web/.env.local` should exist

5. **Clear cache and rebuild:**
   ```bash
   cd apps/web
   rm -rf .next
   npm run dev
   ```

### Common Errors

**Error: "Cannot find module"**
```bash
npm install
```

**Error: "Port already in use"**
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Error: "MongoDB connection failed"**
```bash
docker-compose restart
```

**Error: "EADDRINUSE: address already in use :::4000"**
```bash
# Kill process on port 4000
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

## 📱 Testing the App

1. **Register a new account** or use demo credentials
2. **Complete a mission** to see XP and streak updates
3. **Check achievements** - First Blood should be awarded
4. **View rewards** - 100 XP reward should be claimable
5. **Customize avatar** - Equip claimed items

## 🎮 Features to Test

- ✅ Login/Register
- ✅ Dashboard with stats
- ✅ Complete missions (grants XP)
- ✅ View quests with urgency indicators
- ✅ Claim rewards
- ✅ View achievements
- ✅ Customize avatar

## 📝 Notes

- Frontend runs on **port 3000**
- Backend runs on **port 4000**
- MongoDB runs on **port 27017**
- Mongo Express runs on **port 8081**

If you can't access the frontend, check:
1. Is `npm run dev` running?
2. Are there any errors in the terminal?
3. Is port 3000 available?
4. Does `.env.local` exist in `apps/web/`?

