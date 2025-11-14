package com.watcher.controllers;

import com.watcher.dto.request.LoginRequest;
import com.watcher.dto.request.RefreshTokenRequest;
import com.watcher.dto.request.RegisterRequest;
import com.watcher.dto.response.ApiResponse;
import com.watcher.dto.response.AuthResponse;
import com.watcher.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/watcher/auth")
@RequiredArgsConstructor
public class AuthenticateController {

    private final AuthService authService;

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> test() {
        return ResponseEntity.ok(
                ApiResponse.success("Hello, This is Watcher authentication route!")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Login successful")
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration attempt for user: {}", request.getUsername());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(response, "Registration successful")
        );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        log.info("Token refresh attempt");
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Token refreshed successfully")
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        log.info("Logout attempt");
        authService.logout();
        return ResponseEntity.ok(
                ApiResponse.success(null, "Logout successful")
        );
    }

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Boolean>> checkUsername(@RequestParam String username) {
        boolean available = authService.checkUsernameAvailability(username);
        return ResponseEntity.ok(
                ApiResponse.success(available, available ? "Username is available" : "Username is taken")
        );
    }
}
