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
public class AnnounceResponse {

    private Integer id;
    private String title;
    private String content;
    private Instant startDate;
    private Instant endDate;
    private Integer departmentId;
    private String departmentName;
    private Boolean isPublic;
    private Boolean isActive;
    private Boolean isCurrentlyActive;
    private Boolean isExpired;
    private Boolean isScheduled;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
}
