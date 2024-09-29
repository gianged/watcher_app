package com.watcher.models;

public enum RoleEnum {
    SYSTEM_ADMIN(1, "SYSTEM_ADMIN"),
    DIRECTOR(2, "DIRECTOR"),
    MANAGER(3, "MANAGER"),
    USER(4, "USER");

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
