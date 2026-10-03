# Personal Dashboard

**Product Requirements Document (PRD)**

**Version:** 1.0
**Status:** Planning
**Product Type:** Personal Productivity Web Application

---

## 1. Product Overview

Personal Dashboard is a full-stack web application designed to serve as a centralized personal workspace.

The application allows users to manage and organize their daily activities, tasks, software projects, notes, bookmarks, habits, and scheduled events from a single dashboard.

The primary goal is to create a practical application that can be used personally while also demonstrating real-world full-stack web development skills.

The application should prioritize usability, maintainability, scalability, and clean architecture rather than simply providing a collection of CRUD features.

---

# 2. Problem Statement

Personal information and activities are often scattered across different applications.

Tasks may be stored in a task manager, notes in a note-taking application, bookmarks in a browser, project information in GitHub, and schedules in a calendar.

This makes it difficult to get a centralized overview of personal activities and current priorities.

Personal Dashboard aims to solve this problem by providing a single workspace where users can manage and monitor their important personal information.

---

# 3. Goals

## Primary Goals

1. Provide a centralized personal productivity workspace.
2. Allow users to manage tasks and projects efficiently.
3. Provide an overview of current activities through a dashboard.
4. Allow users to store and organize personal notes and bookmarks.
5. Track habits and scheduled activities.
6. Provide useful productivity statistics.
7. Provide a responsive and pleasant user experience.
8. Demonstrate production-oriented full-stack development practices.

## Technical Goals

The application should demonstrate:

- Modern Next.js development
- Type-safe development with TypeScript
- Relational database design
- Authentication and authorization
- Server-side and client-side data handling
- Form validation
- API integration
- Reusable UI components
- Responsive design
- Error handling
- Database relationships
- Search and filtering
- Third-party API integration

---

# 4. Non-Goals

The initial version will not attempt to become a complete replacement for applications such as Notion, Jira, Trello, Google Calendar, or Todoist.

The following should not be prioritized during the MVP:

- Advanced collaborative features
- Real-time multi-user collaboration
- Team workspaces
- Complex project management
- Advanced document editing
- Complex financial management
- AI assistant
- Native mobile application
- Enterprise-level permission management

These features may be considered in future versions if needed.

---

# 5. Target Users

## Primary User

Individual users who want to manage their personal activities and information from one centralized application.

## Initial Target

The first implementation is primarily intended for personal use by the developer.

The architecture should nevertheless allow the application to support multiple users in the future.

---

# 6. Product Scope

The application consists of the following major modules:

1. Authentication
2. Dashboard
3. Tasks
4. Projects
5. Notes
6. Bookmarks
7. Habits
8. Calendar
9. Analytics
10. Notifications
11. Settings
12. GitHub Integration

Features will be implemented incrementally.

---

# 7. MVP Scope

The MVP should contain only the following modules:

### Required

- Authentication
- Dashboard
- Tasks
- Projects
- Notes
- User profile
- Dark/light theme

### Optional for MVP

- Bookmarks
- Global search

The remaining features should be implemented after the MVP is stable.

---

# 8. Functional Requirements

## 8.1 Authentication

The system must provide secure user authentication.

### Features

- User registration
- Login
- Logout
- Persistent sessions
- Protected application routes
- User profile
- Account settings

### Requirements

- Unauthenticated users cannot access protected application pages.
- Authenticated users can only access their own data.
- Sessions must persist across page refreshes.
- Authentication state must be handled consistently across the application.

---

# 9. Dashboard

The dashboard is the primary landing page after authentication.

## 9.1 Dashboard Information

The dashboard should display:

- Personalized greeting
- Current date
- Today's tasks
- Task completion summary
- Active projects
- Project progress
- Upcoming deadlines
- Recent notes
- Recent bookmarks
- Habit summary
- Upcoming events

## 9.2 Quick Actions

The dashboard should provide quick actions for:

- Create task
- Create project
- Create note
- Add bookmark
- Add event

## 9.3 Dashboard Statistics

Example statistics:

- Pending tasks
- Completed tasks today
- Active projects
- Upcoming deadlines
- Current habit streak

The dashboard should prioritize important information and avoid displaying excessive data.

---

# 10. Task Management

The task module allows users to manage personal tasks.

## 10.1 Task Properties

Each task should contain:

- ID
- Title
- Description
- Status
- Priority
- Due date
- Project
- Tags
- Created date
- Updated date
- Completed date
- User ID

## 10.2 Statuses

Tasks can have the following statuses:

- TODO
- IN_PROGRESS
- COMPLETED

## 10.3 Priorities

Tasks can have:

- LOW
- MEDIUM
- HIGH

## 10.4 Features

Users can:

- Create tasks
- Edit tasks
- Delete tasks
- Complete tasks
- Change task status
- Set priority
- Assign tasks to projects
- Set due dates
- Add tags
- Search tasks
- Filter tasks
- Sort tasks

## 10.5 Views

The system should provide:

### List View

A traditional task list with filtering and sorting.

### Kanban View

Tasks organized by status:

```text
TODO        IN PROGRESS        COMPLETED

Task A      Task C             Task E
Task B      Task D             Task F
```

---

# 11. Project Management

The project module allows users to organize larger activities.

Projects can represent:

- Software projects
- Personal projects
- Learning projects
- Career-related projects
- Other long-term activities

## 11.1 Project Properties

Each project should contain:

- ID
- Name
- Description
- Status
- Start date
- Deadline
- Progress
- Technologies
- Repository URL
- Deployment URL
- Created date
- Updated date
- User ID

## 11.2 Project Status

- PLANNING
- IN_PROGRESS
- COMPLETED
- ON_HOLD
- ARCHIVED

## 11.3 Features

Users can:

- Create projects
- Edit projects
- Delete projects
- Archive projects
- Set deadlines
- Add technologies
- Add GitHub repository
- Add deployment URL
- View project progress
- View related tasks

## 11.4 Project Detail

The project detail page should display:

- Project information
- Progress
- Deadline
- Technology stack
- Repository
- Deployment
- Related tasks
- Task completion statistics

---

# 12. Notes

The notes module provides a personal knowledge management system.

## 12.1 Features

Users can:

- Create notes
- Edit notes
- Delete notes
- Search notes
- Categorize notes
- Add tags
- Pin notes
- Archive notes

## 12.2 Editor

Notes should use Markdown-based content.

Supported formatting should include:

- Headings
- Paragraphs
- Bold
- Italic
- Lists
- Links
- Code blocks
- Inline code
- Quotes

## 12.3 Categories

Example categories:

- Programming
- Career
- University
- Personal
- Ideas
- Other

Categories should be customizable in the future.

---

# 13. Bookmark Management

The bookmark module allows users to save useful websites and resources.

## 13.1 Bookmark Properties

- Title
- URL
- Description
- Category
- Tags
- Favorite status
- Archive status
- Created date
- Updated date
- User ID

## 13.2 Features

Users can:

- Add bookmarks
- Edit bookmarks
- Delete bookmarks
- Favorite bookmarks
- Archive bookmarks
- Search bookmarks
- Filter bookmarks
- Categorize bookmarks
- Add tags

The system may attempt to retrieve website metadata automatically.

---

# 14. Habit Tracking

The habit module allows users to track recurring personal habits.

## 14.1 Habit Properties

- Name
- Description
- Frequency
- Start date
- Active status
- Created date
- User ID

## 14.2 Habit Features

Users can:

- Create habits
- Edit habits
- Delete habits
- Mark habits as completed
- View daily history
- View current streak
- View longest streak
- View completion rate

## 14.3 Habit History

Provide a calendar-style visualization showing completed and missed days.

---

# 15. Calendar

The calendar module provides a centralized schedule.

## 15.1 Event Types

The calendar may display:

- Personal events
- Task deadlines
- Project deadlines
- Habit activities

## 15.2 Calendar Views

Support:

- Month view
- Week view
- Day view

## 15.3 Event Management

Users can:

- Create events
- Edit events
- Delete events
- Set start date/time
- Set end date/time
- Add descriptions
- Set event type

---

# 16. Global Search

The application should provide a global search system.

Search should cover:

- Tasks
- Projects
- Notes
- Bookmarks

Example:

```text
Search: "Next.js"

Projects
Personal Dashboard

Notes
Next.js Server Actions

Bookmarks
Next.js Documentation

Tasks
Learn Next.js Authentication
```

Search results should be grouped by entity type.

---

# 17. Analytics

The analytics module provides productivity statistics.

## 17.1 Metrics

The system may display:

- Tasks completed
- Tasks pending
- Task completion rate
- Tasks completed over time
- Project progress
- Habit completion rate
- Current streak
- Longest streak

## 17.2 Time Periods

Statistics should support:

- Daily
- Weekly
- Monthly

Charts should be used where appropriate.

---

# 18. Notifications

The system should provide notifications for important activities.

Examples:

- Task deadline approaching
- Project deadline approaching
- Upcoming event
- Habit reminder

Notifications should be accessible from the main navigation.

The initial implementation may use in-app notifications only.

Email or push notifications can be considered later.

---

# 19. GitHub Integration

GitHub integration is a post-MVP feature.

## Features

Users can optionally connect their GitHub account.

The application can display:

- Repositories
- Recent commits
- Pull requests
- Issues
- Contribution activity

Projects can optionally be associated with a GitHub repository.

The dashboard may display a summary of recent GitHub activity.

---

# 20. Settings

The settings page should contain several sections.

## Profile

- Name
- Email
- Avatar

## Appearance

- Light theme
- Dark theme
- System theme

## Preferences

- Date format
- Time format
- Default task view

## Account

- Logout
- Account management

---

# 21. Navigation

Desktop navigation should use a sidebar.

Recommended navigation:

```text
Dashboard
Tasks
Projects
Notes
Bookmarks
Habits
Calendar
Analytics

----------------

Settings
Profile
```

The navigation should be responsive on mobile devices.

---

# 22. UI/UX Requirements

The application should have a modern productivity-oriented interface.

## Design Principles

- Minimal
- Clean
- Consistent
- Responsive
- Accessible
- Fast
- Easy to navigate

## Required UI States

Every major feature should provide:

- Loading state
- Empty state
- Error state
- Success feedback
- Confirmation for destructive actions

## Responsive Design

The application must support:

- Desktop
- Tablet
- Mobile

Desktop should use a sidebar navigation.

Mobile should use a compact navigation pattern such as a bottom navigation or collapsible sidebar.

---

# 23. Technical Architecture

The application should use a monorepo architecture.

## Monorepo

- pnpm
- Turborepo

## Application

- Next.js
- React
- TypeScript

## Styling

- Tailwind CSS
- shadcn/ui

## Backend

- Next.js Server Actions
- Next.js Route Handlers

## Database

- PostgreSQL
- Supabase

## ORM

- Drizzle ORM

## Authentication

- Supabase Auth

## Validation

- Zod
- React Hook Form

## Charts

- Recharts

## Icons

- Lucide React

## Deployment

- Vercel

## Version Control

- Git
- GitHub

---

# 24. Proposed Monorepo Structure

```text
personal-dashboard/
│
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   │   ├── dashboard/
│       │   │   ├── tasks/
│       │   │   ├── projects/
│       │   │   ├── notes/
│       │   │   ├── bookmarks/
│       │   │   ├── habits/
│       │   │   ├── calendar/
│       │   │   └── analytics/
│       │   │
│       │   └── api/
│       │
│       ├── components/
│       ├── lib/
│       └── ...
│
├── packages/
│   ├── ui/
│   ├── database/
│   ├── types/
│   ├── eslint-config/
│   └── typescript-config/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

The structure should remain flexible and should not introduce packages that are not actually needed.

---

# 25. Database Requirements

The application should use PostgreSQL as the primary relational database.

## Initial Entities

```text
users
profiles
projects
tasks
tags
task_tags
notes
note_tags
bookmarks
bookmark_tags
categories
habits
habit_logs
events
notifications
```

## Important Relationships

```text
User
 ├── Projects
 │     └── Tasks
 │
 ├── Tasks
 │
 ├── Notes
 │
 ├── Bookmarks
 │
 ├── Habits
 │     └── Habit Logs
 │
 ├── Events
 │
 └── Notifications
```

All user-owned entities must be associated with the authenticated user.

Database constraints, indexes, foreign keys, and appropriate cascading behavior should be implemented where necessary.

---

# 26. Security Requirements

The application must follow basic web security best practices.

Requirements include:

- Authentication-protected routes
- Server-side authorization checks
- User data isolation
- Input validation
- Server-side validation
- Secure session handling
- Protection against unauthorized resource access
- Environment variables for secrets
- No sensitive credentials committed to Git
- Proper database access controls

Supabase Row Level Security should be considered for user-owned data.

---

# 27. Performance Requirements

The application should prioritize:

- Fast initial page load
- Server-side data fetching where appropriate
- Efficient database queries
- Pagination for large datasets
- Debounced search
- Optimized images
- Minimal unnecessary client-side JavaScript

The application should avoid fetching unnecessary data for the dashboard.

---

# 28. Development Phases

## Phase 1 — Project Setup

- Initialize Git repository
- Configure pnpm
- Configure Turborepo
- Create Next.js application
- Configure TypeScript
- Configure Tailwind CSS
- Configure shadcn/ui
- Configure ESLint
- Configure formatting
- Configure environment variables

---

## Phase 2 — Database and Authentication

- Create Supabase project
- Configure PostgreSQL
- Configure Drizzle ORM
- Create initial schema
- Configure Supabase Auth
- Implement login
- Implement registration
- Implement logout
- Implement protected routes
- Implement user profile

---

## Phase 3 — Dashboard

- Create application layout
- Create sidebar navigation
- Create dashboard page
- Create statistic cards
- Create today's task section
- Create active project section
- Create upcoming deadline section
- Create recent activity section

---

## Phase 4 — Tasks

- Create task schema
- Create task API/server actions
- Create task form
- Create task list
- Create task detail
- Implement filtering
- Implement sorting
- Implement search
- Implement Kanban view
- Implement task completion

---

## Phase 5 — Projects

- Create project schema
- Create project form
- Create project list
- Create project detail
- Connect projects with tasks
- Add project progress
- Add project deadlines
- Add repository URL
- Add deployment URL

---

## Phase 6 — Notes

- Create note schema
- Create note editor
- Implement Markdown support
- Implement categories
- Implement tags
- Implement search
- Implement pinning
- Implement archive

---

## Phase 7 — Additional Productivity Features

- Bookmarks
- Calendar
- Habits
- Global search
- Notifications

---

## Phase 8 — Analytics and Integrations

- Productivity analytics
- Charts
- GitHub integration
- GitHub activity
- Repository integration

---

## Phase 9 — Polish and Deployment

- Responsive optimization
- Accessibility improvements
- Loading states
- Error states
- Empty states
- Performance optimization
- Security review
- Database optimization
- Production deployment
- Documentation

---

# 29. MVP Definition of Done

The MVP is considered complete when the user can:

1. Register an account.
2. Log in and log out.
3. Access a protected dashboard.
4. Create, edit, and delete tasks.
5. Change task status and priority.
6. Assign tasks to projects.
7. Create, edit, and delete projects.
8. View project progress.
9. Create, edit, and delete notes.
10. Search and filter relevant data.
11. Switch between light and dark themes.
12. Use the application comfortably on desktop and mobile.
13. Have all personal data isolated from other users.
14. Deploy the application to production.

---

# 30. Future Improvements

Potential future features include:

- GitHub OAuth integration
- GitHub activity synchronization
- Email notifications
- Push notifications
- Advanced calendar integration
- Google Calendar integration
- Drag-and-drop Kanban
- File attachments
- Full-text search
- Advanced analytics
- Import/export data
- Data backup
- PWA support
- Offline support
- AI-powered productivity features
- Public project sharing

These features should only be considered after the core application is stable.

---

# 31. Success Criteria

The project should be considered successful when:

- The developer can use it as a daily personal dashboard.
- Core productivity workflows can be completed without external applications.
- The application is deployed and accessible online.
- The codebase is organized and maintainable.
- The database has a proper relational structure.
- Authentication and authorization are implemented securely.
- The UI is responsive.
- The application demonstrates real-world full-stack development practices.

---

# 32. Portfolio Positioning

The project can be presented as:

> **Personal Dashboard — A full-stack personal productivity platform for managing tasks, projects, notes, bookmarks, habits, and schedules from a centralized workspace.**

### Core Technologies

**Next.js · React · TypeScript · PostgreSQL · Supabase · Drizzle ORM · Tailwind CSS · shadcn/ui · Turborepo**

### Key Engineering Concepts

- Full-stack development
- Relational database design
- Authentication and authorization
- REST/API integration
- Server-side data handling
- Form validation
- Search and filtering
- Responsive UI
- Third-party API integration
- Monorepo architecture
- Production deployment
