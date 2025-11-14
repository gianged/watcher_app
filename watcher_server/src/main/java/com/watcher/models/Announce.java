package com.watcher.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "announces")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE announces SET deleted_at = CURRENT_TIMESTAMP WHERE announce_id = ?")
@Where(clause = "deleted_at IS NULL")
public class Announce {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "announce_id", nullable = false)
    private Integer id;

    @Column(name = "title", length = 500)
    private String title;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "department_id")
    @ToString.Exclude
    private Department department;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = false;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @CreatedBy
    @Column(name = "created_by", updatable = false, length = 100)
    private String createdBy;

    @LastModifiedBy
    @Column(name = "updated_by", length = 100)
    private String updatedBy;

    @Column(name = "deleted_at")
    private Instant deletedAt;

    public void softDelete() {
        this.deletedAt = Instant.now();
        this.isActive = false;
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }

    public boolean isCurrentlyActive() {
        Instant now = Instant.now();
        boolean isInDateRange = (startDate == null || now.isAfter(startDate)) &&
                               (endDate == null || now.isBefore(endDate));
        return isActive && !isDeleted() && isInDateRange;
    }

    public boolean isExpired() {
        return endDate != null && Instant.now().isAfter(endDate);
    }

    public boolean isScheduled() {
        return startDate != null && Instant.now().isBefore(startDate);
    }
}
