package com.watcher.services;

import com.watcher.dto.AppUserDto;
import com.watcher.mappers.AppUserMapper;
import com.watcher.models.AppUser;
import com.watcher.models.Department;
import com.watcher.repositories.AppUserRepository;
import com.watcher.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public List<AppUserDto> getAllUsers(Sort sort) {
        return appUserRepository.findAll(sort).stream()
                .map(userMapper::toAppUserDto)
                .collect(Collectors.toList());
    }

    public Page<AppUserDto> getAllUsers(Pageable pageable) {
        return appUserRepository.findAll(pageable).map(userMapper::toAppUserDto);
    }

    public List<AppUserDto> searchUsersByUsername(String username, Sort sort) {
        return appUserRepository.findAllByUsernameContainingIgnoreCase(username, sort).stream()
                .map(userMapper::toAppUserDto)
                .collect(Collectors.toList());
    }

    public Page<AppUserDto> searchPagedUsersByUsername(String username, Pageable pageable) {
        return appUserRepository.findAllByUsernameContainingIgnoreCase(username, pageable).map(userMapper::toAppUserDto);
    }

    public Optional<AppUserDto> getUserById(Integer id) {
        return appUserRepository.findById(id)
                .map(userMapper::toAppUserDto);
    }

    public AppUserDto createUser(AppUserDto userDto) {
        AppUser appUser = userMapper.toEntityFromUserDto(userDto);
        if (userDto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(userDto.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found for id: " + userDto.getDepartmentId()));
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
                    if (userDto.getPassword() != null && !userDto.getPassword().isEmpty()
                            && !userDto.getPassword().equals(existingUser.getPassword())) {
                        existingUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
                    }

                    if (userDto.getDepartmentId() != null) {
                        Department newDepartment = departmentRepository.findById(userDto.getDepartmentId())
                                .orElseThrow(() -> new RuntimeException("Department not found for id: " + userDto.getDepartmentId()));
                        existingUser.setDepartment(newDepartment);
                    } else {
                        existingUser.setDepartment(null);
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

    public List<AppUserDto> getUsersByDepartment(Integer departmentId) {
        return appUserRepository.findByDepartment_Id(departmentId).stream()
                .map(userMapper::toAppUserDto)
                .collect(Collectors.toList());
    }
}
