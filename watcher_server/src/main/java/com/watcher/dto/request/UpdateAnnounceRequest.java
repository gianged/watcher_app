package com.watcher.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAnnounceRequest {

    @Size(min = 3, max = 500, message = "Title must be between 3 and 500 characters")
    private String title;

    @Size(min = 10, max = 10000, message = "Content must be between 10 and 10000 characters")
    private String content;

    private Instant startDate;

    private Instant endDate;

    private Integer departmentId;

    private Boolean isPublic;

    private Boolean isActive;
}
