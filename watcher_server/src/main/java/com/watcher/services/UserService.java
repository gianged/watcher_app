package com.watcher.services;

import com.watcher.dto.request.CreateUserRequest;
import com.watcher.dto.request.UpdateUserRequest;
import com.watcher.dto.response.UserResponse;
import com.watcher.exceptions.UserNotFoundException;
import com.watcher.models.AppUser;
import com.watcher.models.Department;
import com.watcher.repositories.AppUserRepository;
import com.watcher.repositories.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final AppUserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers(String username, Sort sort) {
        List<AppUser> users;
        if (username != null && !username.isEmpty()) {
            users = userRepository.findAllByUsernameContainingIgnoreCase(username, sort);
        } else {
            users = userRepository.findAll(sort);
        }
        return users.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getPagedUsers(String username, Pageable pageable) {
        Page<AppUser> users;
        if (username != null && !username.isEmpty()) {
            users = userRepository.findAllByUsernameContainingIgnoreCase(username, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(this::convertToResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Integer id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return convertToResponse(user);
    }

    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Build user
        AppUser.AppUserBuilder userBuilder = AppUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roleLevel(request.getRoleLevel() != null ? request.getRoleLevel() : 0)
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .profilePicture(request.getProfilePicture());

        // Set department if provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
            userBuilder.department(department);
        }

        // Save user
        AppUser user = userRepository.save(userBuilder.build());
        log.info("User created successfully: {}", user.getUsername());

        return convertToResponse(user);
    }

    @Transactional
    public UserResponse updateUser(Integer id, UpdateUserRequest request) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Update fields
        if (request.getUsername() != null) {
            // Check if new username already exists
            userRepository.findByUsername(request.getUsername())
                    .ifPresent(existing -> {
                        if (!existing.getId().equals(id)) {
                            throw new IllegalArgumentException("Username already exists");
                        }
                    });
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
            user.setDepartment(department);
        }

        if (request.getRoleLevel() != null) {
            user.setRoleLevel(request.getRoleLevel());
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        if (request.getProfilePicture() != null) {
            user.setProfilePicture(request.getProfilePicture());
        }

        // Save updated user
        AppUser updatedUser = userRepository.save(user);
        log.info("User updated successfully: {}", updatedUser.getUsername());

        return convertToResponse(updatedUser);
    }

    @Transactional
    public void deleteUser(Integer id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        // Soft delete
        user.softDelete();
        userRepository.save(user);
        log.info("User soft deleted: {}", user.getUsername());
    }

    @Transactional
    public UserResponse restoreUser(Integer id) {
        // Need to find user including deleted ones
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (!user.isDeleted()) {
            throw new IllegalStateException("User is not deleted");
        }

        // Restore user
        user.setDeletedAt(null);
        user.setIsActive(true);
        AppUser restoredUser = userRepository.save(user);
        log.info("User restored: {}", restoredUser.getUsername());

        return convertToResponse(restoredUser);
    }

    private UserResponse convertToResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null)
                .roleLevel(user.getRoleLevel())
                .isActive(user.getIsActive())
                .profilePicture(user.getProfilePicture())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .createdBy(user.getCreatedBy())
                .updatedBy(user.getUpdatedBy())
                .ticketCount(user.getTickets() != null ? user.getTickets().size() : 0)
                .build();
    }
}
