# 📚 Watcher Application Documentation

Complete documentation for the Watcher ticketing and management system.

## Documentation Index

### 🚀 Getting Started
- **[Main README](../README.md)** - Project overview and quick start

### 📖 Core Documentation

#### [API Documentation](./API.md)
Complete REST API reference with all endpoints, request/response examples, and authentication details.

**Contents:**
- Authentication endpoints (login, register, refresh, logout)
- User management APIs
- Ticket management APIs
- Department management APIs
- Announcement APIs
- Response formats and error handling
- Role-based access control matrix

#### [Architecture Documentation](./ARCHITECTURE.md)
System design, architecture patterns, and technical implementation details.

**Contents:**
- System overview and component architecture
- Backend layered architecture (Controller → Service → Repository)
- Security architecture and JWT flow
- Data architecture and entity relationships
- Frontend architecture and state management
- Design patterns used
- Performance optimizations
- Scalability considerations

#### [Authentication Guide](./AUTHENTICATION.md)
Complete guide to the JWT-based authentication system.

**Contents:**
- Registration and login flows
- JWT token structure and validation
- Refresh token rotation
- Authorization and role-based access control
- Security configuration
- Password security
- Troubleshooting authentication issues

#### [Database Schema](./DATABASE.md)
Database design, entity relationships, and data management.

**Contents:**
- Entity relationship diagram
- Complete table schemas with all columns
- Relationships and foreign keys
- Soft delete pattern implementation
- JPA auditing configuration
- Indexing strategy
- Sample data and queries
- Backup and maintenance procedures

#### [Development Guide](./DEVELOPMENT.md)
Developer setup, coding standards, and contribution guidelines.

**Contents:**
- Development environment setup
- Project structure overview
- Coding standards (Java, TypeScript, React)
- Testing strategies and examples
- Git workflow and commit conventions
- Deployment procedures
- Troubleshooting common issues

---

## Quick Links

### For Developers
- [Setup Instructions](./DEVELOPMENT.md#getting-started)
- [Project Structure](./DEVELOPMENT.md#project-structure)
- [Coding Standards](./DEVELOPMENT.md#coding-standards)
- [Testing Guide](./DEVELOPMENT.md#testing)

### For API Users
- [API Endpoints](./API.md)
- [Authentication Flow](./AUTHENTICATION.md#authentication-flow)
- [Response Formats](./API.md#response-format)

### For System Administrators
- [Database Setup](./DATABASE.md)
- [Security Configuration](./ARCHITECTURE.md#security-architecture)
- [Deployment Guide](./DEVELOPMENT.md#deployment)

### For Architects
- [System Architecture](./ARCHITECTURE.md)
- [Design Patterns](./ARCHITECTURE.md#design-patterns)
- [Performance Tuning](./ARCHITECTURE.md#performance-optimizations)
- [Scalability](./ARCHITECTURE.md#scalability-considerations)

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.3.4
- **Language:** Java 23
- **Security:** Spring Security with JWT
- **Database:** MySQL 8.0
- **ORM:** Hibernate/JPA
- **Build Tool:** Maven
- **Authentication:** JJWT 0.12.6

### Frontend
- **Framework:** React 18
- **Language:** TypeScript
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **Forms:** React Hook Form + Zod
- **Styling:** SCSS (7-1 Architecture)
- **Charts:** Chart.js
- **Animations:** Framer Motion

---

## Documentation Standards

All documentation follows these principles:

1. **Clear and Concise** - Easy to understand for all skill levels
2. **Code Examples** - Practical examples for all concepts
3. **Visual Diagrams** - ASCII diagrams for architecture and flows
4. **Up to Date** - Documentation updated with code changes
5. **Searchable** - Well-organized with clear headings
6. **Comprehensive** - Covers all aspects of the system

---

## Contributing to Documentation

To improve or add documentation:

1. Follow the existing format and style
2. Include code examples where relevant
3. Add diagrams for complex flows
4. Update the index (this file) if adding new docs
5. Test all code examples before committing
6. Submit a pull request with clear description

---

## Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| API.md | 2025-01-14 | 1.0.0 |
| ARCHITECTURE.md | 2025-01-14 | 1.0.0 |
| AUTHENTICATION.md | 2025-01-14 | 1.0.0 |
| DATABASE.md | 2025-01-14 | 1.0.0 |
| DEVELOPMENT.md | 2025-01-14 | 1.0.0 |

---

## Support

For questions or issues:
- Create an issue in the repository
- Contact the development team
- Refer to the troubleshooting sections in each guide

---

**Documentation maintained with ❤️ by the Watcher development team**
