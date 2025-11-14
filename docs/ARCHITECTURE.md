# 🏗️ Architecture Documentation

## System Overview

Watcher is a full-stack ticketing and management system built with modern technologies and best practices.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│  React 18 + TypeScript + TanStack Query + Zustand          │
└─────────────────────────────────────────────────────────────┘
                          ↕ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                        │
│          Spring Security + JWT Authentication               │
└─────────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│    Controllers → Services → Repositories                    │
└─────────────────────────────────────────────────────────────┘
                          ↕ JPA/Hibernate
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│                    MySQL Database                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Layered Architecture Pattern

```
┌──────────────────────────────────────────────────────────┐
│                   Controller Layer                       │
│  - REST endpoints                                        │
│  - Request/Response mapping                              │
│  - Input validation (@Valid)                             │
│  - Authorization (@PreAuthorize)                         │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  - Business logic                                        │
│  - Transaction management (@Transactional)               │
│  - DTO conversion                                        │
│  - Exception handling                                    │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                  Repository Layer                        │
│  - Data access (Spring Data JPA)                         │
│  - Query methods                                         │
│  - Custom queries (@Query)                               │
└──────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────┐
│                   Entity Layer                           │
│  - JPA entities                                          │
│  - Relationships                                         │
│  - Constraints                                           │
└──────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Controllers
**Responsibility:** Handle HTTP requests and responses

```java
@RestController
@RequestMapping("/watcher/manage/users")
@RequiredArgsConstructor
public class AppUserController {
    private final UserService userService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
```

**Key Features:**
- RESTful endpoint design
- DTO validation with `@Valid`
- Role-based authorization
- Consistent response wrapping
- Comprehensive logging

#### 2. Services
**Responsibility:** Business logic and orchestration

```java
@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final AppUserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse createUser(CreateUserRequest request) {
        // Validation
        // Business logic
        // Data persistence
        // Response conversion
    }
}
```

**Key Features:**
- Transaction management
- Business rule enforcement
- DTO to Entity conversion
- Exception handling
- Logging

#### 3. Repositories
**Responsibility:** Data access and persistence

```java
@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByUsername(String username);
    Page<AppUser> findAllByUsernameContainingIgnoreCase(String username, Pageable pageable);
}
```

**Key Features:**
- Spring Data JPA
- Query derivation from method names
- Custom JPQL queries
- Pagination support

#### 4. Entities
**Responsibility:** Database mapping and relationships

```java
@Entity
@Table(name = "app_users")
@Data
@Builder
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE app_users SET deleted_at = CURRENT_TIMESTAMP WHERE app_user_id = ?")
@Where(clause = "deleted_at IS NULL")
public class AppUser implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    // Soft delete support
    private Instant deletedAt;
}
```

**Key Features:**
- Lombok for boilerplate reduction
- JPA Auditing
- Soft delete pattern
- Builder pattern
- Spring Security integration

---

## Security Architecture

### JWT Authentication Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │   API    │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │
     │  POST /auth/login  │                     │
     │───────────────────>│                     │
     │                    │  Validate user      │
     │                    │────────────────────>│
     │                    │<────────────────────│
     │                    │  Generate JWT       │
     │                    │  Save RefreshToken  │
     │                    │────────────────────>│
     │   JWT + Refresh    │                     │
     │<───────────────────│                     │
     │                    │                     │
     │  API Request       │                     │
     │  + Bearer Token    │                     │
     │───────────────────>│                     │
     │                    │  Validate JWT       │
     │                    │  Extract user       │
     │                    │  Check permissions  │
     │                    │                     │
     │   Response         │                     │
     │<───────────────────│                     │
```

### Security Components

**1. JwtUtil**
- Token generation (access + refresh)
- Token validation
- Claims extraction
- HMAC-SHA256 signing

**2. JwtAuthenticationFilter**
- Intercepts requests
- Validates JWT tokens
- Sets SecurityContext
- Exception handling

**3. SecurityConfig**
- Configure security filter chain
- Define public endpoints
- CORS configuration
- Password encoding (BCrypt)
- Authentication provider

**4. CustomUserDetailsService**
- Load user from database
- Integrate with Spring Security
- UserDetails implementation

---

## Data Architecture

### Entity Relationships

```
┌─────────────────┐
│   Department    │
│                 │
│ - id            │
│ - name          │
│ - description   │
└────────┬────────┘
         │ 1
         │
         │ n
    ┌────┴────────────────┐
    │                     │
┌───▼──────────┐    ┌────▼────────┐
│   AppUser    │    │  Announce   │
│              │    │             │
│ - id         │    │ - id        │
│ - username   │    │ - title     │
│ - password   │    │ - content   │
│ - roleLevel  │    │ - startDate │
└───┬──────────┘    └─────────────┘
    │ 1
    │
    │ n
┌───▼──────────┐    ┌──────────────┐
│   Ticket     │    │ RefreshToken │
│              │    │              │
│ - id         │    │ - id         │
│ - content    │    │ - token      │
│ - status     │    │ - expiresAt  │
│ - priority   │    │ - isRevoked  │
└──────────────┘    └──────────────┘
```

### Soft Delete Pattern

All entities support soft deletion:

```java
// Hibernate annotation marks as deleted
@SQLDelete(sql = "UPDATE table_name SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")

// Only fetch non-deleted records by default
@Where(clause = "deleted_at IS NULL")

// Soft delete method
public void softDelete() {
    this.deletedAt = Instant.now();
    this.isActive = false;
}
```

**Benefits:**
- Data preservation for audit
- Reversible deletions
- Historical data retention
- Referential integrity maintained

---

## Frontend Architecture

### Component Structure

```
watcher_client/src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Modal, etc.)
│   ├── forms/           # Form components
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   └── dashboard/       # Dashboard-specific components
├── pages/               # Page components (routes)
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useTickets.ts
│   └── useUsers.ts
├── store/               # Zustand stores
│   ├── authStore.ts
│   └── uiStore.ts
├── lib/                 # Utilities
│   ├── api.ts          # Axios instance
│   └── utils.ts
├── styles/              # SCSS 7-1 architecture
└── types/               # TypeScript types
```

### State Management

**TanStack Query (React Query):**
- Server state management
- Automatic caching
- Background refetching
- Optimistic updates

**Zustand:**
- Client state management
- Authentication state
- UI state (modals, theme)

### Data Flow

```
Component → Custom Hook → TanStack Query → Axios → API
                ↓
           Zustand Store (auth, UI)
```

---

## Design Patterns

### 1. DTO Pattern
Separate internal entities from API contracts:
```
Entity (Database) ↔ DTO (API) ↔ Client
```

### 2. Builder Pattern
Fluent object construction:
```java
AppUser user = AppUser.builder()
    .username("johndoe")
    .roleLevel(1)
    .build();
```

### 3. Repository Pattern
Abstract data access:
```java
interface AppUserRepository extends JpaRepository<AppUser, Integer>
```

### 4. Service Layer Pattern
Encapsulate business logic:
```java
@Service
@Transactional
public class UserService { ... }
```

### 5. Dependency Injection
Constructor injection with Lombok:
```java
@RequiredArgsConstructor
public class AppUserController {
    private final UserService userService;
}
```

---

## Performance Optimizations

### Backend
1. **JPA Batch Processing**
   ```properties
   spring.jpa.properties.hibernate.jdbc.batch_size=20
   spring.jpa.properties.hibernate.order_inserts=true
   ```

2. **Query Optimization**
   - Fetch type optimization (LAZY vs EAGER)
   - N+1 query prevention with JOIN FETCH
   - Pagination for large datasets

3. **Connection Pooling**
   - HikariCP (Spring Boot default)

### Frontend
1. **Code Splitting**
   - Route-based splitting
   - Dynamic imports

2. **React Query Caching**
   - Stale-while-revalidate
   - Background refetching

3. **Virtualization**
   - For large lists

---

## Scalability Considerations

### Current Architecture
- **Single server deployment**
- **Session-less (JWT)**
- **Stateless API**

### Future Enhancements
1. **Horizontal Scaling**
   - Load balancer
   - Multiple backend instances
   - Redis for session sharing

2. **Database Optimization**
   - Read replicas
   - Connection pooling
   - Query optimization

3. **Caching Layer**
   - Redis for frequently accessed data
   - CDN for static assets

4. **Microservices**
   - Split by domain (Auth, Tickets, Users)
   - API Gateway
   - Service mesh

---

## Monitoring & Observability

### Recommended Tools
- **Spring Boot Actuator** - Health checks, metrics
- **Prometheus** - Metrics collection
- **Grafana** - Visualization
- **ELK Stack** - Logging
- **Sentry** - Error tracking

---

## Testing Strategy

### Backend
- **Unit Tests** - Service layer with JUnit 5 + Mockito
- **Integration Tests** - Repository layer with @DataJpaTest
- **API Tests** - Controller layer with MockMvc

### Frontend
- **Unit Tests** - Components with Jest + React Testing Library
- **Integration Tests** - User flows with Cypress
- **E2E Tests** - Full application flows

---

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│               Load Balancer                 │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌───────▼────────┐
│  Backend (1)   │  │  Backend (2)   │
│  Spring Boot   │  │  Spring Boot   │
│  Port 8081     │  │  Port 8082     │
└───────┬────────┘  └───────┬────────┘
        │                   │
        └─────────┬─────────┘
                  │
          ┌───────▼────────┐
          │  MySQL DB      │
          │  Port 3306     │
          └────────────────┘
```

### Environment Variables
```bash
# Database
MYSQL_USERNAME=root
MYSQL_PASSWORD=***
MYSQL_HOST=localhost
MYSQL_PORT=3306

# JWT
JWT_SECRET=***
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Server
SERVER_PORT=8081
```

---

## Security Best Practices

1. **Password Security**
   - BCrypt hashing (cost factor 10)
   - Strong password validation
   - No password in logs/responses

2. **JWT Security**
   - Short-lived access tokens (24h)
   - Refresh token rotation
   - Secure token storage

3. **Input Validation**
   - Jakarta Validation
   - SQL injection prevention (JPA)
   - XSS prevention (sanitization)

4. **CORS**
   - Whitelist allowed origins
   - Credential support

5. **HTTPS**
   - Enforce in production
   - Secure cookies

---

This architecture provides a solid foundation for a scalable, maintainable, and secure application.
