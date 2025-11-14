package com.watcher.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Integer userId;
    private String username;
    private String token;
    private String refreshToken;
    private String tokenType;
    private Long expiresIn; // in seconds

    @Builder.Default
    private String type = "Bearer";

    private Integer roleLevel;
    private String departmentName;
    private Instant issuedAt;
}
