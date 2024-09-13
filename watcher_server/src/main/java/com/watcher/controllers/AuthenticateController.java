package com.watcher.controllers;

import com.watcher.dto.AuthenticateDto;
import com.watcher.dto.UserDto;
import com.watcher.services.AuthenticateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<AuthenticateDto> login(@RequestParam String username, @RequestParam String password) {
        AuthenticateDto authenticateDto = authenticateService.loginUser(username, password);
        return ResponseEntity.ok(authenticateDto);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        authenticateService.logoutUser();
        return ResponseEntity.ok("User logged out successfully!");
    }

    @PostMapping("/register")
    public ResponseEntity<AuthenticateDto> register(@RequestParam String username, @RequestParam String password) {
        AuthenticateDto authenticateDto = authenticateService.registerUser(username, password);
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticateDto);
    }
}
