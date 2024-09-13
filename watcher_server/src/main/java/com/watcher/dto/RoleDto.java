package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.Role}
 */
public record RoleDto(Integer id, String roleName, Instant createAt, Instant updateAt) implements Serializable {
}