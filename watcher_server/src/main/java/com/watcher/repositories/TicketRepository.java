package com.watcher.repositories;

import com.watcher.models.Ticket;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {
    List<Ticket> findAll(Sort sort);

    List<Ticket> findByAppUserId(Integer appUserId);
}
