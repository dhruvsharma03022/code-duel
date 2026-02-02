# CodeDuel - Quick Reference Card

## 🚀 Quick Start Commands

### First Time Setup
```bash
# 1. Setup PostgreSQL Database
sudo -u postgres psql
CREATE DATABASE codeduel;
CREATE USER codeadmin WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE codeduel TO codeadmin;
\q

# 2. Start Redis
sudo systemctl start redis-server
redis-cli ping  # Should return PONG

# 3. Backend Setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run migrate
npm run seed
npm run dev

# 4. Frontend Setup (new terminal)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
echo "VITE_SOCKET_URL=http://localhost:3000" >> .env
npm run dev
```

### Daily Development
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev

# Access: http://localhost:5173
```

## 📁 Project Structure

```
codeduel-platform/
├── backend/
│   ├── src/
│   │   ├── server.js           # Main server entry
│   │   ├── config/             # Database & Redis config
│   │   ├── models/             # Data models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & error handling
│   │   ├── socket/             # WebSocket handlers
│   │   └── database/           # Migrations & seeds
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API calls
│   │   └── utils/              # Utilities
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md
└── .gitignore
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Matches
- `POST /api/matches/join/:inviteCode` - Join match
- `GET /api/matches/:id` - Get match details
- `POST /api/matches/:id/submit` - Submit solution
- `GET /api/matches/me/active` - Get active match

### Invites
- `POST /api/invites` - Create invite
- `GET /api/invites/:code` - Get invite details
- `GET /api/invites/me/invites` - Get my invites

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users` - Get leaderboard
- `GET /api/users/me/history` - Get match history

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:id` - Get problem details
- `GET /api/problems/random/get` - Get random problem

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/codeduel
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
PISTON_API_URL=https://emkc.org/api/v2/piston
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 📡 Socket.io Events

### Client → Server
- `join_match` - Join match room
- `leave_match` - Leave match room
- `typing` - Notify opponent of typing
- `stop_typing` - Stop typing notification
- `code_submitted` - Code submitted
- `running_tests` - Running test cases
- `request_rematch` - Request rematch
- `accept_rematch` - Accept rematch

### Server → Client
- `match_started` - Match has started
- `match_ready` - Both players connected
- `opponent_joined` - Opponent joined
- `opponent_typing` - Opponent is typing
- `opponent_submitted` - Opponent submitted code
- `match_completed` - Match finished
- `opponent_disconnected` - Opponent left

## 🗄️ Database Schema

### Users
```sql
id, username, email, password_hash, rating (default: 1200),
matches_played, matches_won, created_at, updated_at
```

### Problems
```sql
id, title, description, difficulty, test_cases (JSON),
constraints, time_limit, memory_limit
```

### Matches
```sql
id, player1_id, player2_id, problem_id, winner_id,
player1_submission, player2_submission, status,
started_at, completed_at, duration_seconds
```

### Invites
```sql
id, creator_id, invite_code, expires_at,
used_at, match_id, created_at
```

## 🎮 ELO Rating Formula

```javascript
Expected Score = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
New Rating = Old Rating + K * (Actual Score - Expected Score)

K-factor:
- 40 for new players (< 30 games)
- 32 for intermediate (< 2400 rating)
- 24 for high-rated players (≥ 2400 rating)
```

## 🧪 Supported Languages

- JavaScript (Node.js 18.15.0)
- Python (3.10.0)
- Java (15.0.2)
- C++ (10.2.0)
- C (10.2.0)
- Go (1.16.2)
- Rust (1.68.2)

## 🛠️ Useful Commands

### Database
```bash
# Run migrations
npm run migrate

# Seed problems
npm run seed

# Backup database
pg_dump codeduel > backup.sql

# Restore database
psql codeduel < backup.sql
```

### Redis
```bash
# Check status
redis-cli ping

# Monitor activity
redis-cli monitor

# Clear all data
redis-cli FLUSHALL
```

### Development
```bash
# Backend
npm run dev          # Development mode
npm start            # Production mode

# Frontend
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
```

## 🔍 Debugging

### Check Backend Health
```bash
curl http://localhost:3000/health
```

### Check Database Connection
```bash
psql -U codeadmin -d codeduel -h localhost
\dt  # List tables
```

### Check Redis Connection
```bash
redis-cli
ping
keys *
```

### View Logs
```bash
# Backend logs (in console)
# Frontend logs (browser console)
```

## 📊 Testing Flow

1. Create two users (Alice & Bob)
2. Login as Alice → Create invite
3. Login as Bob → Join via invite link
4. Both see match screen
5. Solve problem
6. Submit solution
7. First correct submission wins
8. Check rating changes

## 🚀 Deployment Checklist

### Backend
- [ ] Update DATABASE_URL with production DB
- [ ] Update REDIS_URL with production Redis
- [ ] Set NODE_ENV=production
- [ ] Generate new JWT_SECRET
- [ ] Set FRONTEND_URL to production URL
- [ ] Run migrations on production DB
- [ ] Seed problems

### Frontend
- [ ] Update VITE_API_URL with backend URL
- [ ] Update VITE_SOCKET_URL with backend URL
- [ ] Build: `npm run build`
- [ ] Deploy `dist/` folder

## 📞 Common Issues

**"Port already in use"**
```bash
lsof -ti:3000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

**"Database connection failed"**
- Check PostgreSQL is running
- Verify credentials in .env
- Check DATABASE_URL format

**"Redis connection failed"**
- Check Redis is running: `redis-cli ping`
- Start Redis: `sudo systemctl start redis-server`

**"Socket.io not connecting"**
- Check VITE_SOCKET_URL in frontend
- Verify CORS settings in backend
- Check browser console for errors

## 🎯 Next Features to Implement

1. Real-time leaderboard updates
2. Practice mode (no rating changes)
3. Friend system
4. Tournament brackets
5. Code review of past matches
6. Achievements and badges
7. Daily challenges
8. Problem difficulty filtering
9. Custom match settings
10. Mobile responsive design

---

💡 **Pro Tip**: Keep both terminals (backend & frontend) running side by side during development!
