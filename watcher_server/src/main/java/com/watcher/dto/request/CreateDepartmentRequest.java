package com.watcher.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDepartmentRequest {

    @NotBlank(message = "Department name is required")
    @Size(min = 2, max = 200, message = "Department name must be between 2 and 200 characters")
    private String departmentName;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    @Builder.Default
    private Boolean isActive = true;
}
