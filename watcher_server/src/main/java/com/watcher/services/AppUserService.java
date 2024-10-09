package com.watcher.services;

import com.watcher.dto.AppUserDto;
import com.watcher.mappers.AppUserMapper;
import com.watcher.models.AppUser;
import com.watcher.models.Department;
import com.watcher.repositories.AppUserRepository;
import com.watcher.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final AppUserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final DepartmentRepository departmentRepository;

    @Autowired
    public AppUserService(AppUserRepository appUserRepository, AppUserMapper userMapper, PasswordEncoder passwordEncoder, DepartmentRepository departmentRepository) {
        this.appUserRepository = appUserRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.departmentRepository = departmentRepository;
    }

    public List<AppUserDto> getAllUsers() {
        return appUserRepository.findAll().stream()
                .map(userMapper::toAppUserDto)
                .collect(Collectors.toList());
    }

    public Optional<AppUserDto> getUserById(Integer id) {
        return appUserRepository.findById(id)
                .map(userMapper::toAppUserDto);
    }

    public AppUserDto createUser(AppUserDto userDto) {
        AppUser appUser = userMapper.toEntityFromUserDto(userDto);
        if (userDto.departmentId() != null) {
            Department department = departmentRepository.findById(userDto.departmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found for id: " + userDto.departmentId()));
            appUser.setDepartment(department);
        } else {
            appUser.setDepartment(null);
        }
        appUser.setPassword(passwordEncoder.encode(appUser.getPassword()));
        AppUser savedUser = appUserRepository.save(appUser);
        return userMapper.toAppUserDto(savedUser);
    }

    public Optional<AppUserDto> updateUser(Integer id, AppUserDto userDto) {
        return appUserRepository.findById(id)
                .map(existingUser -> {
                    if (userDto.password() != null && !userDto.password().isEmpty()
                            && !userDto.password().equals(existingUser.getPassword())) {
                        existingUser.setPassword(passwordEncoder.encode(existingUser.getPassword()));
                    }
                    userMapper.partialUpdateAppUserFromAppUserDto(userDto, existingUser);
                    AppUser updatedUser = appUserRepository.save(existingUser);
                    return userMapper.toAppUserDto(updatedUser);
                });
    }

    public void deleteUser(Integer id) {
        appUserRepository.deleteById(id);
    }

    public boolean usernameCheck(String input) {
        return appUserRepository.findByUsername(input).isPresent();
    }
}
