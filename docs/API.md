# 📡 API Documentation

Complete API reference for the Watcher application backend.

## Base URL

```
http://localhost:8081
```

## Authentication

All API requests (except auth endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Login

```http
POST /watcher/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "username": "johndoe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "roleLevel": 1,
    "departmentName": "IT Department",
    "issuedAt": "2025-01-14T10:30:00Z"
  }
}
```

### Register

```http
POST /watcher/auth/register
```

**Request Body:**
```json
{
  "username": "janedoe",
  "password": "SecurePass123",
  "departmentId": 1,
  "roleLevel": 0
}
```

**Validation Rules:**
- `username`: 3-100 chars, alphanumeric with dots/hyphens/underscores
- `password`: 8-100 chars, must contain uppercase, lowercase, and number
- `roleLevel`: 0 (User), 1 (Admin), 2 (Manager)

**Response:** Same as login response

### Refresh Token

```http
POST /watcher/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** New access token and refresh token

### Logout

```http
POST /watcher/auth/logout
```

**Headers:** Requires Authorization header

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Check Username Availability

```http
GET /watcher/auth/check-username?username=johndoe
```

**Response:**
```json
{
  "success": true,
  "data": true,
  "message": "Username is available"
}
```

---

## 👥 User Management

### Get All Users

```http
GET /watcher/manage/users?username=john&sortBy=id&sortDir=desc
```

**Authorization:** Admin, Manager

**Query Parameters:**
- `username` (optional): Filter by username
- `sortBy` (default: "id"): Sort field
- `sortDir` (default: "desc"): Sort direction

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "johndoe",
      "departmentId": 1,
      "departmentName": "IT Department",
      "roleLevel": 1,
      "roleName": "Admin",
      "isActive": true,
      "createdAt": "2025-01-01T10:00:00Z",
      "updatedAt": "2025-01-14T10:00:00Z",
      "createdBy": "system",
      "updatedBy": "admin",
      "ticketCount": 5
    }
  ]
}
```

### Get Paged Users

```http
GET /watcher/manage/users/paged?page=0&size=10&sortBy=id&sortDir=desc
```

**Authorization:** Admin, Manager

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 0,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get User by ID

```http
GET /watcher/manage/users/{id}
```

**Authorization:** Admin, Manager, or own profile

### Get Current User

```http
GET /watcher/manage/users/me
```

**Authorization:** Any authenticated user

### Create User

```http
POST /watcher/manage/users
```

**Authorization:** Admin only

**Request Body:**
```json
{
  "username": "newuser",
  "password": "SecurePass123",
  "departmentId": 1,
  "roleLevel": 0,
  "isActive": true
}
```

### Update User

```http
PUT /watcher/manage/users/{id}
```

**Authorization:** Admin or own profile

**Request Body:**
```json
{
  "username": "updateduser",
  "password": "NewSecurePass123",
  "departmentId": 2,
  "roleLevel": 1,
  "isActive": true
}
```

*All fields are optional*

### Delete User (Soft Delete)

```http
DELETE /watcher/manage/users/{id}
```

**Authorization:** Admin only

### Restore User

```http
POST /watcher/manage/users/{id}/restore
```

**Authorization:** Admin only

---

## 🎫 Ticket Management

### Get All Tickets

```http
GET /watcher/manage/tickets?status=0&priority=2
```

**Query Parameters:**
- `status`: 0 (Open), 1 (In Progress), 2 (Resolved), 3 (Closed)
- `priority`: 0 (Low), 1 (Medium), 2 (High), 3 (Critical)

### Create Ticket

```http
POST /watcher/manage/tickets
```

**Request Body:**
```json
{
  "content": "System is experiencing slow performance during peak hours",
  "status": 0,
  "priority": 2,
  "userId": 1,
  "isActive": true
}
```

**Validation:**
- `content`: 10-5000 characters
- `status`: 0-3
- `priority`: 0-3

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "content": "System is experiencing slow performance...",
    "status": 0,
    "statusName": "Open",
    "priority": 2,
    "priorityName": "High",
    "userId": 1,
    "username": "johndoe",
    "isActive": true,
    "createdAt": "2025-01-14T10:30:00Z"
  }
}
```

### Update Ticket

```http
PUT /watcher/manage/tickets/{id}
```

**Request Body:**
```json
{
  "status": 1,
  "priority": 3
}
```

---

## 🏢 Department Management

### Get All Departments

```http
GET /watcher/manage/departments
```

### Create Department

```http
POST /watcher/manage/departments
```

**Request Body:**
```json
{
  "departmentName": "Customer Support",
  "description": "Handles all customer inquiries and support tickets",
  "isActive": true
}
```

**Validation:**
- `departmentName`: 2-200 characters, required
- `description`: Max 1000 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "departmentName": "Customer Support",
    "description": "Handles all customer inquiries...",
    "isActive": true,
    "userCount": 0,
    "announcementCount": 0,
    "createdAt": "2025-01-14T10:30:00Z"
  }
}
```

---

## 📢 Announcement Management

### Get All Announcements

```http
GET /watcher/manage/announces?isPublic=true
```

### Create Announcement

```http
POST /watcher/manage/announces
```

**Request Body:**
```json
{
  "title": "System Maintenance Scheduled",
  "content": "The system will undergo maintenance on Sunday from 2-4 AM EST",
  "startDate": "2025-01-19T02:00:00Z",
  "endDate": "2025-01-19T04:00:00Z",
  "departmentId": 1,
  "isPublic": true,
  "isActive": true
}
```

**Validation:**
- `title`: 3-500 characters
- `content`: 10-10000 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "System Maintenance Scheduled",
    "content": "The system will undergo maintenance...",
    "startDate": "2025-01-19T02:00:00Z",
    "endDate": "2025-01-19T04:00:00Z",
    "departmentId": 1,
    "departmentName": "IT Department",
    "isPublic": true,
    "isActive": true,
    "isCurrentlyActive": false,
    "isExpired": false,
    "isScheduled": true,
    "createdAt": "2025-01-14T10:30:00Z"
  }
}
```

---

## 🔢 Enums

### Get All Enums

```http
GET /watcher/enums/load
```

**Response:** All system enumerations (roles, statuses, priorities)

---

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-01-14T10:30:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "username": "Username is required",
    "password": "Password must be at least 8 characters"
  },
  "timestamp": "2025-01-14T10:30:00Z"
}
```

### Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "fieldName": "error message"
  }
}
```

---

## 🔒 Role-Based Access Control

| Endpoint | User | Manager | Admin |
|----------|------|---------|-------|
| View own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ✅ | ✅ |
| Create users | ❌ | ❌ | ✅ |
| Update own profile | ✅ | ✅ | ✅ |
| Update other users | ❌ | ❌ | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| Manage tickets | ✅ | ✅ | ✅ |
| Manage departments | ❌ | ✅ | ✅ |
| Manage announcements | ❌ | ✅ | ✅ |

---

## 🚀 Rate Limiting

Currently no rate limiting is implemented. Consider adding for production.

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Soft deletes are used - deleted entities have `deletedAt` field set
- Pagination uses zero-based indexing
- Default page size is 10, max is 100
