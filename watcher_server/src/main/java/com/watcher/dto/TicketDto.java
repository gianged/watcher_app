package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.Ticket}
 */
public record TicketDto(Integer id,
                        Integer userId,
                        String content,
                        Boolean isSolved,
                        Boolean isActive,
                        Instant createAt,
                        Instant updateAt) implements Serializable {
}