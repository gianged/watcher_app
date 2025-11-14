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
public class UserResponse {

    private Integer id;
    private String username;
    private Integer departmentId;
    private String departmentName;
    private Integer roleLevel;
    private String roleName;
    private Boolean isActive;
    private byte[] profilePicture;
    private Instant createdAt;
    private Instant updatedAt;
    private String createdBy;
    private String updatedBy;
    private Integer ticketCount;

    public String getRoleName() {
        if (roleName != null) return roleName;
        return switch (roleLevel != null ? roleLevel : 0) {
            case 1 -> "Admin";
            case 2 -> "Manager";
            default -> "User";
        };
    }
}
