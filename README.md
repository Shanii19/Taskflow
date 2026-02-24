# 🗂️ TaskFlow — Team Task Management Platform

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss)

**TaskFlow** is a lightweight, local-first team task management web application. It features an offline storage architecture, dark/light mode UI, animated state transitions, and interactive analytics charts.

---

## 📋 Table of Contents

- [What Is This App?](#-what-is-this-app)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Data Storage](#-data-storage)
- [Getting Started (Local)](#-getting-started-local)
- [App Pages](#-app-pages)
- [Deployment](#-deployment)

---

## 🤔 What Is This App?

TaskFlow is designed to be a clean, structured way for individuals and small teams to securely manage tasks locally without needing a cloud database setup. It runs entirely on your device via the Web Storage API (`localStorage`), meaning all of your tasks stay completely private and offline.

Think of it as a lightning-fast, highly responsive Trello alternative built entirely on modern open-source tech.

---

## ✨ Features

### 🔐 Instant Authentication
- Local mock authentication — "Sign In" instantly to generate a secure local session.
- Seamless creation of task environments isolated to your browser storage.
- Zero backend configuration required.

### � Task Management Features
| Feature | Description |
|--------|-------------|
| Create Tasks | Rapidly create and categorize tasks with titles, descriptions, status, and due dates |
| Edit Tasks | Update task name, description, priority, and progress |
| Delete Tasks | Soft-delete architecture protects accidental deletion of important data |
| AI Generation | (Optional) Generate robust task descriptions and priorities using Groq AI integration |

### 📊 Analytics Dashboard
- **Pie Chart** — Task status breakdown: Completed, In Progress, Overdue
- **Bar Chart** — Project status distribution
- Built with **Recharts** and seamlessly themed for both dark and light mode

### 🎨 UI & UX
- Smooth **Framer Motion** animations (page transitions, card entrances)
- **Dark / Light / System** theme toggle via `next-themes`
- Responsive sidebar that collapses to icon-only mode
- Skeleton loading states and toast notifications
- Beautiful custom checklist and calendar favicon

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS v3, `tailwindcss-animate` |
| Animations | Framer Motion |
| UI Components | shadcn/ui (Radix UI primitives) |
| Data Storage | LocalStorage API (`src/lib/storage.ts`) |
| Auth | Local Mock Authentication (`useAuth.tsx`) |
| Charts | Recharts |
| Form Validation | Zod + React Hook Form |
| Routing | React Router DOM v6 |
| Theming | next-themes |
| Icons | Lucide React |

---

## 📁 Project Structure

```
f:\Taskflow\
├── public/                        # Static assets (including favicon.png)
├── src/
│   ├── components/
│   │   ├── ui/                    # All shadcn/ui base components
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx   # Sidebar + main content shell
│   │   ├── AppSidebar.tsx         # Collapsible navigation sidebar
│   │   ├── NavLink.tsx            # Active-aware nav link wrapper
│   │   ├── ProtectedRoute.tsx     # Auth guard for protected pages
│   │   └── CreateTaskModal.tsx    # Modal to create a new task
│   ├── hooks/
│   │   ├── useAuth.tsx            # Auth context: mock local sign in/up/out
│   │   ├── use-toast.ts           # Toast notification hook
│   │   └── use-mobile.tsx         # Responsive breakpoint hook
│   ├── lib/
│   │   └── storage.ts             # LocalStorage Database Utility
│   ├── pages/
│   │   ├── Auth.tsx               # Sign In / Sign Up page
│   │   ├── Dashboard.tsx          # Main overview with stats
│   │   ├── Tasks.tsx              # Browse, create, delete tasks
│   │   ├── Settings.tsx           # User settings page
│   │   └── NotFound.tsx           # 404 page
│   ├── App.tsx                    # Route definitions + providers
│   ├── main.tsx                   # React app entry point
│   └── index.css                  # Global styles + Tailwind + CSS vars
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 📊 Data Storage

Data is managed purely in the browser using the `src/lib/storage.ts` module.

| Entity | Purpose |
|-------|---------|
| `tasks` | Individual tasks with priority, due date, status stored in `localStorage` under `taskflow_tasks` |
| `user` | Current active user session stored in `localStorage` securely with mock UUID definitions |

**Soft Deletes:** Tasks use a `deleted_at` field instead of hard deletion to preserve history and prevent accidental permanent erasure.

---

## 🚀 Getting Started (Local)

### Prerequisites
- Node.js 18+ and npm

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at **http://localhost:8080**.

Simply click **Sign In** or **Sign Up** to create a local profile and begin using the app immediately!

---

## 📱 App Pages

| Route | Page | Access |
|-------|------|--------|
| `/auth` | Sign In / Sign Up | Public |
| `/dashboard` | Overview, stats, analytics | Auth required |
| `/tasks` | All tasks board | Auth required |
| `/settings` | User settings | Auth required |
| `*` | 404 Not Found | Public |

---

## ☁️ Deployment

### Deploy Frontend
```bash
npm run build       # Builds to /dist
npm run preview     # Preview production build locally
```
You can upload the `/dist` folder to any static host: **Vercel, Netlify, Cloudflare Pages, etc.** Since the app requires zero backend infrastructure, the compiled bundle can be served anywhere safely.

---

## 📝 License

MIT License — free to use, modify, and distribute.

---

> Built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui.
