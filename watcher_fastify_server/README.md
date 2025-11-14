# Watcher Fastify Server

Modern backend server built with Fastify, TypeScript, and Prisma.

## Features

- ⚡ **Fastify** - Fast and low overhead web framework
- 🔒 **JWT Authentication** - Secure authentication with refresh tokens
- 🗄️ **Prisma ORM** - Type-safe database access
- 📝 **TypeScript** - Full type safety
- 📚 **Swagger UI** - Auto-generated API documentation
- 🎯 **Role-based Access Control** - Admin, Manager, and User roles
- 🔍 **Advanced Filtering** - Pagination, search, and filtering
- 💾 **Soft Deletes** - Data retention with soft delete
- 📊 **Audit Trail** - Created/updated timestamps on all entities

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Fastify 5
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: MySQL
- **Authentication**: JWT + Refresh Tokens
- **Password**: bcrypt
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Start development server:
```bash
npm run dev
```

The server will start on http://localhost:8081

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8081/swagger

## Database Schema

### Enhanced Features

- **Users**: Complete user management with roles and departments
- **Departments**: Organizational structure with managers
- **Tickets**: Full ticketing system with:
  - Unique ticket numbers
  - Priority levels (LOW, MEDIUM, HIGH, CRITICAL)
  - Status tracking (OPEN, IN_PROGRESS, PENDING_REVIEW, RESOLVED, CLOSED, REJECTED)
  - Assignments to users
  - Comments and attachments
  - Due dates and resolution tracking
- **Announcements**: Content management with:
  - Publish and expiry dates
  - Pinned announcements
  - Active/inactive status
- **Refresh Tokens**: Secure token refresh mechanism
- **Audit Fields**: All entities track creation, updates, and soft deletes

## API Endpoints

### Authentication
- `POST /watcher/auth/register` - Register new user
- `POST /watcher/auth/login` - Login user
- `POST /watcher/auth/logout` - Logout user
- `POST /watcher/auth/refresh` - Refresh access token
- `GET /watcher/auth/me` - Get current user
- `PUT /watcher/auth/update` - Update profile
- `GET /watcher/auth/check-username` - Check username availability

### User Management (Admin/Manager)
- `GET /watcher/manage/users` - Get all users
- `GET /watcher/manage/users/paged` - Get paginated users
- `GET /watcher/manage/users/:id` - Get user by ID
- `POST /watcher/manage/users` - Create user
- `PUT /watcher/manage/users/:id` - Update user
- `DELETE /watcher/manage/users/:id` - Delete user

### Department Management
- `GET /watcher/manage/departments` - Get all departments
- `GET /watcher/manage/departments/paged` - Get paginated departments
- `GET /watcher/manage/departments/:id` - Get department by ID
- `POST /watcher/manage/departments` - Create department
- `PUT /watcher/manage/departments/:id` - Update department
- `DELETE /watcher/manage/departments/:id` - Delete department

### Ticket Management
- `GET /watcher/manage/tickets` - Get all tickets
- `GET /watcher/manage/tickets/paged` - Get paginated tickets
- `GET /watcher/manage/tickets/:id` - Get ticket by ID
- `POST /watcher/manage/tickets` - Create ticket
- `PUT /watcher/manage/tickets/:id` - Update ticket
- `DELETE /watcher/manage/tickets/:id` - Delete ticket
- `POST /watcher/manage/tickets/:id/comments` - Add comment to ticket

### Announcement Management
- `GET /watcher/manage/announces` - Get all announcements
- `GET /watcher/manage/announces/paged` - Get paginated announcements
- `GET /watcher/manage/announces/:id` - Get announcement by ID
- `POST /watcher/manage/announces` - Create announcement
- `PUT /watcher/manage/announces/:id` - Update announcement
- `DELETE /watcher/manage/announces/:id` - Delete announcement

### Enums
- `GET /watcher/enums/load` - Get all enums
- `GET /watcher/enums/roles` - Get user roles
- `GET /watcher/enums/ticket-statuses` - Get ticket statuses
- `GET /watcher/enums/ticket-priorities` - Get ticket priorities

## Scripts

- `npm run dev` - Start development server with watch mode
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## Project Structure

```
watcher_fastify_server/
├── prisma/
│   └── schema.prisma        # Database schema
├── src/
│   ├── config/
│   │   └── database.ts      # Database connection
│   ├── controllers/         # (Future: Route controllers)
│   ├── middleware/
│   │   └── auth.middleware.ts  # Authentication & authorization
│   ├── models/              # (Future: Business logic models)
│   ├── routes/
│   │   ├── auth.routes.ts   # Auth endpoints
│   │   ├── user.routes.ts   # User management
│   │   ├── department.routes.ts
│   │   ├── ticket.routes.ts
│   │   ├── announce.routes.ts
│   │   └── enum.routes.ts
│   ├── services/            # (Future: Business logic)
│   ├── utils/
│   │   ├── password.ts      # Password hashing
│   │   ├── response.ts      # Response formatters
│   │   └── ticket-number.ts # Ticket number generator
│   └── server.ts            # Application entry point
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Environment Variables

```env
# Server
PORT=8081
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_URL="mysql://user:password@localhost:3306/watcher_db"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"

# CORS
CORS_ORIGIN="http://localhost:3000"
```

## License

MIT
