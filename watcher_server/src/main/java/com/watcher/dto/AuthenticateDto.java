package com.watcher.dto;

import java.io.Serializable;

/**
 * DTO for {@link com.watcher.models.AppUser}
 */
public record AuthenticateDto(Integer id,
                              String username,
                              String profilePictureBase64,
                              Integer departmentId,
                              Integer roleLevel,
                              Boolean isActive) implements Serializable {
}