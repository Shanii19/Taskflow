# TaskFlow - Team Task Management Application

A full-stack team task management application built with React, TypeScript, Tailwind CSS, Supabase, and Framer Motion.

## 🚀 Features

### Authentication & Authorization
- Secure email/password authentication via Supabase Auth
- Role-based access control (Admin & Employee roles)
- Auto-confirmed email signups for testing
- Protected routes with role verification

### Admin Capabilities
- **Full Access**: Create, update, and delete all resources
- **Team Management**: Create and manage teams
- **Project Management**: Create projects, assign to teams, track progress and status
- **Task Management**: Create, assign, and manage tasks
- **Employee Management**: Invite and create employee accounts
- **Analytics Dashboard**: View pie charts and bar graphs of project/task progress

### Employee Capabilities
- **View-Only Access**: View assigned tasks only
- **Limited Dashboard**: See only relevant information
- No create, edit, or delete permissions

### Real-Time Features
- Live updates using Supabase Realtime
- Instant task and project changes across all clients
- Real-time dashboard statistics

### Analytics & Reporting
- **Pie Chart**: Task completion status (Completed, In Progress, Overdue)
- **Bar Chart**: Project progress overview (Pending, In Progress, Completed)
- Real-time data visualization using Recharts

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **Form Validation**: Zod
- **Routing**: React Router v6

## 📊 Database Schema

### Core Tables
- `profiles` - User profile information
- `user_roles` - Role assignments (admin/member)
- `teams` - Team management
- `projects` - Project tracking with status and progress
- `tasks` - Task assignments and tracking
- `team_members` - Junction table for team memberships
- `comments` - Task comments
- `attachments` - File attachments
- `activity_logs` - Audit trail

## 🎯 Getting Started

### 1. Initial Admin Setup

**IMPORTANT**: Create the admin account first!

- Email: `shayanmustafahassan@gmail.com`
- Name: Shayan
- Role: admin

**Steps:**
1. Navigate to `/auth` in the app
2. Click "Sign Up" tab
3. Register with the admin email and name
4. After signup, update the role to admin:
   - Open Lovable Cloud Backend
   - Go to Database → user_roles table
   - Find your user_id and change role from 'member' to 'admin'
5. Log out and log back in

📖 See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup instructions.

### 2. Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Environment Variables

Automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── layouts/                 # Layout components
│   ├── AppSidebar.tsx           # Main navigation
│   ├── CreateProjectModal.tsx   # Project creation
│   ├── CreateTeamModal.tsx      # Team creation
│   ├── InviteEmployeeModal.tsx  # Employee invitation
│   ├── DashboardAnalytics.tsx   # Charts & analytics
│   └── ProtectedRoute.tsx       # Route protection
├── hooks/
│   └── useAuth.tsx              # Authentication hook
├── pages/
│   ├── Auth.tsx                 # Login/Signup
│   ├── Dashboard.tsx            # Main dashboard
│   ├── Projects.tsx             # Projects page
│   └── Teams.tsx                # Teams page
└── integrations/supabase/       # Supabase client

supabase/
└── migrations/                  # Database migrations
```

## 💼 Usage Guide

### Admin Workflow
1. Login with admin credentials
2. Create teams to organize employees
3. Invite employees via "Invite Employee" button
4. Create projects and assign to teams
5. Create and assign tasks to team members
6. Monitor progress via analytics dashboard

### Employee Workflow
1. Login with provided credentials
2. View assigned tasks on dashboard
3. View project and team information
4. No editing capabilities

## 🔐 Security Features

1. **Row-Level Security (RLS)** on all Supabase tables
2. **Server-side role verification** using `has_role()` function
3. **Protected routes** with admin checks
4. **Input validation** using Zod schemas
5. **Secure authentication** via Supabase Auth

## ✅ Testing Checklist

- [ ] Admin account created with correct email
- [ ] Admin role assigned in database
- [ ] Admin can create teams
- [ ] Admin can create projects
- [ ] Admin can invite employees
- [ ] Employee account created
- [ ] Employee has view-only access
- [ ] Real-time updates working
- [ ] Analytics charts displaying
- [ ] Responsive design on mobile

## 🚀 Deployment

**Lovable Cloud Deployment:**
1. Click "Publish" button in Lovable editor
2. Frontend deploys automatically
3. Backend (Supabase) is already connected
4. Database migrations run automatically

**Custom Domain:**
- Go to Settings → Domains
- Follow instructions to connect your domain

## 🐛 Troubleshooting

### Access Denied
- Verify admin role in `user_roles` table
- Clear browser cache and re-login

### Real-Time Not Working
- Check Supabase Realtime is enabled
- Verify RLS policies allow reads

### Charts Not Showing
- Ensure projects/tasks exist in database
- Check browser console for errors

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions
- [Lovable Documentation](https://docs.lovable.dev)
- [Supabase Documentation](https://supabase.com/docs)

## 📝 License

MIT License

---

Built with ❤️ using Lovable, React, Supabase, and modern web technologies.
