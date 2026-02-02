# CodeDuel - 25 User Stories for GitHub Issues

## Instructions for GitHub Setup
1. Go to your repository on GitHub
2. Click on "Projects" tab
3. Create a new Project (Board view)
4. For each user story below, create a GitHub Issue
5. Add labels: `user-story`, `frontend`, `backend`, `phase-1/2/3`
6. Link issues to your project board

---

## PHASE 1: CORE FEATURES (MVP)

### Epic 1: User Authentication & Profile Management

#### Story 1: User Registration
```
Title: User Registration

As a new user
I want to create an account with email and password
So that I can access the platform and track my progress

Acceptance Criteria:
- [ ] User can register with username, email, and password
- [ ] Username must be unique (3-50 characters, alphanumeric + underscore)
- [ ] Email must be valid and unique
- [ ] Password must be at least 6 characters
- [ ] System shows clear error messages for validation failures
- [ ] Upon successful registration, user receives JWT token
- [ ] User is automatically logged in after registration

Technical Notes:
- Backend: POST /api/auth/register endpoint
- Validation using express-validator
- Password hashing with bcryptjs
- JWT token generation

Story Points: 5
Priority: Must Have (MoSCoW)
Labels: user-story, backend, authentication, phase-1
```

#### Story 2: User Login
```
Title: User Login

As a registered user
I want to log in with my credentials
So that I can access my account and compete

Acceptance Criteria:
- [ ] User can log in with email and password
- [ ] System validates credentials against database
- [ ] Invalid credentials show appropriate error message
- [ ] Successful login returns JWT token
- [ ] Token is stored in localStorage/sessionStorage
- [ ] User is redirected to lobby after login

Technical Notes:
- Backend: POST /api/auth/login endpoint
- JWT token with 7-day expiry
- Password verification with bcrypt

Story Points: 3
Priority: Must Have
Labels: user-story, backend, authentication, phase-1
```

#### Story 3: View User Profile
```
Title: View User Profile

As a logged-in user
I want to view my profile and statistics
So that I can see my rating, wins, and match history

Acceptance Criteria:
- [ ] Profile displays username, rating, matches played, matches won
- [ ] Profile shows current rank tier (Bronze, Silver, Gold, etc.)
- [ ] Profile displays win rate percentage
- [ ] User can view their own profile and other users' profiles
- [ ] Profile shows last 10 matches with results

Technical Notes:
- Backend: GET /api/users/:id endpoint
- Frontend: Profile page component
- Calculate win rate on backend

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, backend, phase-1
```

### Epic 2: Invite & Matchmaking System

#### Story 4: Create Invite Link
```
Title: Create Invite Link

As a user
I want to generate a unique invite link
So that I can challenge a specific friend to a match

Acceptance Criteria:
- [ ] User can click "Create Invite" button
- [ ] System generates unique invite code (UUID)
- [ ] Invite link expires after 24 hours
- [ ] User can copy invite link to clipboard
- [ ] User sees confirmation when link is copied
- [ ] Invite link format: /join/:inviteCode

Technical Notes:
- Backend: POST /api/invites endpoint
- Generate UUID with uuid library
- Store in database with expiry timestamp
- Frontend: Modal with copy button

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, backend, phase-1
```

#### Story 5: Join Match via Invite Link
```
Title: Join Match via Invite Link

As a user
I want to join a match by clicking an invite link
So that I can compete with the person who invited me

Acceptance Criteria:
- [ ] User clicks invite link and is taken to join page
- [ ] System validates invite code (exists, not expired, not used)
- [ ] User sees opponent's username and rating
- [ ] User can accept or decline the invite
- [ ] On accept, match is created and both users enter lobby
- [ ] Invalid/expired invites show error message

Technical Notes:
- Backend: POST /api/matches/join/:inviteCode
- Frontend: Invite validation page
- WebSocket notification to invite creator

Story Points: 8
Priority: Must Have
Labels: user-story, frontend, backend, websocket, phase-1
```

#### Story 6: View Pending Invites
```
Title: View My Created Invites

As a user
I want to see all my created invites and their status
So that I can track which invites are active or used

Acceptance Criteria:
- [ ] User can view list of created invites
- [ ] Each invite shows: code, created date, expiry, status (active/used/expired)
- [ ] User can delete unused invites
- [ ] Used invites show which match they created

Technical Notes:
- Backend: GET /api/invites/me/invites
- Frontend: Invites management page

Story Points: 3
Priority: Should Have
Labels: user-story, frontend, backend, phase-1
```

### Epic 3: Real-Time Match System

#### Story 7: Match Lobby Synchronization
```
Title: Real-Time Match Lobby

As a player in a match
I want to see when my opponent joins the lobby
So that I know when the match will start

Acceptance Criteria:
- [ ] Both players connect to match via WebSocket
- [ ] Lobby shows "Waiting for opponent..." until both connected
- [ ] When both players connect, lobby shows "Match starting!"
- [ ] Players see opponent username and rating
- [ ] 3-second countdown before match begins
- [ ] Match starts only when both players are ready

Technical Notes:
- Socket.io room: match_{matchId}
- Events: join_match, opponent_joined, match_ready
- Frontend: Lobby component with status updates

Story Points: 8
Priority: Must Have
Labels: user-story, frontend, backend, websocket, phase-1
```

#### Story 8: Assign Random Problem
```
Title: Random Problem Assignment

As the system
I want to assign the same random problem to both players
So that they compete on equal terms

Acceptance Criteria:
- [ ] System selects random problem from database
- [ ] Both players receive same problem
- [ ] Problem includes: title, description, test cases, constraints
- [ ] Problem difficulty is shown (Easy/Medium/Hard)
- [ ] Problem is assigned when match is created

Technical Notes:
- Backend: SELECT random problem in match creation
- Store problem_id in matches table
- Return problem details with match data

Story Points: 3
Priority: Must Have
Labels: user-story, backend, phase-1
```

#### Story 9: Live Typing Indicator
```
Title: See Opponent Typing Status

As a player
I want to see when my opponent is typing
So that I know they are actively working

Acceptance Criteria:
- [ ] System detects when player types in code editor
- [ ] Opponent sees "Opponent typing..." indicator
- [ ] Indicator disappears after 2 seconds of inactivity
- [ ] Indicator shows next to opponent's name

Technical Notes:
- Socket events: typing, stop_typing
- Debounce typing events (500ms)
- Frontend: Typing indicator component

Story Points: 5
Priority: Should Have
Labels: user-story, frontend, backend, websocket, phase-1
```

### Epic 4: Code Editor & Execution

#### Story 10: Code Editor Interface
```
Title: Integrated Code Editor

As a player
I want to write code in a professional editor
So that I can solve problems efficiently

Acceptance Criteria:
- [ ] Monaco editor integrated (VS Code engine)
- [ ] Syntax highlighting for selected language
- [ ] Line numbers displayed
- [ ] Auto-indentation enabled
- [ ] Bracket matching
- [ ] Theme: Dark mode (matches platform aesthetic)

Technical Notes:
- Use @monaco-editor/react package
- Configure for JavaScript, Python, Java, C++
- Set initial code template per language

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, phase-1
```

#### Story 11: Language Selection
```
Title: Select Programming Language

As a player
I want to choose my programming language
So that I can code in my preferred language

Acceptance Criteria:
- [ ] Dropdown shows: JavaScript, Python, Java, C++
- [ ] Changing language updates editor syntax highlighting
- [ ] Changing language loads language-specific code template
- [ ] Selection persists during match
- [ ] Default: JavaScript

Technical Notes:
- Frontend: Language selector component
- Monaco editor language configuration
- Store selected language in component state

Story Points: 3
Priority: Must Have
Labels: user-story, frontend, phase-1
```

#### Story 12: Submit Code Solution
```
Title: Submit Solution for Judging

As a player
I want to submit my code for testing
So that the system can check if my solution is correct

Acceptance Criteria:
- [ ] Player clicks "Submit Solution" button
- [ ] Code is sent to backend with selected language
- [ ] Submit button is disabled during execution
- [ ] Loading indicator shows "Running tests..."
- [ ] Player receives pass/fail results for each test case

Technical Notes:
- Backend: POST /api/matches/:id/submit
- Frontend: Submit button with loading state
- Display test results in modal/panel

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, backend, phase-1
```

#### Story 13: Automated Test Execution
```
Title: Execute Code Against Test Cases

As the system
I want to run submitted code against test cases
So that I can determine if the solution is correct

Acceptance Criteria:
- [ ] Code is sent to Piston API for execution
- [ ] All test cases are run sequentially
- [ ] Each test case result: passed/failed, actual output
- [ ] Execution timeout: 3 seconds per test
- [ ] If all tests pass, player wins the match
- [ ] Results are sent back to player via WebSocket

Technical Notes:
- Use Piston API: https://emkc.org/api/v2/piston/execute
- Run all test cases from problem.test_cases
- Compare actual output with expected output
- Socket event: test_results

Story Points: 8
Priority: Must Have
Labels: user-story, backend, code-execution, phase-1
```

#### Story 14: Display Test Results
```
Title: View Test Case Results

As a player
I want to see detailed test results
So that I can understand why my code failed

Acceptance Criteria:
- [ ] Results show for each test case: Pass/Fail
- [ ] Failed tests show: input, expected output, actual output
- [ ] Execution errors are displayed clearly
- [ ] Results panel can be expanded/collapsed
- [ ] Green checkmark for passed tests, red X for failed

Technical Notes:
- Frontend: Test results component
- Display in expandable panel
- Color-coded results (green/red)

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, phase-1
```

### Epic 5: Winner Determination & Rating System

#### Story 15: Declare Match Winner
```
Title: Determine and Announce Winner

As the system
I want to declare the first player who passes all tests as winner
So that the match outcome is clear and fair

Acceptance Criteria:
- [ ] First player to pass all test cases wins
- [ ] Winner is recorded in matches table
- [ ] Match status changes to "completed"
- [ ] Both players receive winner notification via WebSocket
- [ ] Loser receives consolation message
- [ ] Match duration is recorded

Technical Notes:
- Backend: Update match.winner_id on first all-pass
- Socket event: match_completed
- Calculate duration: completed_at - started_at

Story Points: 5
Priority: Must Have
Labels: user-story, backend, websocket, phase-1
```

#### Story 16: Calculate ELO Rating Changes
```
Title: Update Player Ratings After Match

As the system
I want to calculate new ratings using ELO algorithm
So that player rankings are fair and accurate

Acceptance Criteria:
- [ ] System calculates expected win probabilities
- [ ] Winner gains rating points, loser loses points
- [ ] Rating change based on rating difference (±150 typical)
- [ ] K-factor: 40 for new players, 32 for intermediate, 24 for masters
- [ ] Minimum rating: 100 (cannot go below)
- [ ] Rating history is recorded in database

Technical Notes:
- ELO formula: newRating = oldRating + K * (actual - expected)
- Backend service: RatingService.calculateEloRatings()
- Store in rating_history table

Story Points: 8
Priority: Must Have
Labels: user-story, backend, algorithm, phase-1
```

#### Story 17: Display Rating Change
```
Title: Show Rating Change After Match

As a player
I want to see how my rating changed
So that I understand my progress

Acceptance Criteria:
- [ ] Victory screen shows: old rating, new rating, change (+/-)
- [ ] Rating change is color-coded (green for gain, red for loss)
- [ ] Display shows: "Rating: 1500 → 1518 (+18)"
- [ ] New rank tier is shown if changed

Technical Notes:
- Frontend: Victory/Defeat screen component
- Display rating change from match result
- Animate number transition

Story Points: 3
Priority: Must Have
Labels: user-story, frontend, phase-1
```

### Epic 6: Leaderboard System

#### Story 18: View Global Leaderboard
```
Title: Global Leaderboard Rankings

As a user
I want to view the top players globally
So that I can see how I compare to others

Acceptance Criteria:
- [ ] Leaderboard shows top 100 players by rating
- [ ] Each entry shows: rank, username, rating, matches played, win rate
- [ ] Current user's position is highlighted
- [ ] Leaderboard updates after each match
- [ ] Can search for specific users

Technical Notes:
- Backend: GET /api/users endpoint (sorted by rating DESC)
- Frontend: Leaderboard page with table
- Highlight current user's row

Story Points: 5
Priority: Must Have
Labels: user-story, frontend, backend, phase-1
```

#### Story 19: User Search on Leaderboard
```
Title: Search for Users on Leaderboard

As a user
I want to search for specific players
So that I can find and view their profiles

Acceptance Criteria:
- [ ] Search bar filters leaderboard by username
- [ ] Search is case-insensitive
- [ ] Results update as user types (debounced)
- [ ] Clicking a user navigates to their profile
- [ ] "No results" message if search has no matches

Technical Notes:
- Frontend: Search input with debounce (300ms)
- Filter client-side or add backend endpoint
- Highlight matching text in results

Story Points: 3
Priority: Should Have
Labels: user-story, frontend, phase-1
```

---

## PHASE 2: ENHANCED FEATURES

### Epic 7: Match History & Analytics

#### Story 20: View Match History
```
Title: Personal Match History

As a user
I want to view my past matches
So that I can review my performance

Acceptance Criteria:
- [ ] User can see last 20 matches
- [ ] Each match shows: opponent, problem, result (W/L), rating change, date
- [ ] Matches are sorted by date (most recent first)
- [ ] Can filter by: All / Wins / Losses
- [ ] Clicking a match shows full details

Technical Notes:
- Backend: GET /api/users/me/history
- Frontend: Match history page with filters
- Display in table or card layout

Story Points: 5
Priority: Should Have
Labels: user-story, frontend, backend, phase-2
```

#### Story 21: View Match Statistics
```
Title: Personal Performance Statistics

As a user
I want to see my overall statistics
So that I can track my improvement

Acceptance Criteria:
- [ ] Stats display: total matches, wins, losses, win rate
- [ ] Show rating progression graph (last 30 days)
- [ ] Display most solved problem categories
- [ ] Show current win streak
- [ ] Compare stats to platform average

Technical Notes:
- Backend: Calculate stats from match history
- Frontend: Statistics dashboard with charts
- Use recharts or chart.js for graphs

Story Points: 8
Priority: Should Have
Labels: user-story, frontend, backend, analytics, phase-2
```

### Epic 8: Problem Library

#### Story 22: Browse Problems
```
Title: Problem Library Browser

As a user
I want to browse all available problems
So that I can practice specific types of problems

Acceptance Criteria:
- [ ] Display all problems in a list/grid
- [ ] Each problem shows: title, difficulty, tags
- [ ] Can filter by difficulty (Easy/Medium/Hard)
- [ ] Can filter by tags (Arrays, Strings, DP, etc.)
- [ ] Can search by problem title
- [ ] Clicking a problem shows full details

Technical Notes:
- Backend: GET /api/problems endpoint with filters
- Frontend: Problem library page
- Implement client-side or server-side filtering

Story Points: 5
Priority: Should Have
Labels: user-story, frontend, backend, phase-2
```

#### Story 23: View Problem Details
```
Title: Detailed Problem View

As a user
I want to view complete problem details
So that I can understand the requirements before practicing

Acceptance Criteria:
- [ ] Problem page shows: title, description, examples, constraints
- [ ] Examples show input, output, and explanation
- [ ] Difficulty badge is displayed
- [ ] Tags/categories are shown
- [ ] "Practice" button to solve without match
- [ ] Shows acceptance rate and total submissions

Technical Notes:
- Backend: GET /api/problems/:id
- Frontend: Problem detail page
- Rich text formatting for description

Story Points: 5
Priority: Should Have
Labels: user-story, frontend, backend, phase-2
```

### Epic 9: Communication Features

#### Story 24: In-Match Chat (Optional)
```
Title: Chat with Opponent During Match

As a player
I want to send messages to my opponent
So that we can communicate during the match

Acceptance Criteria:
- [ ] Chat panel is visible during match
- [ ] Can send text messages (max 200 characters)
- [ ] Messages appear in real-time for both players
- [ ] Chat history persists during match
- [ ] Can minimize/maximize chat panel
- [ ] Profanity filter applied to messages

Technical Notes:
- Socket events: match_message
- Frontend: Chat component with input
- Store messages in match session (not DB)

Story Points: 5
Priority: Could Have
Labels: user-story, frontend, backend, websocket, phase-2
```

---

## PHASE 3: ADVANCED FEATURES

#### Story 25: Practice Mode
```
Title: Practice Without Rating Impact

As a user
I want to solve problems without affecting my rating
So that I can practice new strategies risk-free

Acceptance Criteria:
- [ ] User can select "Practice Mode" from problem page
- [ ] Practice matches don't affect rating
- [ ] Can solve problems solo (no opponent needed)
- [ ] Solutions are still validated against test cases
- [ ] Practice history is tracked separately
- [ ] Can review practice solutions

Technical Notes:
- Backend: Add practice_mode flag to matches
- Skip rating calculation for practice matches
- Frontend: Practice mode toggle

Story Points: 5
Priority: Could Have
Labels: user-story, frontend, backend, phase-3
```

---

## Summary

**Total Stories**: 25
**Story Points**: 135

### By Phase:
- **Phase 1 (MVP)**: 19 stories, 105 points
- **Phase 2**: 5 stories, 28 points
- **Phase 3**: 1 story, 5 points

### By Epic:
- Authentication (3 stories)
- Invites (3 stories)
- Real-Time Matches (3 stories)
- Code Editor (5 stories)
- Ratings (3 stories)
- Leaderboard (2 stories)
- History (2 stories)
- Problems (2 stories)
- Communication (1 story)
- Practice (1 story)

### MoSCoW Prioritization:
- **Must Have**: Stories 1-18 (Core MVP)
- **Should Have**: Stories 19-23 (Enhanced features)
- **Could Have**: Stories 24-25 (Nice to have)
- **Won't Have**: Tournaments, Team Battles (Future)
```
