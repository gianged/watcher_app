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
@Table(name = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE tickets SET deleted_at = CURRENT_TIMESTAMP WHERE ticket_id = ?")
@Where(clause = "deleted_at IS NULL")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "app_user_id")
    @ToString.Exclude
    private AppUser appUser;

    @Lob
    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "status")
    @Builder.Default
    private Integer status = 0; // 0: Open, 1: In Progress, 2: Resolved, 3: Closed

    @Column(name = "priority")
    @Builder.Default
    private Integer priority = 0; // 0: Low, 1: Medium, 2: High, 3: Critical

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

    public boolean isOpen() {
        return status != null && status == 0;
    }

    public boolean isClosed() {
        return status != null && (status == 2 || status == 3);
    }
}
