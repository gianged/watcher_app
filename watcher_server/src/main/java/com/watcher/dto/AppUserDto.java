package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.AppUser}
 */
public record AppUserDto(Integer id, String username, Integer departmentId, Integer roleLevel, Boolean isActive,
                         Instant createAt, Instant updateAt) implements Serializable {
}