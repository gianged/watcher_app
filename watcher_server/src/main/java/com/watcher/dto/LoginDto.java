package com.watcher.dto;

import com.watcher.models.Role;

import java.io.Serializable;

/**
 * DTO for {@link com.watcher.models.User}
 */
public class LoginDto implements Serializable {
    private Integer id;
    private String username;
    private String password;
    private Role role;
    private Boolean isActive;

    public LoginDto() {
    }

    public LoginDto(Integer id, String username, String password, Role role, Boolean isActive) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
