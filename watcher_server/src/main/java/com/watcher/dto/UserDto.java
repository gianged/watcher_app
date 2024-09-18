package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.User}
 */
public record UserDto(Integer id,
                      String username,
                      Integer roleLevel,
                      Integer departmentId,
                      Boolean isActive,
                      Instant createAt,
                      Instant updateAt) implements Serializable {
}