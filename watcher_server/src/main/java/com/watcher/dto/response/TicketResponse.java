package com.watcher.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TicketResponse {

    private Integer id;
    private String content;
    private Integer status;
    private String statusName;
    private Integer priority;
    private String priorityName;
    private Integer userId;
    private String username;
    private Boolean isActive;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;

    public String getStatusName() {
        if (statusName != null) return statusName;
        return switch (status != null ? status : 0) {
            case 1 -> "In Progress";
            case 2 -> "Resolved";
            case 3 -> "Closed";
            default -> "Open";
        };
    }

    public String getPriorityName() {
        if (priorityName != null) return priorityName;
        return switch (priority != null ? priority : 0) {
            case 1 -> "Medium";
            case 2 -> "High";
            case 3 -> "Critical";
            default -> "Low";
        };
    }
}
