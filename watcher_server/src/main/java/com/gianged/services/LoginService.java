package com.gianged.services;

import com.gianged.dto.LoginDto;
import com.gianged.mappers.UserMapper;
import com.gianged.models.User;
import com.gianged.repositories.LoginRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class LoginService {
    private final LoginRepository loginRepository;
    private final UserMapper userMapper;

    @Autowired
    public LoginService(LoginRepository loginRepository, UserMapper userMapper) {
        this.loginRepository = loginRepository;
        this.userMapper = userMapper;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] hashedPassword = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedPassword) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-512 algorithm not available.");
        }
    }

    public LoginDto authenticateUser(String username, String password) {
        User user = loginRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("User not found"));
        if (hashPassword(password).equals(user.getPassword())) {
            return userMapper.userToLoginDto(user);
        } else {
            throw new RuntimeException("Invalid credentials.");
        }
    }
}
