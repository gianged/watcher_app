package com.watcher.models;

public enum TicketStatusEnum {
    OPEN(1, "Open"),
    IN_PROGRESS(2, "In Progress"),
    SOLVED(3, "Solved"),
    CLOSED(4, "Closed");

    private final int id;
    private final String statusName;

    TicketStatusEnum(int id, String statusName) {
        this.id = id;
        this.statusName = statusName;
    }

    public int getId() {
        return id;
    }

    public String getStatusName() {
        return statusName;
    }
}

