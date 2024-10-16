package com.watcher.services;

import com.watcher.dto.AuthenticateDto;
import com.watcher.exceptions.InvalidCredentialsException;
import com.watcher.exceptions.UserNotFoundException;
import com.watcher.mappers.AppUserMapper;
import com.watcher.models.AppUser;
import com.watcher.models.RoleEnum;
import com.watcher.repositories.AuthenticateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class AuthenticateService {
    private final AuthenticateRepository authenticateRepository;
    private final AppUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticateService(AuthenticateRepository authenticateRepository, AppUserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.authenticateRepository = authenticateRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthenticateDto loginUser(@RequestParam String username, @RequestParam String password) {
        AppUser user = authenticateRepository.findByUsernameAndIsActiveTrue(username).orElseThrow(()
                -> new UserNotFoundException("User not found: " + username));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials " + username);
        }

        RoleEnum role = Arrays.stream(RoleEnum.values())
                .filter(a -> a.getId() == user.getRoleLevel())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Role not found for level: " + user.getRoleLevel()));

        String auth = username + ":" + password;
        String token = "Basic " + java.util.Base64.getEncoder().encodeToString(auth.getBytes());
        AuthenticateDto dto = new AuthenticateDto(
                user.getId(),
                user.getProfilePicture(),
                user.getUsername(),
                user.getPassword(),
                user.getDepartment() != null ? user.getDepartment().getId() : null,
                user.getRoleLevel(),
                user.getIsActive(),
                token
        );

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                username, password, List.of((new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        return dto;
    }

    public void logoutUser() {
        SecurityContextHolder.clearContext();
    }

    public AuthenticateDto registerUser(@RequestParam String username, @RequestParam String password) {
        if (authenticateRepository.findByUsernameAndIsActiveTrue(username).isPresent()) {
            throw new RuntimeException("Username already taken.");
        }

        AppUser newUser = new AppUser();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRoleLevel(RoleEnum.USER.getId());
        newUser.setIsActive(true);

        AppUser savedUser = authenticateRepository.save(newUser);

        return userMapper.toAuthenticateDto(savedUser);
    }

    public AuthenticateDto updateUser(String userId, String newPassword, MultipartFile newProfilePicture) {
        AppUser user = authenticateRepository.findById(Integer.parseInt(userId)).orElseThrow(()
                -> new UserNotFoundException("User not found with Id: " + userId));

        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }
        if (newProfilePicture != null && !newProfilePicture.isEmpty()) {
            try {
                user.setProfilePicture(newProfilePicture.getBytes());
            } catch (IOException e) {
                throw new RuntimeException("Failed to save profile picture", e);
            }
        }

        AppUser updatedUser = authenticateRepository.save(user);
        return userMapper.toAuthenticateDto(updatedUser);
    }

    public boolean usernameCheck(@RequestParam String input) {
        if (!input.isBlank() || !input.isEmpty()) {
            return authenticateRepository.findByUsernameAndIsActiveTrue(input).isPresent();
        }
        return true;
    }
}