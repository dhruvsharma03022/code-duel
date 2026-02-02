# CodeDuel Platform - Complete Setup Guide

This guide will walk you through setting up the complete CodeDuel 1v1 competitive coding platform from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ (https://nodejs.org/)
- PostgreSQL 14+ (https://www.postgresql.org/download/)
- Redis 6+ (https://redis.io/download/)
- Git (https://git-scm.com/)

## Part 1: Database Setup

### 1.1 Install PostgreSQL

**Windows:**
```bash
# Download installer from postgresql.org
# Run installer and remember your password
```

**Mac:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 1.2 Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE codeduel;
CREATE USER codeadmin WITH ENCRYPTED PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE codeduel TO codeadmin;
\q
```

### 1.3 Install Redis

**Windows:**
```bash
# Download from https://github.com/microsoftarchive/redis/releases
# Or use WSL
```

**Mac:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**Verify Redis:**
```bash
redis-cli ping
# Should return: PONG
```

## Part 2: Backend Setup

### 2.1 Navigate to Backend Directory

```bash
cd backend
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your favorite editor
nano .env  # or vim .env or code .env
```

Update the following values in `.env`:
```env
PORT=3000
NODE_ENV=development

# Database - Update with your PostgreSQL credentials
DATABASE_URL=postgresql://codeadmin:your_password_here@localhost:5432/codeduel
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codeduel
DB_USER=codeadmin
DB_PASSWORD=your_password_here

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT - Generate a secure random string
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRES_IN=7d

# Code Execution
PISTON_API_URL=https://emkc.org/api/v2/piston

# CORS
FRONTEND_URL=http://localhost:5173

# Invite Links
INVITE_EXPIRY_HOURS=24
```

### 2.4 Run Database Migrations

```bash
npm run migrate
```

You should see:
```
✅ Users table created
✅ Problems table created
✅ Invites table created
✅ Matches table created
✅ Rating history table created
🎉 Database migration completed successfully!
```

### 2.5 Seed Database with Sample Problems

```bash
npm run seed
```

You should see:
```
✅ Inserted problem: Two Sum
✅ Inserted problem: Palindrome Number
... (more problems)
🎉 Database seeding completed successfully!
```

### 2.6 Start Backend Server

```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Redis connected successfully
🚀 Server running on port 3000
📡 Socket.io ready for connections
🌍 Environment: development
```

**Keep this terminal running!**

## Part 3: Frontend Setup

### 3.1 Open New Terminal and Navigate to Frontend

```bash
cd frontend  # From project root
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.3 Configure Environment Variables

```bash
# Create .env file
touch .env

# Add the following
echo "VITE_API_URL=http://localhost:3000" >> .env
echo "VITE_SOCKET_URL=http://localhost:3000" >> .env
```

### 3.4 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3.5 Access the Application

Open your browser and go to: **http://localhost:5173**

## Part 4: Testing the Application

### 4.1 Create Test Users

1. Click "Register" or go to `/register`
2. Create first user:
   - Username: `alice_codes`
   - Email: `alice@example.com`
   - Password: `password123`

3. Logout and create second user:
   - Username: `bob_dev`
   - Email: `bob@example.com`
   - Password: `password123`

### 4.2 Test Invite Flow

1. Login as Alice
2. Click "Create Invite"
3. Copy the invite link
4. Open a new incognito/private window
5. Login as Bob
6. Paste the invite link
7. Both users should be in a match!

### 4.3 Test Coding Battle

1. Both users should see the same problem
2. Try solving the problem in the code editor
3. Click "Submit Solution"
4. First correct submission wins!
5. Check rating changes

## Part 5: Troubleshooting

### Backend won't start

**Error: "Database connection failed"**
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U codeadmin -d codeduel -h localhost
```

**Error: "Redis connection failed"**
```bash
# Check if Redis is running
redis-cli ping

# Start Redis if needed
sudo systemctl start redis-server
```

**Error: "Port 3000 already in use"**
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or change PORT in .env
```

### Frontend won't start

**Error: "Port 5173 already in use"**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Error: "Cannot connect to backend"**
- Ensure backend is running on port 3000
- Check VITE_API_URL in frontend/.env
- Check for CORS issues in browser console

### Socket.io Issues

**Users can't see each other in match:**
- Check browser console for Socket.io errors
- Ensure both users are authenticated
- Check VITE_SOCKET_URL configuration

## Part 6: Production Deployment

### 6.1 Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Create account on Railway.app or Render.com
3. Create new project from GitHub repo
4. Add environment variables (from .env)
5. Deploy!

**Environment Variables for Production:**
```env
NODE_ENV=production
DATABASE_URL=<provided-by-host>
REDIS_URL=<provided-by-host>
JWT_SECRET=<generate-new-secret>
FRONTEND_URL=<your-frontend-url>
```

### 6.2 Frontend Deployment (Vercel/Netlify)

1. Push code to GitHub
2. Create account on Vercel.com
3. Import GitHub repository
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variables:
   ```
   VITE_API_URL=<your-backend-url>
   VITE_SOCKET_URL=<your-backend-url>
   ```
7. Deploy!

### 6.3 Database Hosting

**Option 1: Railway PostgreSQL**
- Automatic PostgreSQL addon
- Update DATABASE_URL in backend

**Option 2: Supabase**
- Free PostgreSQL database
- Get connection string
- Update DATABASE_URL

**Option 3: Neon**
- Serverless PostgreSQL
- Good free tier

### 6.4 Redis Hosting

**Option 1: Railway Redis**
- Automatic Redis addon

**Option 2: Upstash**
- Serverless Redis
- Free tier available

**Option 3: Redis Cloud**
- Managed Redis service

## Part 7: Next Steps

### Features to Add

1. **Real-time Rankings**
   - Live leaderboard updates
   - Rank tiers (Bronze, Silver, Gold, etc.)

2. **Problem Management**
   - Admin panel to add problems
   - Problem difficulty balancing

3. **Match History**
   - Detailed match analytics
   - Code review of past matches

4. **Social Features**
   - Friend system
   - Challenge friends directly
   - Chat during matches

5. **Advanced Features**
   - Tournament mode
   - Team battles (2v2)
   - Time-limited events
   - Achievements and badges

### Performance Optimization

1. **Database Indexing**
   - Already added in migrations
   - Monitor slow queries

2. **Caching**
   - Cache problem data in Redis
   - Cache leaderboard

3. **Code Execution**
   - Consider self-hosted Judge0
   - Rate limiting on submissions

### Security Enhancements

1. **Rate Limiting**
   - Limit API requests per user
   - Prevent spam submissions

2. **Input Validation**
   - Sanitize all user inputs
   - Validate code submissions

3. **HTTPS**
   - Use SSL certificates in production
   - Enforce HTTPS redirects

## Part 8: Monitoring and Maintenance

### Logging

```bash
# View backend logs
cd backend
npm run dev  # Shows all logs

# Production logs (if using PM2)
pm2 logs codeduel-backend
```

### Database Maintenance

```bash
# Clean up expired invites
curl -X DELETE http://localhost:3000/api/invites/cleanup/expired

# Backup database
pg_dump codeduel > backup.sql

# Restore database
psql codeduel < backup.sql
```

### Redis Monitoring

```bash
# Check Redis status
redis-cli info

# Monitor commands
redis-cli monitor

# Check memory usage
redis-cli info memory
```

## Support and Resources

- **Piston API Docs**: https://github.com/engineer-man/piston
- **Socket.io Docs**: https://socket.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **React Docs**: https://react.dev/

---

## Quick Start (After Initial Setup)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev

# Open browser: http://localhost:5173
```

Happy Coding! 🚀
