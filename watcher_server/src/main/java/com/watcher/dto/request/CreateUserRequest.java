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
public class CreateUserRequest {

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_.-]+$", message = "Username can only contain letters, numbers, dots, hyphens, and underscores")
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
    private String password;

    private Integer departmentId;

    @Min(value = 0, message = "Role level must be 0 (User), 1 (Admin), or 2 (Manager)")
    @Max(value = 2, message = "Role level must be 0 (User), 1 (Admin), or 2 (Manager)")
    @Builder.Default
    private Integer roleLevel = 0;

    @Builder.Default
    private Boolean isActive = true;

    private byte[] profilePicture;
}
