package com.watcher.services;

import com.watcher.models.AppUser;
import com.watcher.models.RoleEnum;
import com.watcher.repositories.AuthenticateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

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
        AppUser user = authenticateRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + RoleEnum.values()[user.getRoleLevel()].getRoleName());
        return new User(user.getUsername(), user.getPassword(), Collections.singleton(authority));
    }
}
