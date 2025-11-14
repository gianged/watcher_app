# 🎯 Watcher Application

A modern, full-stack ticketing and management system built with **Fastify**, **React**, and **TypeScript**.

## ✨ Key Features

- 🎫 **Ticket Management** - Track and resolve support tickets with priorities and statuses
- 👥 **User Management** - Role-based access control (Admin, Manager, User)
- 🏢 **Department Organization** - Group users and tickets by departments
- 📢 **Announcements** - Communicate with your team effectively  
- 📊 **Analytics Dashboard** - Real-time charts and metrics
- 🔒 **Secure Authentication** - JWT with refresh tokens
- ⚡ **High Performance** - Fastify backend, React Query frontend
- 🎨 **Modern UI** - SCSS 7-1 architecture with smooth animations

## 🚀 Quick Start

### Backend Setup
```bash
cd watcher_fastify_server
npm install
cp .env.example .env  # Configure your database
npm run prisma:migrate
npm run dev  # Runs on http://localhost:8081
```

### Frontend Setup
```bash
cd watcher_client
npm install
npm run dev  # Runs on http://localhost:3000
```

## 📚 Documentation

- **Backend API**: http://localhost:8081/swagger
- **Backend README**: [watcher_fastify_server/README.md](watcher_fastify_server/README.md)
- **SCSS Guide**: [watcher_client/src/styles/README.md](watcher_client/src/styles/README.md)

## 🛠️ Technology Stack

**Backend:** Fastify, TypeScript, Prisma, MySQL, JWT  
**Frontend:** React, TypeScript, TanStack Query, Zustand, SCSS, Framer Motion, Chart.js

## 📖 Features

- User authentication and authorization
- Ticket system with priorities and statuses
- Department management
- Announcements with scheduling
- Interactive dashboard with charts
- Real-time notifications
- Responsive design
- Dark mode support

For detailed feature documentation, see the README files in each subdirectory.
