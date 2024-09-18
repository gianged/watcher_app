package com.watcher.controllers;

import com.watcher.dto.DepartmentDto;
import com.watcher.services.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/watcher/manage/departments")
@PreAuthorize("hasAnyRole('SYSTEM_ADMIN', 'DIRECTOR', 'MANAGER')")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        List<DepartmentDto> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }

    @GetMapping({"/{id}"})
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Integer id) {
        Optional<DepartmentDto> department = departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody DepartmentDto departmentDto) {
        DepartmentDto department = departmentService.createDepartment(departmentDto);
        return ResponseEntity.ok(department);
    }

    @PutMapping({"/{id}"})
    public ResponseEntity<DepartmentDto> updateDepartment(@PathVariable Integer id, @RequestBody DepartmentDto departmentDto) {
        Optional<DepartmentDto> department = departmentService.updateDepartment(id, departmentDto);
        return department.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping({"/{id}"})
    public ResponseEntity<Void> deleteDepartment(@PathVariable Integer id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
}
