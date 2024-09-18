package com.watcher.dto;

import java.io.Serializable;

/**
 * DTO for {@link com.watcher.models.User}
 */
public record AuthenticateDto(Integer id,
                              String username,
                              String password,
                              Integer departmentId,
                              Integer roleLevel,
                              Boolean isActive) implements Serializable {
}