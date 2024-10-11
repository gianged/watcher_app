package com.watcher.repositories;

import com.watcher.models.Announce;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnounceRepository extends JpaRepository<Announce, Integer> {
    List<Announce> findByDepartment_Id(Integer departmentId);

    List<Announce> findByDepartment_IdOrDepartmentIsNullAndIsPublicTrue(Integer departmentId);
}
