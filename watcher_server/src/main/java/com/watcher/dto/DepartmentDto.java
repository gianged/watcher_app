package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.Department}
 */
public record DepartmentDto(
        Integer id,
        String departmentName,
        Instant createAt,
        Instant updateAt) implements Serializable {
}