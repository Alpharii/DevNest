Tasks 1 — USER PROFILE
Feature:

Update profile
Bio
Skills (array)
Avatar (optional later)

Endpoint:
```bash
GET /users/me
PATCH /users/me
GET /users/:id
```


Tasks 2 — PROJECT CORE

Feature:
Create project
List projects
Project detail

Endpoint:
POST /projects
GET /projects
GET /projects/:

Field minimal:
title
description
owner_id
visibility (public/private)

Tasks 3 — PROJECT MEMBERSHIP

Feature:
Join project
Invite member
List members

Endpoint:
POST /projects/:id/join
POST /projects/:id/invite
GET /projects/:id/members

Table penting:
project_members
- id
- project_id
- user_id
- role (owner, dev, designer)

Tasks 4 — PROJECT WORKSPACE

Feature:
Project dashboard
Activity log (optional)

Endpoint:
GET /projects/:id/workspace

Tasks 5 — KANBAN BOARD

Entities:
Column
Task

Columns API
POST /projects/:id/columns
GET /projects/:id/columns
PATCH /columns/:id
DELETE /columns/:id

Default column auto-create:
Backlog
Todo
In Progress
Done

Tasks API
POST /columns/:id/tasks
PATCH /tasks/:id
DELETE /tasks/:id

Field minimal:
title
description
assignee_id
order_index (untuk drag-drop)

Tasks 6 — PERMISSIONS

Simple role system:
owner
admin
member

Middleware:
RequireProjectRole("owner")


Post MVP Task:

Notifications
Comments
File uploads
Realtime updates
GitHub integration
AI features

Create Order

1. Auth (done)
2. /me endpoint (done)
3. User profile update
4. Create project
5. List projects
6. Join project
7. Project members
8. Columns (kanban)
9. Tasks
10. Permissions
⚡ Backend Architecture Tip (Khusus kamu)

Planned structure:

internal/
  modules/
    auth/
    users/
    projects/
    memberships/
    boards/
