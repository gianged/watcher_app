package com.watcher.dto;

import java.io.Serializable;
import java.util.Base64;

/**
 * DTO for {@link com.watcher.models.AppUser}
 */
public class AuthenticateDto implements Serializable {
    private final Integer id;
    private final String username;
    private final String password;
    private final Integer departmentId;
    private final Integer roleLevel;
    private final Boolean isActive;
    private String token;
    private String profilePictureBase64;

    public AuthenticateDto(Integer id, byte[] profilePicture, String username, String password, Integer departmentId, Integer roleLevel, Boolean isActive, String token) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.departmentId = departmentId;
        this.roleLevel = roleLevel;
        this.isActive = isActive;
        this.token = token;
        this.profilePictureBase64 = convertBlobToBase64(profilePicture);
    }

    public String convertBlobToBase64(byte[] blob) {
        return blob != null ? Base64.getEncoder().encodeToString(blob) : null;
    }

    public byte[] convertBase64ToBlob(String base64) {
        return base64 != null ? Base64.getDecoder().decode(base64) : null;
    }

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public Integer getRoleLevel() {
        return roleLevel;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getProfilePictureBase64() {
        return profilePictureBase64;
    }

    public void setProfilePictureBase64(String profilePictureBase64) {
        this.profilePictureBase64 = profilePictureBase64;
    }
}