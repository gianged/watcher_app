package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.Ticket}
 */
public record TicketDto(Integer id, Integer appUserId, String content, Integer status, Boolean isActive,
                        Instant createAt, Instant updateAt) implements Serializable {
}