package com.watcher.services;

import com.watcher.dto.AuthenticateDto;
import com.watcher.exceptions.InvalidCredentialsException;
import com.watcher.exceptions.UserNotFoundException;
import com.watcher.mappers.UserMapper;
import com.watcher.models.RoleEnum;
import com.watcher.models.User;
import com.watcher.repositories.AuthenticateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Arrays;
import java.util.Base64;
import java.util.List;

@Service
public class AuthenticateService {
    private final AuthenticateRepository authenticateRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthenticateService(AuthenticateRepository authenticateRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.authenticateRepository = authenticateRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthenticateDto loginUser(@RequestParam String username, @RequestParam String password) {
        User user = authenticateRepository.findByUsername(username).orElseThrow(()
                -> new UserNotFoundException("User not found: " + username));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials " + username);
        }

        if (user.getProfilePicture() != null) {
            String url = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(user.getProfilePicture());
            user.setProfilePictureBase64(url);
        }

        RoleEnum role = Arrays.stream(RoleEnum.values())
                .filter(a -> a.getId() == user.getRoleLevel())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Role not found for level: " + user.getRoleLevel()));

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                username, password, List.of((new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))));
        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

        return userMapper.toAuthenticateDto(user);
    }

    public void logoutUser() {
        SecurityContextHolder.clearContext();
    }

    public AuthenticateDto registerUser(@RequestParam String username, @RequestParam String password) {
        if (authenticateRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken.");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRoleLevel(RoleEnum.USER.getId());

        User savedUser = authenticateRepository.save(newUser);

        return userMapper.toAuthenticateDto(savedUser);
    }
}
