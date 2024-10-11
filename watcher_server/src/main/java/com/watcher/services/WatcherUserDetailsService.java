package com.watcher.services;

import com.watcher.models.AppUser;
import com.watcher.models.RoleEnum;
import com.watcher.models.WatcherUserDetails;
import com.watcher.repositories.AuthenticateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;

@Service
public class WatcherUserDetailsService implements UserDetailsService {

    private final AuthenticateRepository authenticateRepository;

    @Autowired
    public WatcherUserDetailsService(AuthenticateRepository authenticateRepository) {
        this.authenticateRepository = authenticateRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = authenticateRepository.findByUsernameAndIsActiveTrueWithDepartment(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        RoleEnum roleEnum = Arrays.stream(RoleEnum.values())
                .filter(role -> role.getId() == user.getRoleLevel())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Role not found for level: " + user.getRoleLevel()));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleEnum.getRoleName());
        Collection<GrantedAuthority> authorities = Collections.singleton(authority);

        return new WatcherUserDetails(user, authorities);
    }
}
