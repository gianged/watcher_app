package com.watcher.models;

public enum RoleEnum {
    MEMBER(1, "user"),
    MANAGER(2, "Manager"),
    DIRECTOR(3, "Director"),
    SYSTEM_ADMIN(4, "System Admin");

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
