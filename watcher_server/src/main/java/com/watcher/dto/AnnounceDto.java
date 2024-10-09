package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.Announce}
 */
public record AnnounceDto(Integer id, String content, Instant startDate, Instant endDate, Integer departmentId,
                          Instant createAt, Instant updateAt, Boolean isPublic,
                          Boolean isActive) implements Serializable {
}