# 🗄️ Database Schema Documentation

Complete database schema and entity relationship documentation for the Watcher application.

## Database Overview

- **Database Type:** MySQL 8.0
- **Character Set:** utf8mb4
- **Collation:** utf8mb4_unicode_ci
- **ORM:** Hibernate/JPA

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│    departments      │
│─────────────────────│
│ PK department_id    │──┐
│    department_name  │  │
│    description      │  │
│    is_active        │  │
│    created_at       │  │
│    updated_at       │  │
│    created_by       │  │
│    updated_by       │  │
│    deleted_at       │  │
└─────────────────────┘  │
                         │ 1
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        │ n                                │ n
┌───────▼──────────┐            ┌──────────▼────────┐
│    app_users     │            │    announces      │
│──────────────────│            │───────────────────│
│ PK app_user_id   │──┐         │ PK announce_id    │
│    username      │  │         │    title          │
│    password      │  │         │    content        │
│ FK department_id │  │         │    start_date     │
│    role_level    │  │         │    end_date       │
│    is_active     │  │         │ FK department_id  │
│    profile_pic   │  │         │    is_public      │
│    created_at    │  │         │    is_active      │
│    updated_at    │  │         │    created_at     │
│    created_by    │  │         │    updated_at     │
│    updated_by    │  │         │    created_by     │
│    deleted_at    │  │         │    updated_by     │
└──────────────────┘  │         │    deleted_at     │
                      │         └───────────────────┘
                      │ 1
                      │
        ┌─────────────┴───────────────┐
        │ n                            │ n
┌───────▼──────────┐      ┌───────────▼─────────┐
│     tickets      │      │   refresh_tokens    │
│──────────────────│      │─────────────────────│
│ PK ticket_id     │      │ PK id               │
│ FK app_user_id   │      │ FK user_id          │
│    content       │      │    token            │
│    status        │      │    expires_at       │
│    priority      │      │    is_revoked       │
│    is_active     │      │    created_at       │
│    created_at    │      └─────────────────────┘
│    updated_at    │
│    created_by    │
│    updated_by    │
│    deleted_at    │
└──────────────────┘
```

---

## Table Schemas

### 1. app_users

**Description:** System users with authentication and authorization

```sql
CREATE TABLE app_users (
    app_user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department_id INT,
    role_level INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    profile_picture LONGBLOB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_username (username),
    INDEX idx_department (department_id),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| app_user_id | INT | PK, AUTO_INCREMENT | Primary key |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Unique username |
| password | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| department_id | INT | FK, NULL | Reference to department |
| role_level | INT | DEFAULT 0 | 0=User, 1=Admin, 2=Manager |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| profile_picture | LONGBLOB | NULL | User profile image |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| created_by | VARCHAR(100) | NULL | Creator username |
| updated_by | VARCHAR(100) | NULL | Last updater username |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_username` on `username` - For authentication lookups
- `idx_department` on `department_id` - For department queries
- `idx_deleted` on `deleted_at` - For filtering deleted users

---

### 2. departments

**Description:** Organizational departments for grouping users and announcements

```sql
CREATE TABLE departments (
    department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP NULL,

    INDEX idx_name (department_name),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| department_id | INT | PK, AUTO_INCREMENT | Primary key |
| department_name | VARCHAR(200) | NOT NULL, UNIQUE | Department name |
| description | TEXT | NULL | Department description |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| created_by | VARCHAR(100) | NULL | Creator username |
| updated_by | VARCHAR(100) | NULL | Last updater username |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

---

### 3. tickets

**Description:** Support tickets created by users

```sql
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    app_user_id INT,
    content TEXT,
    status INT DEFAULT 0,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (app_user_id) REFERENCES app_users(app_user_id) ON DELETE SET NULL,
    INDEX idx_user (app_user_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| ticket_id | INT | PK, AUTO_INCREMENT | Primary key |
| app_user_id | INT | FK, NULL | Creator user reference |
| content | TEXT | NULL | Ticket description |
| status | INT | DEFAULT 0 | 0=Open, 1=In Progress, 2=Resolved, 3=Closed |
| priority | INT | DEFAULT 0 | 0=Low, 1=Medium, 2=High, 3=Critical |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| created_by | VARCHAR(100) | NULL | Creator username |
| updated_by | VARCHAR(100) | NULL | Last updater username |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

**Indexes:**
- `idx_user` on `app_user_id` - For user's tickets
- `idx_status` on `status` - For filtering by status
- `idx_priority` on `priority` - For filtering by priority
- `idx_created` on `created_at` - For sorting by date
- `idx_deleted` on `deleted_at` - For filtering deleted tickets

---

### 4. announces

**Description:** System announcements for users or departments

```sql
CREATE TABLE announces (
    announce_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(500),
    content TEXT,
    start_date TIMESTAMP NULL,
    end_date TIMESTAMP NULL,
    department_id INT,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted_at TIMESTAMP NULL,

    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE SET NULL,
    INDEX idx_department (department_id),
    INDEX idx_public (is_public),
    INDEX idx_dates (start_date, end_date),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| announce_id | INT | PK, AUTO_INCREMENT | Primary key |
| title | VARCHAR(500) | NULL | Announcement title |
| content | TEXT | NULL | Announcement content |
| start_date | TIMESTAMP | NULL | Effective start date |
| end_date | TIMESTAMP | NULL | Effective end date |
| department_id | INT | FK, NULL | Target department |
| is_public | BOOLEAN | DEFAULT FALSE | Public or department-only |
| is_active | BOOLEAN | DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | NOT NULL | Record creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |
| created_by | VARCHAR(100) | NULL | Creator username |
| updated_by | VARCHAR(100) | NULL | Last updater username |
| deleted_at | TIMESTAMP | NULL | Soft delete timestamp |

---

### 5. refresh_tokens

**Description:** JWT refresh tokens for authentication

```sql
CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES app_users(app_user_id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user (user_id),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | Primary key |
| user_id | INT | FK, NOT NULL | User reference |
| token | VARCHAR(500) | NOT NULL, UNIQUE | JWT refresh token |
| expires_at | TIMESTAMP | NOT NULL | Token expiration time |
| is_revoked | BOOLEAN | DEFAULT FALSE | Revocation status |
| created_at | TIMESTAMP | NOT NULL | Token creation time |

**Indexes:**
- `idx_token` on `token` - For token validation
- `idx_user` on `user_id` - For user's tokens
- `idx_expires` on `expires_at` - For cleanup queries

---

## Relationships

### One-to-Many Relationships

**departments → app_users**
- One department can have many users
- Users can belong to one department (or none)
- On delete: SET NULL (preserve user if department deleted)

**departments → announces**
- One department can have many announcements
- Announcements can target one department (or be public)
- On delete: SET NULL (preserve announcement if department deleted)

**app_users → tickets**
- One user can create many tickets
- Each ticket is created by one user
- On delete: SET NULL (preserve ticket if user deleted)

**app_users → refresh_tokens**
- One user can have many refresh tokens
- Each token belongs to one user
- On delete: CASCADE (delete tokens when user deleted)

---

## Soft Delete Pattern

All main entities use soft delete to preserve data integrity:

```java
@SQLDelete(sql = "UPDATE table_name SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
public class Entity {
    private Instant deletedAt;

    public void softDelete() {
        this.deletedAt = Instant.now();
        this.isActive = false;
    }
}
```

**Benefits:**
- Data preservation for audit trails
- Reversible deletions
- Referential integrity maintained
- Historical data analysis

**Querying:**
- Default queries exclude soft-deleted records (`WHERE deleted_at IS NULL`)
- Special queries can include deleted records if needed

---

## JPA Auditing

All entities are automatically audited:

```java
@EntityListeners(AuditingEntityListener.class)
public class Entity {
    @CreatedDate
    private Instant createdAt;      // Set on insert

    @LastModifiedDate
    private Instant updatedAt;      // Updated on save

    @CreatedBy
    private String createdBy;       // Username who created

    @LastModifiedBy
    private String updatedBy;       // Username who last updated
}
```

**Configuration:**
```java
@Configuration
@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
public class JpaAuditingConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return () -> {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            return Optional.of(auth != null ? auth.getName() : "system");
        };
    }
}
```

---

## Indexing Strategy

### Primary Indexes
- All tables have auto-increment integer primary keys
- Ensures fast lookups and joins

### Foreign Key Indexes
- All foreign keys are indexed
- Improves join performance

### Query Optimization Indexes
- **username** - Fast authentication lookups
- **status, priority** - Filter tickets efficiently
- **dates** - Range queries on announcements
- **deleted_at** - Exclude deleted records

### Composite Indexes (Future)
```sql
-- For complex ticket queries
CREATE INDEX idx_ticket_status_priority ON tickets(status, priority, created_at);

-- For active user lookups
CREATE INDEX idx_active_users ON app_users(is_active, deleted_at);
```

---

## Data Types

### Timestamps
- All timestamps use `TIMESTAMP` with UTC timezone
- Java uses `java.time.Instant` for consistency
- Format: ISO 8601 (e.g., `2025-01-14T10:30:00Z`)

### Text Fields
- Short text: `VARCHAR(n)`
- Long text: `TEXT` or `LONGTEXT`
- Always UTF-8 encoded (utf8mb4)

### Binary Data
- Profile pictures: `LONGBLOB`
- Supports up to 4GB per image

### Booleans
- MySQL `BOOLEAN` (stored as TINYINT(1))
- Java `Boolean` type

---

## Sample Data

### Initial Setup

```sql
-- Create departments
INSERT INTO departments (department_name, description, created_by)
VALUES
    ('IT Department', 'Information Technology and Systems', 'system'),
    ('HR Department', 'Human Resources', 'system'),
    ('Sales', 'Sales and Marketing', 'system'),
    ('Support', 'Customer Support', 'system');

-- Create admin user (password: Admin123)
INSERT INTO app_users (username, password, department_id, role_level, created_by)
VALUES
    ('admin',
     '$2a$10$YourBCryptHashedPasswordHere',
     1,
     1,
     'system');

-- Create sample ticket
INSERT INTO tickets (app_user_id, content, status, priority, created_by)
VALUES
    (1,
     'Email server is experiencing delays. Emails sent in the last hour have not been delivered.',
     0,
     2,
     'admin');

-- Create announcement
INSERT INTO announces (title, content, start_date, end_date, department_id, is_public, created_by)
VALUES
    ('System Maintenance',
     'The system will undergo scheduled maintenance this Sunday from 2-4 AM EST. Please save your work.',
     '2025-01-19 02:00:00',
     '2025-01-19 04:00:00',
     1,
     TRUE,
     'admin');
```

---

## Maintenance Queries

### Cleanup Expired Tokens

```sql
-- Delete expired and revoked refresh tokens
DELETE FROM refresh_tokens
WHERE expires_at < NOW() OR is_revoked = TRUE;
```

**Schedule:** Run daily via cron job or Spring @Scheduled

### Find Inactive Users

```sql
-- Users who haven't logged in for 90 days
SELECT u.username, u.created_at, u.updated_at
FROM app_users u
LEFT JOIN refresh_tokens rt ON u.app_user_id = rt.user_id
WHERE u.is_active = TRUE
  AND u.deleted_at IS NULL
  AND (rt.created_at IS NULL OR rt.created_at < DATE_SUB(NOW(), INTERVAL 90 DAY))
GROUP BY u.app_user_id;
```

### Database Size

```sql
-- Check table sizes
SELECT
    table_name AS `Table`,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS `Size (MB)`
FROM information_schema.TABLES
WHERE table_schema = 'watcher_db'
ORDER BY (data_length + index_length) DESC;
```

---

## Backup Strategy

### Recommended Approach

```bash
# Daily backup
mysqldump -u root -p \
    --single-transaction \
    --routines \
    --triggers \
    watcher_db > watcher_db_$(date +%Y%m%d).sql

# Compress backup
gzip watcher_db_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p watcher_db < watcher_db_20250114.sql
```

### What to Backup
- ✅ All tables and data
- ✅ Stored procedures and functions
- ✅ Triggers
- ❌ Temporary tables
- ❌ Expired refresh tokens (can be cleaned before backup)

---

## Performance Considerations

1. **Connection Pooling** - HikariCP (default in Spring Boot)
2. **Query Optimization** - Use EXPLAIN for slow queries
3. **Batch Processing** - Configured in Hibernate
4. **Read Replicas** - For high-traffic deployments
5. **Partitioning** - For very large tables (tickets, announces)

---

This schema provides a solid foundation with proper relationships, indexing, and audit trails.
