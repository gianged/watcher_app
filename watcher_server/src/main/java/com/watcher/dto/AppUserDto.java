package com.watcher.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.watcher.models.AppUser}
 */
public class AppUserDto implements Serializable {
    private Integer id;
    private String username;
    private String password;
    private Integer departmentId;
    private Integer roleLevel;
    private Boolean isActive;
    private Instant createAt;
    private Instant updateAt;

    // Default constructor
    public AppUserDto() {
    }

    // Parameterized constructor
    public AppUserDto(Integer id, String username, String password, Integer departmentId, Integer roleLevel, Boolean isActive, Instant createAt, Instant updateAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.departmentId = departmentId;
        this.roleLevel = roleLevel;
        this.isActive = isActive;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public Integer getRoleLevel() {
        return roleLevel;
    }

    public void setRoleLevel(Integer roleLevel) {
        this.roleLevel = roleLevel;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Instant getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Instant createAt) {
        this.createAt = createAt;
    }

    public Instant getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(Instant updateAt) {
        this.updateAt = updateAt;
    }
}