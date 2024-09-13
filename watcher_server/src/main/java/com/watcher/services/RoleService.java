package com.watcher.services;

import com.watcher.dto.RoleDto;
import com.watcher.mappers.RoleMapper;
import com.watcher.models.Role;
import com.watcher.repositories.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.roleMapper = roleMapper;
    }

    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toRoleDto)
                .toList();
    }

    public Optional<RoleDto> getRoleById(Integer id) {
        return roleRepository.findById(id)
                .map(roleMapper::toRoleDto);
    }

    public RoleDto createRole(RoleDto roleDto) {
        Role role = roleMapper.toEntityFromRoleDto(roleDto);
        Role savedRole = roleRepository.save(role);
        return roleMapper.toRoleDto(savedRole);
    }

    public Optional<RoleDto> updateRole(Integer id, RoleDto roleDto) {
        return roleRepository.findById(id)
                .map(existRole -> {
                    roleMapper.partialUpdate(roleDto, existRole);
                    Role updatedRole = roleRepository.save(existRole);
                    return roleMapper.toRoleDto(updatedRole);
                });
    }

    public void deleteRole(Integer id) {
        roleRepository.deleteById(id);
    }
}
