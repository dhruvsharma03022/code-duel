# CodeDuel - Real-Time 1v1 Competitive Coding Platform


## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Target Users (Personas)](#target-users-personas)
- [Vision Statement](#vision-statement)
- [Key Features / Goals](#key-features--goals)
- [Success Metrics](#success-metrics)
- [Assumptions & Constraints](#assumptions--constraints)
- [Quick Start - Local Development](#quick-start---local-development)
- [Branching Strategy](#branching-strategy)
- [Tech Stack](#tech-stack)

---

##  Project Overview

**CodeDuel** is a real-time competitive coding platform that enables developers to engage in head-to-head programming battles. Users can challenge friends via invite links or get matched with opponents of similar skill levels, compete to solve coding problems first, and climb the leaderboard through an ELO-based rating system.

### What Makes CodeDuel Unique?
-  **Real-time synchronization** - See your opponent's progress live
- **Gamified experience** - ELO ratings, leaderboards, and competitive matches
- **Social features** - Invite links to challenge specific friends
-  **Instant feedback** - Automated test case validation
-  **Fair matchmaking** - Skill-based rating system

---

##  Problem Statement

### The Challenge
While platforms like LeetCode and HackerRank excel at individual practice, they lack engaging real-time competitive experiences. Developers need:

1. **Real-time competition** - Not asynchronous leaderboards, but live head-to-head battles
2. **Quick matches** - 5-15 minute coding duels, not hours-long contests
3. **Skill-based matching** - Face opponents at your level
4. **Social engagement** - Challenge friends and track rivalries
5. **Immediate gratification** - Know instantly if you won

### Current Gaps in the Market
- **LeetCode/HackerRank**: Solo practice, no real-time competition
- **Codeforces/TopCoder**: Large contests, not quick 1v1 matches
- **Interview platforms**: Focus on hiring, not competitive fun

### Our Solution
CodeDuel bridges this gap by providing instant, exciting 1v1 coding battles with real-time synchronization, automated judging, and a competitive ranking system.

---

## Target Users (Personas)

### Persona 1: Alex - The Interview Prep Student
- **Age**: 22 | **Role**: CS Senior | **Experience**: Intermediate
- **Goals**: Practice under pressure, track improvement, compete with classmates
- **Pain Points**: Solo practice is boring, can't simulate interview pressure
- **How CodeDuel Helps**: Real-time pressure, instant feedback, leaderboards

### Persona 2: Maya - The Competitive Programmer  
- **Age**: 25 | **Role**: Software Developer | **Experience**: Advanced
- **Goals**: Stay sharp, compete with skilled developers, build reputation
- **Pain Points**: Contest schedules don't fit, want quick matches
- **How CodeDuel Helps**: Quick 1v1 matches anytime, ELO rankings, flexible

### Persona 3: Jordan - The Coding Bootcamp Student
- **Age**: 28 | **Role**: Career Switcher | **Experience**: Beginner-Intermediate
- **Goals**: Practice algorithms fun way, learn from others, build confidence
- **Pain Points**: Intimidated by big platforms, needs motivation
- **How CodeDuel Helps**: Friendly 1v1 format, gradual progression, visual feedback

---

##  Vision Statement

**"To become the premier platform for real-time competitive coding, where developers of all skill levels can engage in exciting 1v1 programming battles, improve their skills through gamified competition, and connect with a global community of coding enthusiasts."**

### 3-Year Vision
- **Year 1**: Launch MVP, reach 10,000+ active users
- **Year 2**: Add tournaments & mobile apps, reach 100,000+ users  
- **Year 3**: Become go-to platform, integrate with educational institutions

---

##  Key Features / Goals

### Phase 1: Core Features (MVP)
1.  User Authentication & Profiles (JWT, stats, history)
2.  Invite System (unique links, time-limited)
3.  Real-Time Match System (WebSocket, live status)
4.  Code Editor (Monaco, syntax highlighting, multi-language)
5.  Automated Code Execution (Piston API, test validation)
6.  ELO Rating System (dynamic calculations, history)
7.  Leaderboard (global rankings, search)

### Phase 2: Enhanced Features
8.  Match History & Analytics
9.  Problem Library (categories, difficulty levels)
10.  In-Match Communication (typing indicators, chat)

### Phase 3: Advanced Features
11.  Tournament Mode (brackets, prizes)
12.  Team Battles (2v2, team ratings)
13.  Practice Mode (no rating impact)
14.  Achievements & Badges

---

##  Success Metrics

### User Metrics
- 10,000 registered users in 6 months
- 500+ Daily Active Users by Month 3
- 20% month-over-month growth

### Engagement Metrics  
- 5+ matches per user per week
- 20+ minute average session
- 60% weekly retention rate
- 85% match completion rate

### Technical Metrics
- < 200ms API response (95th percentile)
- < 100ms WebSocket latency
- < 5s code execution time
- 99.5% uptime
- Support 100+ concurrent matches

### Quality Metrics
- < 5 critical bugs/month
- 4.0/5.0+ user satisfaction
- 99% code execution accuracy
- ±150 rating matchmaking fairness

---

##  Assumptions & Constraints

### Assumptions
- Piston API remains free and accessible
- Users have modern browsers & 5+ Mbps internet
- WebSocket connections stable for 99%+ users
- Team has React/Node.js expertise
- 4-5 month MVP timeline achievable

### Constraints
- < 100ms WebSocket latency required
- Dependent on Piston API (single point of failure)
- Must use free-tier services initially
- Small team (2-4 developers)
- MVP must launch within 5 months
- Mobile apps deferred to Phase 2

---

##  Quick Start - Local Development

### Prerequisites
- Node.js 18+ | PostgreSQL 14+ | Redis 6+ | Docker Desktop | Git

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/codeduel-platform.git
cd codeduel-platform

# Start all services
docker-compose up

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Option 2: Manual Setup

**1. Database Setup**
```bash
# PostgreSQL
sudo -u postgres psql
CREATE DATABASE codeduel;
CREATE USER codeadmin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE codeduel TO codeadmin;

# Redis  
sudo systemctl start redis-server
redis-cli ping  # Should return PONG
```

**2. Backend**
```bash
cd backend
npm install
cp .env.example .env  # Edit with your credentials
npm run migrate
npm run seed
npm run dev  # Runs on :3000
```

**3. Frontend**
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:3000" > .env
npm run dev  # Runs on :5173
```

### Verify Setup
```bash
curl http://localhost:3000/health  # {"status":"ok"}
```

Then create users and test matches at http://localhost:5173

---

## 🌿 Branching Strategy

**We follow GitHub Flow** - simple, trunk-based workflow

### Branch Types
- `main` - Production-ready (protected)
- `feature/*` - New features
- `bugfix/*` - Bug fixes  
- `hotfix/*` - Critical production fixes

### Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature

# Develop & commit
git commit -m "feat: add feature"

# Push & create PR
git push origin feature/your-feature

# After merge, delete branch
git branch -d feature/your-feature
```

### Commit Convention
```
feat: new feature
fix: bug fix
docs: documentation
test: add tests
refactor: code restructure
```

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Monaco Editor, Socket.io-client

**Backend:** Node.js, Express, Socket.io, PostgreSQL, Redis, JWT

**Code Execution:** Piston API

**DevOps:** Docker, Vercel, Railway/Render, GitHub Actions


