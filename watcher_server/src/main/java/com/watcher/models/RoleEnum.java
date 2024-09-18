package com.watcher.models;

public enum RoleEnum {
    SYSTEM_ADMIN(1, "System Admin"),
    DIRECTOR(2, "Director"),
    MANAGER(3, "Manager"),
    USER(4, "User");

    private final int id;
    private final String roleName;

    RoleEnum(int id, String roleName) {
        this.id = id;
        this.roleName = roleName;
    }

    public int getId() {
        return id;
    }

    public String getRoleName() {
        return roleName;
    }
}
