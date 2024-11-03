package com.watcher.repositories;

import com.watcher.models.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByUsername(String username);

    List<AppUser> findAllByUsernameContainingIgnoreCase(String username, Sort sort);

    Page<AppUser> findAllByUsernameContainingIgnoreCase(String username, Pageable pageable);

    List<AppUser> findByDepartment_Id(Integer departmentId);
}
