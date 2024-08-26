package com.gianged.services;

import com.gianged.dto.LoginDto;
import com.gianged.mappers.UserMapper;
import com.gianged.models.Role;
import com.gianged.models.RoleEnum;
import com.gianged.models.User;
import com.gianged.repositories.LoginRepository;
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

    public LoginDto loginUser(String username, String password) {
        User user = loginRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(password, user.getPassword())) {
            return userMapper.userToLoginDto(user);
        } else {
            throw new RuntimeException("Invalid credentials.");
        }
    }

    public void logoutUser() {
        SecurityContextHolder.clearContext();
    }

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
