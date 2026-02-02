# MoSCoW Prioritization & Wireframe Specifications

## MoSCoW Prioritization Matrix

### Must Have (Critical for MVP Launch)

| Priority | Feature | User Story # | Rationale | Dependencies |
|----------|---------|--------------|-----------|--------------|
| 1 | User Registration | #1 | Can't use platform without account | None |
| 2 | User Login | #2 | Access control required | Story #1 |
| 3 | Create Invite Link | #4 | Core matchmaking mechanism | Story #2 |
| 4 | Join via Invite | #5 | Complete invite flow | Story #4 |
| 5 | Match Lobby Sync | #7 | Real-time is core value prop | Story #5 |
| 6 | Random Problem Assignment | #8 | Must have problem to solve | Story #7 |
| 7 | Code Editor Interface | #10 | Where users write code | Story #8 |
| 8 | Language Selection | #11 | Multi-language support | Story #10 |
| 9 | Submit Code | #12 | Submit for judging | Story #11 |
| 10 | Execute Code | #13 | Validate solutions | Story #12 |
| 11 | Display Test Results | #14 | Show pass/fail feedback | Story #13 |
| 12 | Declare Winner | #15 | Match completion | Story #14 |
| 13 | Calculate ELO Rating | #16 | Core competitive mechanic | Story #15 |
| 14 | Display Rating Change | #17 | User feedback on progress | Story #16 |
| 15 | Global Leaderboard | #18 | Competitive motivation | Story #17 |

**Total Must Have: 15 features**
**Estimated Effort: 80 story points**
**Timeline: Months 1-3**

---

### Should Have (Important for User Experience)

| Priority | Feature | User Story # | Rationale | Dependencies |
|----------|---------|--------------|-----------|--------------|
| 16 | View User Profile | #3 | See personal stats | Story #2 |
| 17 | View Pending Invites | #6 | Manage invites | Story #4 |
| 18 | Live Typing Indicator | #9 | Enhanced engagement | Story #7 |
| 19 | User Search | #19 | Find specific players | Story #18 |
| 20 | Match History | #20 | Review past performance | Story #17 |
| 21 | Performance Stats | #21 | Track improvement | Story #20 |
| 22 | Browse Problems | #22 | Discover content | Story #8 |
| 23 | Problem Details | #23 | Understand requirements | Story #22 |

**Total Should Have: 8 features**
**Estimated Effort: 38 story points**
**Timeline: Months 3-4**

---

### Could Have (Nice to Have if Time Permits)

| Priority | Feature | User Story # | Rationale | Dependencies |
|----------|---------|--------------|-----------|--------------|
| 24 | In-Match Chat | #24 | Social interaction | Story #7 |
| 25 | Practice Mode | #25 | Risk-free learning | Story #22 |

**Total Could Have: 2 features**
**Estimated Effort: 10 story points**
**Timeline: Month 5 (if time permits)**

---

### Won't Have (Deferred to Future Releases)

| Feature | Rationale | Future Phase |
|---------|-----------|--------------|
| Tournament Mode | Complex, resource-intensive | Phase 3 |
| Team Battles (2v2) | Requires different architecture | Phase 3 |
| Mobile Native Apps | Separate development effort | Phase 4 |
| AI Opponent | Complex ML integration | Phase 4 |
| Code Review System | Time-consuming feature | Phase 3 |
| Video Chat | High bandwidth, complex | Phase 5 |
| Achievements/Badges | Non-critical gamification | Phase 3 |
| Social Friend System | Complex social graph | Phase 3 |
| Custom Tournaments | Advanced tournament features | Phase 4 |
| Paid Features/Subscriptions | Monetization deferred | Phase 5 |

---

## Development Sprint Plan

### Sprint 1-2 (Weeks 1-4): Foundation
**Focus**: Must Have #1-6
- User authentication system
- Database setup and migrations
- Invite link generation and validation
- Basic WebSocket infrastructure

**Deliverable**: Users can register, login, and create/join via invites

---

### Sprint 3-4 (Weeks 5-8): Match Core
**Focus**: Must Have #7-11
- Match lobby with real-time sync
- Code editor integration
- Language selection
- Code submission flow
- Piston API integration

**Deliverable**: End-to-end match flow (minus winner logic)

---

### Sprint 5-6 (Weeks 9-12): Completion & Rating
**Focus**: Must Have #12-15
- Test execution and validation
- Winner determination
- ELO rating calculation
- Leaderboard system

**Deliverable**: Fully functional MVP with all core features

---

### Sprint 7 (Weeks 13-14): Should Have Features
**Focus**: Should Have #16-19
- User profiles
- Invite management
- Typing indicators
- Search functionality

**Deliverable**: Enhanced user experience

---

### Sprint 8 (Weeks 15-16): Polish & Testing
**Focus**: Should Have #20-23 + Bug Fixes
- Match history
- Statistics dashboard
- Problem library
- Comprehensive testing
- Performance optimization

**Deliverable**: Production-ready platform

---

### Sprint 9 (Week 17-18): Could Have (Optional)
**Focus**: Could Have #24-25 if time permits
- In-match chat
- Practice mode
- Final polish

**Deliverable**: Additional features if timeline allows

---

## Figma Wireframe Specifications

### Design System

**Colors:**
- Primary: #00ff88 (Neon Green)
- Secondary: #ff0055 (Neon Pink)
- Background Dark: #0a0e1a
- Background Card: #131826
- Text Primary: #e0e6ff
- Text Secondary: #8892b0
- Border: #1e2842

**Typography:**
- Headings: Outfit (Bold, 700-800 weight)
- Body: Outfit (Regular, 400 weight)
- Code: JetBrains Mono

**Spacing System:**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

---

### Screen 1: Landing/Login Page

**Purpose**: First screen users see, login/register

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  [Logo: ⚡ CodeDuel]           [Login] [Sign Up]│
├─────────────────────────────────────────────────┤
│                                                 │
│          Welcome to CodeDuel                    │
│     Real-Time 1v1 Coding Battles                │
│                                                 │
│  [Get Started →]     [View Demo]                │
│                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Real-Time │  │ ELO Ranks │  │ Multi-Lang│  │
│  │  Battles  │  │ System    │  │ Support   │  │
│  └───────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────┘
```

**Components:**
- Header with logo and auth buttons
- Hero section with tagline
- CTA buttons (primary + secondary)
- Feature highlights (3 cards)
- Animated background grid
- Footer with links

**Interactions:**
- Login button → Login modal
- Sign Up button → Registration modal
- Get Started → Registration if logged out, Lobby if logged in

---

### Screen 2: Lobby/Dashboard

**Purpose**: Main hub after login, create or join matches

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ⚡ CodeDuel      [Profile]  Rating: 1547  [Logout]│
├─────────────────────────────────────────────────┤
│                                                 │
│         Ready to Battle?                        │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Create Invite   │  │  Quick Match     │   │
│  │  🔗              │  │  ⚔️              │   │
│  │  Challenge a     │  │  Get matched     │   │
│  │  friend          │  │  instantly       │   │
│  │  [Create Link]   │  │  [Find Match]    │   │
│  └──────────────────┘  └──────────────────┘   │
│                                                 │
│  ┌──────────────────┐                          │
│  │  Leaderboard 🏆  │                          │
│  │  View top coders │                          │
│  │  [View Rankings] │                          │
│  └──────────────────┘                          │
└─────────────────────────────────────────────────┘
```

**Components:**
- Top bar: Logo, profile, rating, logout
- Hero text: "Ready to Battle?"
- 3 action cards:
  - Create Invite (with link icon)
  - Quick Match (with swords icon)
  - Leaderboard (with trophy icon)
- Recent matches widget (bottom)

**Interactions:**
- Create Invite → Opens invite modal
- Quick Match → Searches for opponent
- Leaderboard → Navigate to leaderboard page

---

### Screen 3: Invite Modal

**Purpose**: Create and share invite links

**Layout:**
```
┌─────────────────────────────────────────────────┐
│           Create Invite Link             [X]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Share this link with your opponent:            │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ https://codeduel.io/join/abc123xyz      │   │
│  │                              [Copy] ✓    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ⏰ Expires in 24 hours                         │
│                                                 │
│  [Cancel]                    [Start Match →]   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Components:**
- Modal overlay (dark background)
- Modal card with title and close button
- Invite link display (read-only input)
- Copy button with success indicator
- Expiry timer
- Action buttons: Cancel, Start Match

**Interactions:**
- Copy button → Copies to clipboard, shows checkmark
- Start Match → Waits for opponent, enters match lobby
- Close button → Dismisses modal

---

### Screen 4: Match Arena (Active Match)

**Purpose**: Where coding battles happen

**Layout:**
```
┌─────────────────────────────────────────────────────────────────────┐
│ Alex_Codes (1547)    VS    Sarah_Dev (1523)      ⏱️ 14:23         │
├─────────────────────────────────────────────────────────────────────┤
│ Problem          │  Code Editor                                     │
│ ────────         │  ────────────────                                │
│                  │                                                   │
│ Two Sum          │  [JavaScript ▼]            Opponent typing...    │
│ Medium           │  ┌────────────────────────────────────────────┐ │
│                  │  │ 1  function twoSum(nums, target) {         │ │
│ Given an array   │  │ 2      // Your code here                   │ │
│ of integers...   │  │ 3                                          │ │
│                  │  │ 4  }                                       │ │
│ Examples:        │  │                                            │ │
│ Input: [2,7...]  │  │                                            │ │
│ Output: [0,1]    │  │                                            │ │
│                  │  └────────────────────────────────────────────┘ │
│ Constraints:     │                                                   │
│ ...              │  Test Cases:  ⚫ Test 1  ⚫ Test 2  ⚫ Test 3    │
│                  │                                                   │
│                  │  [Run Tests]              [Submit Solution]      │
└─────────────────────────────────────────────────────────────────────┘
```

**Components:**
- Match header: Both players, ratings, timer
- Two-column layout:
  - Left: Problem description (scrollable)
  - Right: Code editor + controls
- Problem panel:
  - Title, difficulty badge
  - Description
  - Examples
  - Constraints
- Editor panel:
  - Language selector
  - Monaco editor
  - Opponent status indicator
  - Test case status dots
  - Action buttons

**Interactions:**
- Language selector → Change syntax highlighting
- Code editor → Type, auto-complete
- Run Tests → Execute code, show results
- Submit Solution → Validate all tests, declare winner

---

### Screen 5: Victory Screen

**Purpose**: Show match results and rating changes

**Layout:**
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                   🏆                            │
│                                                 │
│                 Victory!                        │
│                                                 │
│         You solved it in 4:23                   │
│                                                 │
│  ┌───────────────────────────────────────┐     │
│  │  Previous Rating:        1547         │     │
│  │  Rating Change:          +18 ✨       │     │
│  │  ────────────────────────────────     │     │
│  │  New Rating:             1565         │     │
│  └───────────────────────────────────────┘     │
│                                                 │
│  [Back to Lobby]          [New Match ⚔️]       │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Components:**
- Trophy icon (animated)
- Victory title (large, bold)
- Solve time
- Rating change card:
  - Previous rating
  - Rating change (green with +)
  - Divider line
  - New rating (emphasized)
- Action buttons:
  - Back to Lobby
  - New Match (primary CTA)

**Interactions:**
- Trophy has floating animation
- Rating numbers animate/count up
- Back to Lobby → Return to dashboard
- New Match → Start new invite or quick match

**Variant: Defeat Screen**
- Red color scheme
- "Better luck next time!"
- Rating change shown in red with -
- Still shows effort/time

---

### Screen 6: Leaderboard

**Purpose**: View top players and rankings

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ ⚡ CodeDuel                         [Back]      │
├─────────────────────────────────────────────────┤
│                                                 │
│        🏆 Leaderboard                           │
│                                                 │
│  [Search players...]                            │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ #  │ Player      │ Rating │ Matches │ W% │   │
│  ├────┼─────────────┼────────┼─────────┼────┤   │
│  │ 1  │ CodeMaster  │  2145  │  234    │ 78%│   │
│  │ 2  │ AlgoQueen   │  2098  │  187    │ 71%│   │
│  │ 3  │ DevNinja    │  1987  │  156    │ 68%│   │
│  │ ...│             │        │         │    │   │
│  │ 47 │ Alex_Codes ⭐│  1565  │   23    │ 61%│   │
│  │ ...│             │        │         │    │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Load More]                                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Components:**
- Header with back button
- Leaderboard title with trophy
- Search bar (with icon)
- Leaderboard table:
  - Rank number
  - Player username (clickable)
  - Rating (with tier color)
  - Matches played
  - Win percentage
- Current user row highlighted (star icon)
- Load more button (pagination)

**Interactions:**
- Search bar → Filter results in real-time
- Username click → Navigate to user profile
- Highlighted row → Current user (scrolls into view)
- Load More → Fetch next page

**Responsive:**
- Mobile: Condense to 3 columns (rank, player, rating)
- Tablet: Show all columns
- Desktop: Full width table

---

## Figma Design Guidelines

### Creating Wireframes in Figma

1. **Setup**
   - Create new Figma file: "CodeDuel Wireframes"
   - Set up 6 frames (1920x1080 for desktop)
   - Name frames: Landing, Lobby, Invite Modal, Match Arena, Victory, Leaderboard

2. **Design System**
   - Create color styles for all palette colors
   - Set up text styles for headings, body, code
   - Create component library for buttons, cards, inputs

3. **Components to Create**
   - Button (Primary, Secondary, Disabled states)
   - Card (with hover states)
   - Input field (Normal, Focus, Error states)
   - Modal overlay
   - Profile avatar
   - Rating badge
   - Status indicator (online/typing)

4. **Interactions**
   - Add hover states to all clickable elements
   - Create click prototypes for main navigation flow:
     - Landing → Lobby → Invite Modal → Match Arena → Victory → Lobby
   - Add loading states for async actions

5. **Annotations**
   - Add notes for responsive breakpoints
   - Indicate animation requirements
   - Mark WebSocket-dependent elements

6. **Export**
   - Export each frame as PNG (2x for Retina)
   - Create presentation mode link for stakeholders
   - Share Figma file with development team

---

## Priority Matrix Visualization

```
         HIGH IMPACT
            │
            │  MUST HAVE        SHOULD HAVE
            │  ────────────     ────────────
HIGH EFFORT │  • Match System   • Match History
            │  • Code Execution • User Stats
            │  • ELO Rating     • Problem Library
            │  ────────────     ────────────
            │
            │  MUST HAVE        COULD HAVE
            │  ────────────     ────────────
 LOW EFFORT │  • Auth System    • Practice Mode
            │  • Invites        • In-Match Chat
            │  • Leaderboard    
            │  ────────────     ────────────
            │
         LOW IMPACT
```

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Piston API downtime | Medium | High | Implement retry logic, fallback message |
| WebSocket connection issues | Medium | High | Reconnection logic, error handling |
| Rating calculation bugs | Low | High | Extensive unit tests, manual verification |
| Slow code execution | Medium | Medium | Timeout handling, loading indicators |
| Database performance | Low | Medium | Indexing, query optimization |
| Feature scope creep | High | High | Strict MoSCoW adherence, sprint reviews |

---

**Document Version**: 1.0  
**Last Updated**: January 2026  
**Next Review**: After Sprint 2
