package com.gianged.controllers;

import com.gianged.dto.LoginDto;
import com.gianged.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/watcher/auth")
public class LoginController {
    private final LoginService loginService;

    @Autowired
    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Hello, This is Watcher authentication route!");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginDto> login(@RequestParam String username, @RequestParam String password) {
        try {
            LoginDto loginDto = loginService.loginUser(username, password);
            return ResponseEntity.ok(loginDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        loginService.logoutUser();
        return ResponseEntity.ok("User logged out successfully!");
    }

    @PostMapping("/register")
    public ResponseEntity<LoginDto> register(@RequestParam String username, @RequestParam String password) {
        try {
            LoginDto loginDto = loginService.registerUser(username, password);
            return ResponseEntity.status(HttpStatus.CREATED).body(loginDto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
