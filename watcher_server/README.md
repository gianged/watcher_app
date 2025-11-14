# 🚀 Watcher Server - Spring Boot Backend

Modern Spring Boot REST API for the Watcher ticketing and management system.

## 📋 Features

- ✅ **Spring Boot 3.3.4** - Latest stable release
- ✅ **Java 23** - Modern Java features
- ✅ **Spring Security** - JWT-based authentication with refresh tokens
- ✅ **Spring Data JPA** - Database access with Hibernate
- ✅ **MySQL 8** - Relational database
- ✅ **Lombok** - Reduced boilerplate code
- ✅ **MapStruct** - Type-safe bean mapping
- ✅ **Swagger/OpenAPI** - Auto-generated API documentation
- ✅ **Jakarta Validation** - Request validation
- ✅ **Pagination & Filtering** - Built-in support

## 🏗️ Architecture

```
src/main/java/com/watcher/
├── server/
│   └── WatcherServerApplication.java  # Main application class
├── config/                              # Configuration classes
│   ├── SecurityConfig.java
│   └── SwaggerConfig.java
├── controllers/                         # REST endpoints
│   ├── AuthenticateController.java
│   ├── AppUserController.java
│   ├── DepartmentController.java
│   ├── TicketController.java
│   ├── AnnounceController.java
│   └── EnumController.java
├── services/                            # Business logic
│   ├── AuthenticateService.java
│   ├── AppUserService.java
│   └── ...
├── repositories/                        # Data access layer
│   ├── AppUserRepository.java
│   ├── DepartmentRepository.java
│   └── ...
├── models/                              # JPA entities
│   ├── AppUser.java
│   ├── Department.java
│   ├── Ticket.java
│   └── ...
├── dto/                                 # Data Transfer Objects
│   ├── LoginRequest.java
│   ├── UserDto.java
│   └── ...
├── mappers/                             # MapStruct mappers
│   ├── UserMapper.java
│   └── ...
└── exceptions/                          # Custom exceptions
    ├── GlobalExceptionHandler.java
    └── ...
```

## 🚀 Quick Start

### Prerequisites

- Java 23 or higher
- MySQL 8.0 or higher
- Maven 3.6+

### Installation

1. **Clone the repository**
   ```bash
   cd watcher_server
   ```

2. **Configure MySQL**

   Create a database:
   ```sql
   CREATE DATABASE watcher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Set environment variables (or edit `application.properties`):
   ```bash
   export MYSQL_USERNAME=root
   export MYSQL_PASSWORD=your_password
   export JWT_SECRET=your-secret-key-at-least-256-bits
   ```

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

   The server will start on http://localhost:8081

5. **Access Swagger UI**

   Navigate to: http://localhost:8081/swagger-ui.html

## 📚 API Endpoints

### Authentication
- `POST /watcher/auth/login` - User login
- `POST /watcher/auth/register` - User registration
- `POST /watcher/auth/logout` - User logout
- `PUT /watcher/auth/update` - Update user profile
- `GET /watcher/auth/check-username` - Check username availability

### User Management (Admin/Manager)
- `GET /watcher/manage/users` - Get all users
- `GET /watcher/manage/users/paged` - Get paginated users
- `GET /watcher/manage/users/{id}` - Get user by ID
- `POST /watcher/manage/users` - Create user
- `PUT /watcher/manage/users/{id}` - Update user
- `DELETE /watcher/manage/users/{id}` - Delete user

### Department Management
- `GET /watcher/manage/departments` - Get all departments
- `GET /watcher/manage/departments/paged` - Get paginated
- `GET /watcher/manage/departments/{id}` - Get department
- `POST /watcher/manage/departments` - Create department
- `PUT /watcher/manage/departments/{id}` - Update department
- `DELETE /watcher/manage/departments/{id}` - Delete department

### Ticket Management
- `GET /watcher/manage/tickets` - Get all tickets
- `GET /watcher/manage/tickets/paged` - Get paginated tickets
- `GET /watcher/manage/tickets/{id}` - Get ticket details
- `POST /watcher/manage/tickets` - Create ticket
- `PUT /watcher/manage/tickets/{id}` - Update ticket
- `DELETE /watcher/manage/tickets/{id}` - Delete ticket

### Announcement Management
- `GET /watcher/manage/announces` - Get all announcements
- `GET /watcher/manage/announces/paged` - Get paginated
- `GET /watcher/manage/announces/{id}` - Get announcement
- `POST /watcher/manage/announces` - Create announcement
- `PUT /watcher/manage/announces/{id}` - Update announcement
- `DELETE /watcher/manage/announces/{id}` - Delete announcement

### Enums
- `GET /watcher/enums/load` - Get all enums

## 🔒 Security

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login** with credentials to receive a JWT token
2. **Include** the token in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```
3. **Role-based** access control:
   - `ADMIN` - Full access
   - `MANAGER` - Manage users and departments
   - `USER` - Limited access

## 🛠️ Configuration

### application.properties

Key configurations:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/watcher_db
spring.datasource.username=${MYSQL_USERNAME}
spring.datasource.password=${MYSQL_PASSWORD}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
jwt.refresh-expiration=604800000

# Pagination
spring.data.web.pageable.default-page-size=10
spring.data.web.pageable.max-page-size=100
```

## 📦 Dependencies

- **Spring Boot Starter Web** - REST API
- **Spring Boot Starter Data JPA** - Database access
- **Spring Boot Starter Security** - Security framework
- **Spring Boot Starter Validation** - Input validation
- **MySQL Connector** - MySQL driver
- **JJWT** - JWT implementation
- **Lombok** - Code generation
- **MapStruct** - Bean mapping
- **SpringDoc OpenAPI** - API documentation

## 🔧 Development

### Build
```bash
mvn clean package
```

### Test
```bash
mvn test
```

### Run with profile
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## 📝 Database Schema

### Main Entities

- **app_users** - System users
- **departments** - Organizational departments
- **tickets** - Support tickets
- **announces** - Announcements

### Relationships

- Users belong to Departments (Many-to-One)
- Tickets created by Users (Many-to-One)
- Tickets assigned to Departments (Many-to-One)

## 🎯 Best Practices

✅ **RESTful API design**
✅ **Layered architecture** (Controller → Service → Repository)
✅ **DTO pattern** for data transfer
✅ **Global exception handling**
✅ **Input validation**
✅ **Pagination support**
✅ **API documentation**
✅ **Secure password hashing**
✅ **JWT authentication**

## 📊 Monitoring

### Actuator Endpoints

Add Spring Boot Actuator for monitoring:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

Access: http://localhost:8081/actuator

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in application.properties
   server.port=8082
   ```

2. **Database connection failed**
   - Check MySQL is running
   - Verify credentials in environment variables
   - Ensure database exists

3. **JWT errors**
   - Ensure JWT_SECRET is set
   - Check token expiration

## 📖 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security](https://spring.io/projects/spring-security)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [SpringDoc OpenAPI](https://springdoc.org/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Spring Boot**
