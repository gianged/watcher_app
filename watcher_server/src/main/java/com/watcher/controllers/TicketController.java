package com.watcher.controllers;

import com.watcher.dto.TicketDto;
import com.watcher.models.RoleEnum;
import com.watcher.models.TicketStatusEnum;
import com.watcher.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/watcher/tickets")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping
    public ResponseEntity<List<TicketDto>> getAllTickets(@RequestParam(defaultValue = "status") String sortBy) {
        List<TicketDto> tickets = ticketService.getAllTickets(sortBy);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<TicketDto>> getPagedTickets(Pageable pageable, @RequestParam(defaultValue = "status") String sortBy) {
        Page<TicketDto> tickets = ticketService.getAllTickets(pageable, sortBy);
        return ResponseEntity.ok(tickets);
    }

    @GetMapping("/tickets-dashboard")
    public ResponseEntity<List<TicketDto>> getTicketsDashboard(@RequestParam Integer userRole, @RequestParam Integer userId) {
        List<TicketDto> tickets;

        if (userRole.equals(RoleEnum.SYSTEM_ADMIN.getId()) || userRole.equals(RoleEnum.DIRECTOR.getId())) {
            tickets = ticketService.getAllTickets("status");
        } else if (userRole.equals(RoleEnum.MANAGER.getId()) || userRole.equals(RoleEnum.USER.getId())) {
            tickets = ticketService.getTicketsByAppUserId(userId);
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<TicketDto> filteredTickets = tickets.stream()
                .filter(ticket -> !ticket.status().equals(TicketStatusEnum.CLOSED.getId()))
                .sorted((t1, t2) -> t1.status().compareTo(t2.status()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(filteredTickets);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Integer id) {
        Optional<TicketDto> ticket = ticketService.getTicketById(id);
        return ticket.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@RequestBody TicketDto ticketDto) {
        TicketDto createdTicket = ticketService.createTicket(ticketDto);
        return ResponseEntity.status(201).body(createdTicket);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Integer id, @RequestBody TicketDto ticketDto) {
        Optional<TicketDto> updatedTicket = ticketService.updateTicket(id, ticketDto);
        return updatedTicket.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Integer id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{appUserId}")
    public ResponseEntity<List<TicketDto>> getTicketsByAppUserId(@PathVariable Integer appUserId) {
        List<TicketDto> tickets = ticketService.getTicketsByAppUserId(appUserId);
        return ResponseEntity.ok(tickets);
    }
}