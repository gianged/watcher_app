package com.watcher.repositories;

import com.watcher.models.Announce;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnounceRepository extends JpaRepository<Announce, Integer> {
    List<Announce> findAll(Sort sort);

    @Query("SELECT a FROM Announce a WHERE LOWER(CAST(a.content AS string)) LIKE LOWER(CONCAT('%', :content, '%'))")
    Page<Announce> findAllByContentContainingIgnoreCase(@Param("content") String content, Pageable pageable);

    @Query("SELECT a FROM Announce a WHERE LOWER(CAST(a.content AS string)) LIKE LOWER(CONCAT('%', :content, '%'))")
    List<Announce> findAllByContentContainingIgnoreCase(@Param("content") String content, Sort sort);

    List<Announce> findByDepartment_Id(Integer departmentId);

    List<Announce> findByDepartment_IdOrDepartmentIsNullAndIsPublicTrue(Integer departmentId);
}
