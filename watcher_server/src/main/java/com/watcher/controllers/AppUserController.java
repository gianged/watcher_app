package com.watcher.controllers;

import com.watcher.dto.request.CreateUserRequest;
import com.watcher.dto.request.UpdateUserRequest;
import com.watcher.dto.response.ApiResponse;
import com.watcher.dto.response.PageResponse;
import com.watcher.dto.response.UserResponse;
import com.watcher.models.AppUser;
import com.watcher.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/watcher/manage/users")
@RequiredArgsConstructor
public class AppUserController {

    private final UserService userService;

    private AppUser getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AppUser) {
            return (AppUser) authentication.getPrincipal();
        }
        throw new IllegalStateException("No authenticated user found");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("Fetching all users with filter: {}", username);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        List<UserResponse> users = userService.getAllUsers(username, sort);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @GetMapping("/paged")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<PageResponse<UserResponse>> getPagedUsers(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        log.info("Fetching paged users - page: {}, size: {}, filter: {}", page, size, username);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<UserResponse> users = userService.getPagedUsers(username, pageable);
        return ResponseEntity.ok(PageResponse.of(users));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #id == principal.id")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer id) {
        log.info("Fetching user by id: {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        AppUser currentUser = getLoggedInUser();
        log.info("Fetching current user: {}", currentUser.getUsername());
        UserResponse user = userService.getUserById(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        log.info("Creating new user: {}", request.getUsername());
        UserResponse createdUser = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(createdUser, "User created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == principal.id")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateUserRequest request) {
        log.info("Updating user: {}", id);
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.success(updatedUser, "User updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        log.info("Soft deleting user: {}", id);
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deleted successfully"));
    }

    @PostMapping("/{id}/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> restoreUser(@PathVariable Integer id) {
        log.info("Restoring user: {}", id);
        UserResponse restoredUser = userService.restoreUser(id);
        return ResponseEntity.ok(ApiResponse.success(restoredUser, "User restored successfully"));
    }
}
