package com.watcher.controllers;

import com.watcher.dto.AppUserDto;
import com.watcher.models.AppUser;
import com.watcher.models.RoleEnum;
import com.watcher.models.WatcherUserDetails;
import com.watcher.services.AppUserService;
import com.watcher.services.WatcherUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/watcher/manage/users")
public class AppUserController {
    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    private AppUser getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication.getPrincipal();

        if (principal instanceof WatcherUserDetails) {
            return ((WatcherUserDetails) principal).getAppUser();
        } else {
            String principalClassName = principal != null ? principal.getClass().getName() : "null";
            throw new IllegalStateException("Principal is not an instance of WatcherUserDetails. Principal type: " + principalClassName);
        }
    }

    private boolean isSystemAdminOrDirector(AppUser user) {
        return user.getRoleLevel().equals(RoleEnum.SYSTEM_ADMIN.getId()) ||
                user.getRoleLevel().equals(RoleEnum.DIRECTOR.getId());
    }

    @GetMapping
    public ResponseEntity<List<AppUserDto>> getAllUsers() {
        List<AppUserDto> users = appUserService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AppUserDto> getUserById(@PathVariable Integer id) {
        AppUser loggedInUser = getLoggedInUser();
        Optional<AppUserDto> user = appUserService.getUserById(id);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<String> createUser(@RequestBody AppUserDto userDto) {
         if (appUserService.usernameCheck(userDto.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        AppUserDto createdUser = appUserService.createUser(userDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("User created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<AppUserDto> updateUser(@PathVariable Integer id, @RequestBody AppUserDto userDto) {
        Optional<AppUserDto> updatedUser = appUserService.updateUser(id, userDto);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        appUserService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
