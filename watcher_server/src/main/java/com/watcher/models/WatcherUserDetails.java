package com.watcher.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class WatcherUserDetails extends User {
    private final AppUser appUser;

    public WatcherUserDetails(AppUser appUser, Collection<? extends GrantedAuthority> authorities) {
        super(appUser.getUsername(), appUser.getPassword(), authorities);
        this.appUser = appUser;
    }

    public Integer getDepartmentId() {
        return appUser.getDepartment() != null ? appUser.getDepartment().getId() : null;
    }

    public AppUser getAppUser() {
        return appUser;
    }
}