# 🔐 Authentication Guide

Complete guide to authentication and authorization in the Watcher application.

## Overview

The Watcher application uses **JWT (JSON Web Tokens)** for stateless authentication with refresh token rotation for enhanced security.

---

## Authentication Flow

### 1. User Registration

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│ Client │                  │  API   │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ POST /auth/register       │                            │
    │ {username, password}      │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │                           │ Check username exists      │
    │                           │───────────────────────────>│
    │                           │<───────────────────────────│
    │                           │                            │
    │                           │ Hash password (BCrypt)     │
    │                           │                            │
    │                           │ Save user                  │
    │                           │───────────────────────────>│
    │                           │<───────────────────────────│
    │                           │                            │
    │                           │ Generate JWT tokens        │
    │                           │                            │
    │                           │ Save refresh token         │
    │                           │───────────────────────────>│
    │                           │                            │
    │ {token, refreshToken}     │                            │
    │<──────────────────────────│                            │
```

**Request:**
```json
POST /watcher/auth/register
{
  "username": "johndoe",
  "password": "SecurePass123",
  "departmentId": 1,
  "roleLevel": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "username": "johndoe",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "roleLevel": 0,
    "departmentName": "IT Department",
    "issuedAt": "2025-01-14T10:30:00Z"
  }
}
```

### 2. User Login

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│ Client │                  │  API   │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ POST /auth/login          │                            │
    │ {username, password}      │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │                           │ Find user by username      │
    │                           │───────────────────────────>│
    │                           │<───────────────────────────│
    │                           │                            │
    │                           │ Verify password (BCrypt)   │
    │                           │                            │
    │                           │ Generate JWT tokens        │
    │                           │                            │
    │                           │ Save refresh token         │
    │                           │───────────────────────────>│
    │                           │                            │
    │ {token, refreshToken}     │                            │
    │<──────────────────────────│                            │
```

**Storage (Client):**
```javascript
// Store tokens securely
localStorage.setItem('token', response.data.token);
localStorage.setItem('refreshToken', response.data.refreshToken);

// Or use Zustand persist
useAuthStore.getState().setAuth(user, token, refreshToken);
```

### 3. Authenticated Request

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│ Client │                  │  API   │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ GET /manage/users         │                            │
    │ Authorization: Bearer ... │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │                           │ JwtAuthenticationFilter    │
    │                           │ ├─ Extract token           │
    │                           │ ├─ Validate signature      │
    │                           │ ├─ Check expiration        │
    │                           │ ├─ Extract username        │
    │                           │ └─ Load UserDetails        │
    │                           │                            │
    │                           │ SecurityContext set        │
    │                           │                            │
    │                           │ Check @PreAuthorize        │
    │                           │                            │
    │                           │ Execute business logic     │
    │                           │───────────────────────────>│
    │                           │<───────────────────────────│
    │                           │                            │
    │ Response data             │                            │
    │<──────────────────────────│                            │
```

**Client Code:**
```javascript
// Axios interceptor adds token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Make authenticated request
const response = await api.get('/watcher/manage/users');
```

### 4. Token Refresh

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│ Client │                  │  API   │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ API Request               │                            │
    │ (expired token)           │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │ 401 Unauthorized          │                            │
    │<──────────────────────────│                            │
    │                           │                            │
    │ POST /auth/refresh        │                            │
    │ {refreshToken}            │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │                           │ Validate refresh token     │
    │                           │───────────────────────────>│
    │                           │<───────────────────────────│
    │                           │                            │
    │                           │ Generate new tokens        │
    │                           │                            │
    │                           │ Revoke old refresh token   │
    │                           │───────────────────────────>│
    │                           │                            │
    │                           │ Save new refresh token     │
    │                           │───────────────────────────>│
    │                           │                            │
    │ {token, refreshToken}     │                            │
    │<──────────────────────────│                            │
    │                           │                            │
    │ Retry original request    │                            │
    │──────────────────────────>│                            │
```

**Client Implementation:**
```javascript
// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      try {
        // Get new tokens
        const response = await api.post('/watcher/auth/refresh', {
          refreshToken
        });

        const { token, refreshToken: newRefreshToken } = response.data.data;

        // Update stored tokens
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

### 5. Logout

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│ Client │                  │  API   │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ POST /auth/logout         │                            │
    │ Authorization: Bearer ... │                            │
    │──────────────────────────>│                            │
    │                           │                            │
    │                           │ Extract user from JWT      │
    │                           │                            │
    │                           │ Delete all refresh tokens  │
    │                           │───────────────────────────>│
    │                           │                            │
    │ Success                   │                            │
    │<──────────────────────────│                            │
    │                           │                            │
    │ Clear local tokens        │                            │
    │ Redirect to login         │                            │
```

**Client Code:**
```javascript
const logout = async () => {
  await api.post('/watcher/auth/logout');
  localStorage.clear();
  navigate('/login');
};
```

---

## JWT Structure

### Access Token

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "johndoe",           // Username
  "iat": 1642161000,          // Issued at
  "exp": 1642247400,          // Expires at (24h later)
  "authorities": ["ROLE_USER"]
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

**Lifetime:** 24 hours

### Refresh Token

```
Payload:
{
  "sub": "johndoe",
  "type": "refresh",          // Token type
  "iat": 1642161000,
  "exp": 1642766200           // Expires at (7 days later)
}
```

**Lifetime:** 7 days

**Storage:** Database (refresh_tokens table)

---

## Authorization

### Role Levels

| Role Level | Name    | Description |
|------------|---------|-------------|
| 0          | USER    | Basic user access |
| 1          | ADMIN   | Full system access |
| 2          | MANAGER | Manage users and departments |

### Spring Security Roles

```java
// Mapped from roleLevel
switch (roleLevel) {
    case 1 -> "ROLE_ADMIN";
    case 2 -> "ROLE_MANAGER";
    default -> "ROLE_USER";
}
```

### Method-Level Security

```java
// Only admins can create users
@PostMapping
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ApiResponse<UserResponse>> createUser(...) {
    // ...
}

// Admins, managers, or the user themselves
@GetMapping("/{id}")
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #id == principal.id")
public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer id) {
    // ...
}
```

### Access Control Matrix

| Resource | Endpoint | USER | MANAGER | ADMIN |
|----------|----------|------|---------|-------|
| **Users** |
| View own profile | GET /users/me | ✅ | ✅ | ✅ |
| View all users | GET /users | ❌ | ✅ | ✅ |
| View user by ID | GET /users/{id} | Own only | ✅ | ✅ |
| Create user | POST /users | ❌ | ❌ | ✅ |
| Update user | PUT /users/{id} | Own only | ❌ | ✅ |
| Delete user | DELETE /users/{id} | ❌ | ❌ | ✅ |
| **Tickets** |
| View tickets | GET /tickets | ✅ | ✅ | ✅ |
| Create ticket | POST /tickets | ✅ | ✅ | ✅ |
| Update ticket | PUT /tickets/{id} | Own only | ✅ | ✅ |
| Delete ticket | DELETE /tickets/{id} | ❌ | ✅ | ✅ |
| **Departments** |
| View departments | GET /departments | ✅ | ✅ | ✅ |
| Create department | POST /departments | ❌ | ✅ | ✅ |
| Update department | PUT /departments/{id} | ❌ | ✅ | ✅ |
| Delete department | DELETE /departments/{id} | ❌ | ❌ | ✅ |
| **Announcements** |
| View announcements | GET /announces | ✅ | ✅ | ✅ |
| Create announcement | POST /announces | ❌ | ✅ | ✅ |
| Update announcement | PUT /announces/{id} | ❌ | ✅ | ✅ |
| Delete announcement | DELETE /announces/{id} | ❌ | ❌ | ✅ |

---

## Security Configuration

### SecurityConfig

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/watcher/auth/login", "/watcher/auth/register").permitAll()
                .requestMatchers("/watcher/auth/refresh").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                // All other endpoints require authentication
                .anyRequest().authenticated()
            )
            // Stateless session (JWT-based)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // Add JWT filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
```

### CORS Configuration

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(
        "http://localhost:3000",
        "http://localhost:5173"
    ));
    configuration.setAllowedMethods(Arrays.asList(
        "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
    ));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## Password Security

### Password Hashing

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(); // Cost factor: 10 (default)
}

// Usage in service
String hashedPassword = passwordEncoder.encode(rawPassword);
boolean matches = passwordEncoder.matches(rawPassword, hashedPassword);
```

### Password Validation

```java
@Pattern(
    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
    message = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
)
@Size(min = 8, max = 100)
private String password;
```

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

---

## Security Best Practices

### ✅ Implemented

1. **JWT with short expiration** (24h access, 7d refresh)
2. **Refresh token rotation** (one-time use)
3. **BCrypt password hashing** (cost factor 10)
4. **Password validation** (strength requirements)
5. **CORS whitelist** (specific origins)
6. **Stateless sessions** (no server-side session)
7. **Role-based access control**
8. **Input validation** (Jakarta Validation)
9. **SQL injection prevention** (JPA parameterized queries)

### 🔧 Recommended for Production

1. **HTTPS enforcement**
   ```java
   http.requiresChannel(channel -> channel.anyRequest().requiresSecure());
   ```

2. **Rate limiting**
   ```java
   // Use Spring Cloud Gateway or Bucket4j
   ```

3. **Account lockout** (after failed attempts)
   ```java
   // Implement failed login tracking
   ```

4. **Password history** (prevent reuse)
   ```java
   // Store hashed password history
   ```

5. **Two-factor authentication (2FA)**
   ```java
   // Implement TOTP or SMS-based 2FA
   ```

6. **Audit logging**
   ```java
   // Log all authentication events
   ```

7. **Token blacklisting** (for logout)
   ```java
   // Use Redis to store revoked tokens
   ```

---

## Troubleshooting

### Common Issues

**1. 401 Unauthorized on valid token**
- Check token expiration
- Verify JWT secret matches
- Ensure Authorization header format: `Bearer <token>`

**2. CORS errors**
- Verify origin is in allowed list
- Check credentials flag
- Ensure preflight OPTIONS is handled

**3. Refresh token failed**
- Token may be expired (7 days)
- Token may have been revoked
- Check database connectivity

**4. Password validation fails**
- Ensure meets all requirements
- Check for special character issues
- Verify length constraints

---

## Testing Authentication

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:8081/watcher/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'

# Login
curl -X POST http://localhost:8081/watcher/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"TestPass123"}'

# Authenticated request
curl -X GET http://localhost:8081/watcher/manage/users/me \
  -H "Authorization: Bearer eyJhbGc..."

# Refresh token
curl -X POST http://localhost:8081/watcher/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"eyJhbGc..."}'

# Logout
curl -X POST http://localhost:8081/watcher/auth/logout \
  -H "Authorization: Bearer eyJhbGc..."
```

---

This authentication system provides a secure, scalable foundation with industry-standard practices.
