# 🛠️ Development Guide

Complete development guide for contributing to the Watcher application.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment](#development-environment)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Deployment](#deployment)

---

## Getting Started

### Prerequisites

**Backend:**
- Java 23 or higher
- Maven 3.6+
- MySQL 8.0+
- Git

**Frontend:**
- Node.js 18+
- npm 9+ or yarn
- Git

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd watcher_app
   ```

2. **Backend Setup**
   ```bash
   cd watcher_server

   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE watcher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   EXIT;

   # Set environment variables
   export MYSQL_USERNAME=root
   export MYSQL_PASSWORD=your_password
   export JWT_SECRET=your-256-bit-secret-key

   # Install dependencies and run
   mvn clean install
   mvn spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd ../watcher_client

   # Install dependencies
   npm install

   # Start development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000 or http://localhost:5173
   - Backend API: http://localhost:8081
   - Swagger UI: http://localhost:8081/swagger-ui.html

---

## Development Environment

### Recommended IDEs

**Backend:**
- IntelliJ IDEA (recommended)
  - Install Lombok plugin
  - Enable annotation processing
- Eclipse with Spring Tools
- VS Code with Java extensions

**Frontend:**
- VS Code (recommended)
  - Extensions: ESLint, Prettier, TypeScript
- WebStorm

### IDE Configuration

**IntelliJ IDEA:**
```
File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
☑ Enable annotation processing

File → Settings → Editor → Code Style → Java
Import code style from: spring-boot-code-style.xml
```

**VS Code:**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### Environment Variables

Create a `.env` file or export these:

```bash
# Backend
export MYSQL_USERNAME=root
export MYSQL_PASSWORD=your_password
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export JWT_SECRET=your-secret-key-minimum-256-bits
export JWT_EXPIRATION=86400000        # 24 hours
export JWT_REFRESH_EXPIRATION=604800000  # 7 days
export SERVER_PORT=8081

# Frontend (create watcher_client/.env)
VITE_API_URL=http://localhost:8081
```

---

## Project Structure

### Backend Structure

```
watcher_server/
├── src/main/java/com/watcher/
│   ├── server/
│   │   └── WatcherServerApplication.java  # Main application
│   ├── config/                             # Configuration classes
│   │   ├── JpaAuditingConfig.java
│   │   └── SecurityConfig.java
│   ├── controllers/                        # REST endpoints
│   │   ├── AuthenticateController.java
│   │   ├── AppUserController.java
│   │   ├── TicketController.java
│   │   ├── DepartmentController.java
│   │   └── AnnounceController.java
│   ├── dto/                                # Data Transfer Objects
│   │   ├── request/
│   │   │   ├── LoginRequest.java
│   │   │   ├── CreateUserRequest.java
│   │   │   └── ...
│   │   └── response/
│   │       ├── ApiResponse.java
│   │       ├── AuthResponse.java
│   │       └── ...
│   ├── models/                             # JPA Entities
│   │   ├── AppUser.java
│   │   ├── Department.java
│   │   ├── Ticket.java
│   │   ├── Announce.java
│   │   └── RefreshToken.java
│   ├── repositories/                       # Data access layer
│   │   ├── AppUserRepository.java
│   │   ├── DepartmentRepository.java
│   │   └── ...
│   ├── services/                           # Business logic
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   └── ...
│   ├── security/                           # Security components
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   └── exceptions/                         # Exception handling
│       ├── GlobalExceptionHandler.java
│       ├── UserNotFoundException.java
│       └── ...
└── src/main/resources/
    └── application.properties              # Configuration

watcher_client/
├── src/
│   ├── components/          # React components
│   │   ├── common/         # Shared UI components
│   │   ├── forms/          # Form components
│   │   ├── layout/         # Layout components
│   │   └── dashboard/      # Dashboard components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── lib/                # Utilities
│   ├── styles/             # SCSS files (7-1 architecture)
│   └── types/              # TypeScript types
├── public/                 # Static assets
└── package.json
```

---

## Coding Standards

### Java/Spring Boot

**Naming Conventions:**
```java
// Classes: PascalCase
public class UserService { }

// Methods: camelCase
public UserResponse getUserById(Integer id) { }

// Constants: UPPER_SNAKE_CASE
private static final int MAX_RETRY_ATTEMPTS = 3;

// Variables: camelCase
private final UserRepository userRepository;
```

**Annotations:**
```java
// Order: Class → Field → Method → Parameter
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    @Transactional
    public UserResponse createUser(@Valid CreateUserRequest request) {
        // Implementation
    }
}
```

**Lombok Usage:**
```java
// Prefer @RequiredArgsConstructor over @Autowired
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;  // final = injected
}

// Use @Data for DTOs
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String username;
}
```

**Exception Handling:**
```java
// Service layer throws business exceptions
public UserResponse getUserById(Integer id) {
    return userRepository.findById(id)
        .map(this::convertToResponse)
        .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
}

// GlobalExceptionHandler catches and formats
@ExceptionHandler(UserNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ResponseEntity<ApiResponse<Void>> handleUserNotFound(UserNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
        .body(ApiResponse.error(ex.getMessage()));
}
```

### TypeScript/React

**Naming Conventions:**
```typescript
// Components: PascalCase
export const UserList: React.FC = () => { }

// Hooks: camelCase with 'use' prefix
export const useAuth = () => { }

// Types/Interfaces: PascalCase
interface User {
  id: number;
  username: string;
}

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:8081';

// Variables: camelCase
const [users, setUsers] = useState<User[]>([]);
```

**Component Structure:**
```typescript
// 1. Imports
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Types
interface Props {
  userId: number;
}

// 3. Component
export const UserProfile: React.FC<Props> = ({ userId }) => {
  // 3a. Hooks
  const [isEditing, setIsEditing] = useState(false);
  const { data, isLoading } = useQuery(['user', userId], () => fetchUser(userId));

  // 3b. Handlers
  const handleEdit = () => setIsEditing(true);

  // 3c. Render
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="user-profile">
      {/* JSX */}
    </div>
  );
};
```

**Custom Hooks:**
```typescript
export const useAuth = () => {
  const { setAuth, logout } = useAuthStore();

  const login = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const response = await api.post('/watcher/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      const { user, token, refreshToken } = data.data;
      setAuth(user, token, refreshToken);
    },
  });

  return { login, logout };
};
```

---

## Testing

### Backend Testing

**Unit Tests (Service Layer):**
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private AppUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        // Given
        Integer userId = 1;
        AppUser user = AppUser.builder()
            .id(userId)
            .username("testuser")
            .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        UserResponse result = userService.getUserById(userId);

        // Then
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getUsername()).isEqualTo("testuser");
        verify(userRepository).findById(userId);
    }

    @Test
    void getUserById_ShouldThrowException_WhenNotExists() {
        // Given
        when(userRepository.findById(anyInt())).thenReturn(Optional.empty());

        // When/Then
        assertThrows(UserNotFoundException.class, () ->
            userService.getUserById(1)
        );
    }
}
```

**Integration Tests (Repository Layer):**
```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class AppUserRepositoryTest {

    @Autowired
    private AppUserRepository userRepository;

    @Test
    void findByUsername_ShouldReturnUser_WhenExists() {
        // Given
        AppUser user = AppUser.builder()
            .username("testuser")
            .password("password")
            .build();
        userRepository.save(user);

        // When
        Optional<AppUser> result = userRepository.findByUsername("testuser");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getUsername()).isEqualTo("testuser");
    }
}
```

**Controller Tests:**
```java
@WebMvcTest(AppUserController.class)
@Import(SecurityConfig.class)
class AppUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @Test
    @WithMockUser(roles = "ADMIN")
    void createUser_ShouldReturnCreated() throws Exception {
        // Given
        CreateUserRequest request = CreateUserRequest.builder()
            .username("newuser")
            .password("Password123")
            .build();

        UserResponse response = UserResponse.builder()
            .id(1)
            .username("newuser")
            .build();

        when(userService.createUser(any())).thenReturn(response);

        // When/Then
        mockMvc.perform(post("/watcher/manage/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.data.username").value("newuser"));
    }
}
```

**Run Tests:**
```bash
# All tests
mvn test

# Specific test class
mvn test -Dtest=UserServiceTest

# With coverage
mvn clean test jacoco:report
```

### Frontend Testing

**Component Tests:**
```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should display user information', () => {
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    };

    render(<UserProfile user={user} />);

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});
```

**Hook Tests:**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.login.mutate({
        username: 'testuser',
        password: 'password'
      });
    });

    await waitFor(() => {
      expect(result.current.login.isSuccess).toBe(true);
    });
  });
});
```

**Run Tests:**
```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Git Workflow

### Branch Strategy

```
main (production)
  ├── develop (integration)
      ├── feature/user-management
      ├── feature/ticket-system
      ├── bugfix/login-error
      └── hotfix/security-patch
```

### Branch Naming

- **Features:** `feature/short-description`
- **Bug Fixes:** `bugfix/issue-description`
- **Hotfixes:** `hotfix/critical-fix`
- **Releases:** `release/v1.0.0`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build/tooling changes

**Examples:**
```bash
feat(auth): implement JWT refresh token rotation

- Add refresh token entity and repository
- Implement token rotation in AuthService
- Update AuthController with refresh endpoint

Closes #123

fix(tickets): resolve pagination offset error

The pagination was using 1-based indexing instead of 0-based,
causing the first page to be skipped.

refactor(users): simplify DTO conversion logic

Replace manual mapping with builder pattern for cleaner code.
```

### Pull Request Process

1. **Create feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   ```

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex logic
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

---

## Deployment

### Production Build

**Backend:**
```bash
mvn clean package -DskipTests
java -jar target/server-0.0.1-SNAPSHOT.jar
```

**Frontend:**
```bash
npm run build
# Serve dist/ folder with nginx or similar
```

### Environment Configuration

**Production application.properties:**
```properties
spring.profiles.active=prod
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
logging.level.root=WARN
logging.level.com.watcher=INFO
```

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM eclipse-temurin:23-jre
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_DATABASE: watcher_db
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./watcher_server
    ports:
      - "8081:8081"
    environment:
      MYSQL_USERNAME: root
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_HOST: mysql
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mysql

  frontend:
    build: ./watcher_client
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

---

## Troubleshooting

### Common Issues

**Backend won't start:**
```bash
# Check MySQL connection
mysql -u root -p -e "SELECT 1;"

# Verify Java version
java --version

# Check logs
tail -f logs/spring-boot-application.log
```

**Frontend build fails:**
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version
```

**Tests failing:**
```bash
# Backend
mvn clean test -X  # Debug mode

# Frontend
npm test -- --verbose
```

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Ensure all tests pass
6. Submit a pull request

---

Happy coding! 🚀
