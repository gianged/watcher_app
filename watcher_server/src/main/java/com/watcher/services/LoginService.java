package com.watcher.services;

import com.watcher.dto.LoginDto;
import com.watcher.exception.InvalidCredentialsException;
import com.watcher.exception.UserNotFoundException;
import com.watcher.mappers.UserMapper;
import com.watcher.models.Role;
import com.watcher.models.RoleEnum;
import com.watcher.models.User;
import com.watcher.repositories.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final LoginRepository loginRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public LoginService(LoginRepository loginRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.loginRepository = loginRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Authenticates a user by verifying the provided username and password.
     *
     * @param username The username of the user trying to log in.
     * @param password The password of the user trying to log in.
     * @return A LoginDto object containing user information upon successful authentication.
     * @throws UserNotFoundException If no user is found with the provided username.
     * @throws InvalidCredentialsException If the provided password does not match the stored password for the user.
     */
    public LoginDto loginUser(String username, String password) {
        User user = loginRepository.findByUsername(username).orElseThrow(()
                -> new UserNotFoundException("User not found: " + username));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials " + username);
        }

        return userMapper.userToLoginDto(user);
    }

    /**
     * Logs out the currently authenticated user.
     * <p>
     * This method clears the security context of the current thread, effectively logging out the user.
     * After calling this method, the user will no longer be considered authenticated, and later requests
     * will require re-authentication.
     */
    public void logoutUser() {
        SecurityContextHolder.clearContext();
    }

    /**
     * Registers a new user with the specified username and password.
     *
     * @param username The username of the user to be registered.
     * @param password The password of the user to be registered.
     * @return The LoginDto object representing the registered user.
     * @throws RuntimeException If the provided username is already taken.
     */
    public LoginDto registerUser(String username, String password) {
        if (loginRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already taken.");
        }

        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(passwordEncoder.encode(password));

        Role memberRole = new Role();
        memberRole.setId(RoleEnum.MEMBER.getId());
        memberRole.setRoleName(RoleEnum.MEMBER.getRoleName());

        newUser.setRole(memberRole);
        User savedUser = loginRepository.save(newUser);

        return userMapper.userToLoginDto(savedUser);
    }
}
