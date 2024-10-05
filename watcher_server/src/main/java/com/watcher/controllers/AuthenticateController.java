package com.watcher.controllers;

import com.watcher.dto.AuthenticateDto;
import com.watcher.services.AuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.Console;

@RestController
@RequestMapping("/watcher/auth")
public class AuthenticateController {
    private final AuthenticateService authenticateService;

    @Autowired
    public AuthenticateController(AuthenticateService authenticateService) {
        this.authenticateService = authenticateService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello, This is Watcher authentication route!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticateDto> login(@RequestBody AuthenticateDto authenticateDto) {
        AuthenticateDto dto = authenticateService.loginUser(authenticateDto.getUsername(), authenticateDto.getPassword());
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authenticateService.logoutUser();
        return ResponseEntity.ok("User logged out successfully!");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticateDto> register(@RequestBody AuthenticateDto authenticateDto) {
        AuthenticateDto dto = authenticateService.registerUser(authenticateDto.getUsername(), authenticateDto.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String input) {
        if (!authenticateService.usernameCheck(input)) {
            return ResponseEntity.ok(true);
        }
        return ResponseEntity.ok(false);
    }
}
