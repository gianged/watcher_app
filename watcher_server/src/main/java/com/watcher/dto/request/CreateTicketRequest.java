package com.watcher.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {

    @NotBlank(message = "Content is required")
    @Size(min = 10, max = 5000, message = "Content must be between 10 and 5000 characters")
    private String content;

    @Min(value = 0, message = "Status must be 0 (Open), 1 (In Progress), 2 (Resolved), or 3 (Closed)")
    @Max(value = 3, message = "Status must be 0 (Open), 1 (In Progress), 2 (Resolved), or 3 (Closed)")
    @Builder.Default
    private Integer status = 0; // 0: Open, 1: In Progress, 2: Resolved, 3: Closed

    @Min(value = 0, message = "Priority must be 0 (Low), 1 (Medium), 2 (High), or 3 (Critical)")
    @Max(value = 3, message = "Priority must be 0 (Low), 1 (Medium), 2 (High), or 3 (Critical)")
    @Builder.Default
    private Integer priority = 0; // 0: Low, 1: Medium, 2: High, 3: Critical

    private Integer userId; // Optional - if not provided, uses authenticated user

    @Builder.Default
    private Boolean isActive = true;
}
