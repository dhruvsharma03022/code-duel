# Development Setup Guide - CodeDuel

## 📸 Required Screenshots for Submission

This guide includes all necessary screenshots to prove your development environment is working.

---

## Part 1: GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to https://github.com
2. Click "New Repository"
3. Repository name: `codeduel-platform`
4. Description: "Real-time 1v1 competitive coding platform"
5. Choose Public
6. Add .gitignore: Node
7. Add README.md
8. Click "Create Repository"

**📸 Screenshot 1: GitHub Repository Page**
- Show the main repository page
- Must show: Repository name, description, file structure
- File: `screenshots/01-github-repo.png`

---

### Step 2: Folder Structure

Create the following structure:

```
codeduel-platform/
├── .gitignore
├── README.md
├── docker-compose.yml
├── USER_STORIES.md
├── MOSCOW_WIREFRAMES.md
├── architecture-diagram.drawio
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       ├── socket/
│       └── database/
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── utils/
```

**Commands to create structure:**
```bash
# Create directories
mkdir -p backend/src/{config,models,routes,services,middleware,socket,database}
mkdir -p frontend/src/{components,pages,services,utils}

# Verify structure
tree -L 3
```

**📸 Screenshot 2: Folder Structure**
- Show output of `tree` command or VS Code explorer
- Must show: backend and frontend folders with subdirectories
- File: `screenshots/02-folder-structure.png`

---

### Step 3: .gitignore File

Your `.gitignore` should contain:

```gitignore
# Dependencies
node_modules/
.npm
.npm-global

# Environment variables
.env
.env.local
.env.production

# Logs
logs
*.log
npm-debug.log*

# Build outputs
dist/
build/
.vite/

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Testing
coverage/

# Misc
.cache/
tmp/
temp/

# Frontend specific
frontend/dist/

# Backend specific
backend/uploads/
```

**📸 Screenshot 3: .gitignore File**
- Show the contents of .gitignore in editor
- File: `screenshots/03-gitignore.png`

---

## Part 2: Branching Strategy

### Step 4: Configure Git and Create Branches

```bash
# Navigate to repository
cd codeduel-platform

# Initialize git (if not already)
git init

# Set up main branch
git branch -M main

# Create feature branch for authentication
git checkout -b feature/user-authentication

# View branches
git branch -a

# Return to main
git checkout main

# Create another feature branch
git checkout -b feature/match-system
```

**📸 Screenshot 4: Git Branches**
- Show output of `git branch -a` command
- Must show: main branch and at least 2 feature branches
- File: `screenshots/04-git-branches.png`

**📸 Screenshot 5: GitHub Branches Page**
- Go to GitHub repository → Branches tab
- Show multiple branches after pushing
- File: `screenshots/05-github-branches.png`

---

### Step 5: Branching Strategy Documentation

Already included in README.md. Verify it's there:

```bash
# Check README includes branching strategy
grep -A 20 "Branching Strategy" README.md
```

**📸 Screenshot 6: README Branching Strategy Section**
- Show README.md open with branching strategy section visible
- File: `screenshots/06-readme-branching.png`

---

## Part 3: Docker Setup

### Step 6: Install Docker Desktop

1. Download from https://www.docker.com/products/docker-desktop/
2. Install for your OS (Windows/Mac/Linux)
3. Start Docker Desktop
4. Verify installation:

```bash
docker --version
docker-compose --version
```

**📸 Screenshot 7: Docker Desktop Running**
- Show Docker Desktop application window
- Must show: Docker is running (green indicator)
- File: `screenshots/07-docker-desktop.png`

**📸 Screenshot 8: Docker Version**
- Show terminal output of `docker --version` and `docker-compose --version`
- File: `screenshots/08-docker-version.png`

---

### Step 7: Create Dockerfiles

Backend Dockerfile already created at `backend/Dockerfile`
Frontend Dockerfile already created at `frontend/Dockerfile`

**📸 Screenshot 9: Dockerfile Contents**
- Show both Dockerfiles side by side in editor
- File: `screenshots/09-dockerfiles.png`

---

### Step 8: Create docker-compose.yml

File already created at root. Verify it exists:

```bash
cat docker-compose.yml
```

**📸 Screenshot 10: docker-compose.yml**
- Show docker-compose.yml open in editor
- Must show: all services (postgres, redis, backend, frontend)
- File: `screenshots/10-docker-compose.png`

---

## Part 4: Build and Run with Docker

### Step 9: Build Docker Images

```bash
# Make sure you're in the project root
cd codeduel-platform

# Build all images
docker-compose build

# This will take 5-10 minutes on first build
```

**📸 Screenshot 11: Docker Build Success**
- Show terminal output of successful `docker-compose build`
- Must show: "Successfully built" for backend and frontend
- File: `screenshots/11-docker-build.png`

---

### Step 10: Start All Services

```bash
# Start all containers
docker-compose up

# Or run in detached mode
docker-compose up -d

# View running containers
docker ps
```

**📸 Screenshot 12: Docker Containers Running**
- Show output of `docker ps` command
- Must show: postgres, redis, backend, frontend containers with "Up" status
- File: `screenshots/12-docker-ps.png`

**📸 Screenshot 13: Docker Compose Up Output**
- Show terminal output of `docker-compose up`
- Must show: All services starting successfully
- File: `screenshots/13-docker-up.png`

---

## Part 5: Verify Application Works

### Step 11: Check Backend Health

```bash
# Test backend health endpoint
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"2026-01-25T..."}
```

**📸 Screenshot 14: Backend Health Check**
- Show terminal with curl command and response
- File: `screenshots/14-backend-health.png`

---

### Step 12: Access Frontend in Browser

1. Open browser
2. Go to http://localhost:5173
3. You should see the CodeDuel landing page

**📸 Screenshot 15: Frontend Running in Browser**
- Show browser window with CodeDuel app loaded
- Must show: URL bar showing localhost:5173
- Must show: Application interface rendered
- File: `screenshots/15-frontend-browser.png`

---

### Step 13: Test Full Flow

1. Click "Sign Up" or "Register"
2. Create a user account
3. Login successfully
4. See the lobby/dashboard

**📸 Screenshot 16: User Registration**
- Show registration form filled out
- File: `screenshots/16-user-registration.png`

**📸 Screenshot 17: Application Lobby**
- Show logged-in user on dashboard/lobby page
- Must show: User profile/rating visible
- File: `screenshots/17-app-lobby.png`

---

## Part 6: Docker Commands Reference

### Useful Docker Commands

```bash
# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Stop all services
docker-compose down

# Stop and remove volumes (full reset)
docker-compose down -v

# Restart a specific service
docker-compose restart backend

# View resource usage
docker stats

# Execute command in running container
docker-compose exec backend npm run migrate

# Access PostgreSQL
docker-compose exec postgres psql -U codeadmin -d codeduel
```

**📸 Screenshot 18: Docker Logs**
- Show output of `docker-compose logs backend` (last 50 lines)
- Must show: Server running messages
- File: `screenshots/18-docker-logs.png`

---

## Part 7: Local Development Tools

### Step 14: Document Your Tools

Add this to README.md under "Development Tools" section:

```markdown
## 🛠️ Local Development Tools

### Code Editor
- **VS Code** - Recommended IDE
  - Extensions: ESLint, Prettier, Docker, GitLens
  
### API Testing
- **Postman** or **Thunder Client** (VS Code extension)
- Test endpoints at http://localhost:3000/api/

### Database Client
- **pgAdmin** or **DBeaver**
- Connect to: localhost:5432
- Database: codeduel
- User: codeadmin

### Redis Client
- **RedisInsight** or **Redis CLI**
- Connect to: localhost:6379

### Terminal
- **iTerm2** (Mac), **Windows Terminal**, or **Hyper**

### Browser DevTools
- Chrome DevTools for debugging frontend
- Network tab for API calls
- Console for logs
```

**📸 Screenshot 19: VS Code with Project Open**
- Show VS Code with project opened
- Must show: File explorer, terminal, code editor
- File: `screenshots/19-vscode-setup.png`

---

## Part 8: GitHub Repository Final View

### Step 15: Push Everything to GitHub

```bash
# Add all files
git add .

# Commit
git commit -m "feat: initial project setup with Docker"

# Push to main
git push origin main

# Push feature branches
git checkout feature/user-authentication
git push origin feature/user-authentication

git checkout feature/match-system
git push origin feature/match-system
```

**📸 Screenshot 20: GitHub Repository with Files**
- Show GitHub repository page with all files committed
- Must show: README.md, docker-compose.yml, backend/, frontend/
- File: `screenshots/20-github-files.png`

**📸 Screenshot 21: GitHub Branches View**
- Show GitHub branches page with main and feature branches
- File: `screenshots/21-github-branches-final.png`

**📸 Screenshot 22: README.md Preview on GitHub**
- Show GitHub rendering of README.md with all sections
- Must show: Vision statement, branching strategy, quick start
- File: `screenshots/22-github-readme.png`

---

## Quick Start Summary (for README.md)

Already included in your README.md:

```markdown
## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js 18+ | PostgreSQL 14+ | Redis 6+ | Docker Desktop | Git

### Option 1: Docker Compose (Recommended)

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/codeduel-platform.git
cd codeduel-platform

# Start all services
docker-compose up

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
\`\`\`
```

---

## Troubleshooting

### Issue: Port already in use

```bash
# Check what's using the port
lsof -ti:3000  # Backend
lsof -ti:5173  # Frontend
lsof -ti:5432  # PostgreSQL
lsof -ti:6379  # Redis

# Kill the process
lsof -ti:3000 | xargs kill -9
```

### Issue: Docker build fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Issue: Database connection failed

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Verify it's healthy
docker-compose ps
```

### Issue: Permission denied

```bash
# On Linux, you might need to add your user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

---

## Submission Checklist

### GitHub Repository
- [ ] README.md with vision document (all sections)
- [ ] USER_STORIES.md with 25 user stories
- [ ] MOSCOW_WIREFRAMES.md with prioritization
- [ ] architecture-diagram.drawio file
- [ ] Proper .gitignore file
- [ ] docker-compose.yml
- [ ] Backend Dockerfile
- [ ] Frontend Dockerfile
- [ ] Branching strategy documented in README
- [ ] At least 2 feature branches visible on GitHub

### Screenshots (22 total)
- [ ] 01-github-repo.png - Repository main page
- [ ] 02-folder-structure.png - Project structure
- [ ] 03-gitignore.png - .gitignore contents
- [ ] 04-git-branches.png - Local branches
- [ ] 05-github-branches.png - GitHub branches
- [ ] 06-readme-branching.png - Branching strategy in README
- [ ] 07-docker-desktop.png - Docker running
- [ ] 08-docker-version.png - Docker version
- [ ] 09-dockerfiles.png - Dockerfile contents
- [ ] 10-docker-compose.png - docker-compose.yml
- [ ] 11-docker-build.png - Successful build
- [ ] 12-docker-ps.png - Running containers
- [ ] 13-docker-up.png - Compose up output
- [ ] 14-backend-health.png - Backend health check
- [ ] 15-frontend-browser.png - App in browser
- [ ] 16-user-registration.png - Registration form
- [ ] 17-app-lobby.png - User lobby/dashboard
- [ ] 18-docker-logs.png - Docker logs
- [ ] 19-vscode-setup.png - VS Code with project
- [ ] 20-github-files.png - GitHub files view
- [ ] 21-github-branches-final.png - Final branches
- [ ] 22-github-readme.png - README on GitHub

### Documentation
- [ ] Vision document complete (problem, users, goals, metrics, constraints)
- [ ] 25 user stories formatted for GitHub Issues
- [ ] MoSCoW prioritization documented
- [ ] Figma wireframe specifications (6 screens)
- [ ] Architecture diagram created
- [ ] Branching strategy explained
- [ ] Quick Start guide in README
- [ ] All screenshots labeled and organized

---

## Final Notes

Your repository should demonstrate:
1. ✅ **Organization**: Clean folder structure, proper .gitignore
2. ✅ **Documentation**: Comprehensive README with all required sections
3. ✅ **Docker**: Working containerized development environment
4. ✅ **Git Workflow**: Multiple branches, proper branching strategy
5. ✅ **Proof of Work**: Screenshots showing everything running

Good luck with your submission! 🚀
