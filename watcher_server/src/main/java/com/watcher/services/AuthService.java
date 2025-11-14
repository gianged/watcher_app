package com.watcher.services;

import com.watcher.dto.request.LoginRequest;
import com.watcher.dto.request.RefreshTokenRequest;
import com.watcher.dto.request.RegisterRequest;
import com.watcher.dto.response.AuthResponse;
import com.watcher.exceptions.InvalidCredentialsException;
import com.watcher.exceptions.UserNotFoundException;
import com.watcher.models.AppUser;
import com.watcher.models.Department;
import com.watcher.models.RefreshToken;
import com.watcher.repositories.AppUserRepository;
import com.watcher.repositories.DepartmentRepository;
import com.watcher.repositories.RefreshTokenRepository;
import com.watcher.security.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            AppUser user = (AppUser) authentication.getPrincipal();

            // Generate tokens
            String accessToken = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

            // Save refresh token to database
            saveRefreshToken(user, refreshToken);

            return buildAuthResponse(user, accessToken, refreshToken);

        } catch (BadCredentialsException e) {
            log.error("Invalid credentials for user: {}", request.getUsername());
            throw new InvalidCredentialsException("Invalid username or password");
        }
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Build user
        AppUser.AppUserBuilder userBuilder = AppUser.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .roleLevel(request.getRoleLevel() != null ? request.getRoleLevel() : 0)
                .isActive(true);

        // Set department if provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Department not found"));
            userBuilder.department(department);
        }

        // Save user
        AppUser user = userRepository.save(userBuilder.build());
        log.info("User registered successfully: {}", user.getUsername());

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

        // Save refresh token to database
        saveRefreshToken(user, refreshToken);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshTokenValue = request.getRefreshToken();

        try {
            // Validate refresh token
            String username = jwtUtil.extractUsername(refreshTokenValue);

            // Find token in database
            RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

            // Check if token is expired or revoked
            if (refreshToken.isExpired() || refreshToken.getIsRevoked()) {
                refreshTokenRepository.delete(refreshToken);
                throw new IllegalArgumentException("Refresh token expired or revoked");
            }

            // Get user
            AppUser user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));

            // Generate new access token
            String newAccessToken = jwtUtil.generateToken(user);

            // Optionally generate new refresh token (rotate refresh tokens)
            String newRefreshToken = jwtUtil.generateRefreshToken(user.getUsername());

            // Revoke old refresh token
            refreshToken.setIsRevoked(true);
            refreshTokenRepository.save(refreshToken);

            // Save new refresh token
            saveRefreshToken(user, newRefreshToken);

            return buildAuthResponse(user, newAccessToken, newRefreshToken);

        } catch (ExpiredJwtException e) {
            log.error("Refresh token expired");
            throw new IllegalArgumentException("Refresh token expired");
        } catch (MalformedJwtException e) {
            log.error("Invalid refresh token format");
            throw new IllegalArgumentException("Invalid refresh token format");
        }
    }

    @Transactional
    public void logout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof AppUser user) {
            // Revoke all refresh tokens for this user
            refreshTokenRepository.deleteByUser(user);
            log.info("User logged out successfully: {}", user.getUsername());
        }
    }

    public boolean checkUsernameAvailability(String username) {
        return userRepository.findByUsername(username).isEmpty();
    }

    private void saveRefreshToken(AppUser user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(Instant.now().plusMillis(refreshExpiration))
                .isRevoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse buildAuthResponse(AppUser user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .token(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000) // Convert to seconds
                .roleLevel(user.getRoleLevel())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null)
                .issuedAt(Instant.now())
                .build();
    }
}
