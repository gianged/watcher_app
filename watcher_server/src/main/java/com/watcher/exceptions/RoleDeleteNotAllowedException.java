package com.watcher.exceptions;

public class RoleDeleteNotAllowedException extends RuntimeException {
    public RoleDeleteNotAllowedException(String message) {
        super(message);
    }
}
