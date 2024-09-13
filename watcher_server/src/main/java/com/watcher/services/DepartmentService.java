package com.watcher.services;

import com.watcher.dto.DepartmentDto;
import com.watcher.mappers.DepartmentMapper;
import com.watcher.models.Department;
import com.watcher.repositories.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Autowired
    public DepartmentService(DepartmentRepository departmentRepository, DepartmentMapper departmentMapper) {
        this.departmentRepository = departmentRepository;
        this.departmentMapper = departmentMapper;
    }

    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toDepartmentDto)
                .collect(Collectors.toList());
    }

    public Optional<DepartmentDto> getDepartmentById(Integer id) {
        return departmentRepository.findById(id)
                .map(departmentMapper::toDepartmentDto);
    }

    public DepartmentDto createDepartment(DepartmentDto departmentDto) {
        Department department = departmentMapper.toEntityFromDepartmentDto(departmentDto);
        Department savedDepartment = departmentRepository.save(department);
        return departmentMapper.toDepartmentDto(savedDepartment);
    }

    public Optional<DepartmentDto> updateDepartment(Integer id, DepartmentDto departmentDto) {
        return departmentRepository.findById(id)
                .map(existDepartment -> {
                    departmentMapper.partialUpdate(departmentDto, existDepartment);
                    Department updatedDepartment = departmentRepository.save(existDepartment);
                    return departmentMapper.toDepartmentDto(updatedDepartment);
                });
    }

    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }
}
