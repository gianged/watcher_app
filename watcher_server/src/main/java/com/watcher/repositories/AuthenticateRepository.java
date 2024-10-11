package com.watcher.repositories;

import com.watcher.models.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthenticateRepository extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByUsernameAndIsActiveTrue(String username);

    @Query("SELECT u FROM AppUser u LEFT JOIN FETCH u.department WHERE u.username = :username")
    Optional<AppUser> findByUsernameAndIsActiveTrueWithDepartment(@Param("username") String username);
}
