# 🎯 Watcher Application

A modern, full-stack ticketing and management system built with **Spring Boot**, **React**, and **TypeScript**.

## ✨ Key Features

- 🎫 **Ticket Management** - Track and resolve support tickets with priorities and statuses
- 👥 **User Management** - Role-based access control (Admin, Manager, User)
- 🏢 **Department Organization** - Group users and tickets by departments
- 📢 **Announcements** - Communicate with your team effectively
- 📊 **Analytics Dashboard** - Real-time charts and metrics
- 🔒 **Secure Authentication** - JWT with refresh tokens
- ⚡ **High Performance** - Spring Boot backend with JPA/Hibernate
- 🎨 **Modern UI** - SCSS 7-1 architecture with smooth animations

## 🚀 Quick Start

### Backend Setup (Spring Boot)
```bash
cd watcher_server

# Set environment variables
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=your_password
export JWT_SECRET=your-secret-key

# Run the application
mvn spring-boot:run
# Runs on http://localhost:8081
```

### Frontend Setup (React)
```bash
cd watcher_client
npm install
npm run dev  # Runs on http://localhost:3000
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[📖 Documentation Hub](docs/README.md)** - Complete documentation index
- **[🔌 API Reference](docs/API.md)** - REST API endpoints and examples
- **[🏗️ Architecture Guide](docs/ARCHITECTURE.md)** - System design and patterns
- **[🔐 Authentication Guide](docs/AUTHENTICATION.md)** - JWT authentication flow
- **[🗄️ Database Schema](docs/DATABASE.md)** - Database design and relationships
- **[🛠️ Development Guide](docs/DEVELOPMENT.md)** - Setup and coding standards

### Quick Links
- **Backend API (Swagger)**: http://localhost:8081/swagger-ui.html
- **Backend README**: [watcher_server/README.md](watcher_server/README.md)
- **SCSS Guide**: [watcher_client/src/styles/README.md](watcher_client/src/styles/README.md)

## 🛠️ Technology Stack

**Backend:** Spring Boot 3.3.4, Java 23, JPA/Hibernate, MySQL, JWT, Lombok
**Frontend:** React 18, TypeScript, TanStack Query, Zustand, SCSS, Framer Motion, Chart.js

## 📖 Features

- User authentication and authorization with JWT
- Ticket system with priorities and statuses
- Department management
- Announcements with scheduling
- Interactive dashboard with charts
- Real-time notifications via React Hot Toast
- Responsive design with SCSS 7-1 architecture
- Type-safe forms with React Hook Form + Zod
- Optimized data fetching with TanStack Query
- State management with Zustand
- Smooth animations with Framer Motion

## 🏗️ Architecture

**Backend:** Layered architecture (Controller → Service → Repository)
**Frontend:** Component-based with custom hooks and global state management
**Database:** MySQL with JPA/Hibernate ORM
**API:** RESTful endpoints with comprehensive Swagger documentation

## 🔒 Security

- JWT-based authentication
- BCrypt password hashing
- Role-based access control (RBAC)
- Spring Security configuration
- Input validation
- CORS support

## 📊 Performance

- Hibernate batch processing
- Query optimization
- React Query caching
- Pagination support
- Lazy loading
- Code splitting

For detailed feature documentation, see the README files in each subdirectory.

---

**Built with ❤️ using Spring Boot and React**
