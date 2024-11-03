package com.watcher.services;

import com.watcher.models.Ticket;
import com.watcher.dto.TicketDto;
import com.watcher.repositories.TicketRepository;
import com.watcher.mappers.TicketMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    @Autowired
    public TicketService(TicketRepository ticketRepository, TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    public List<TicketDto> getAllTickets(String sortBy) {
        Sort sort = Sort.by(Sort.Direction.ASC, sortBy);
        return ticketRepository.findAll(sort).stream()
                .map(ticketMapper::toTicketDto)
                .collect(Collectors.toList());
    }

    public Page<TicketDto> getAllTickets(Pageable pageable, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.ASC, sortBy);
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
        Page<Ticket> tickets = ticketRepository.findAll(sortedPageable);
        return tickets.map(ticketMapper::toTicketDto);
    }

    public Optional<TicketDto> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(ticketMapper::toTicketDto);
    }

    public TicketDto createTicket(TicketDto ticketDto) {
        Ticket ticket = ticketMapper.toEntityFromTicketDto(ticketDto);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTicketDto(savedTicket);
    }

    public Optional<TicketDto> updateTicket(Integer id, TicketDto ticketDto) {
        return ticketRepository.findById(id)
                .map(existingTicket -> {
                    ticketMapper.partialUpdateTicketFromTicketDto(ticketDto, existingTicket);
                    Ticket updatedTicket = ticketRepository.save(existingTicket);
                    return ticketMapper.toTicketDto(updatedTicket);
                });
    }

    public void deleteTicket(Integer id) {
        ticketRepository.deleteById(id);
    }

    public List<TicketDto> getTicketsByAppUserId(Integer appUserId) {
        return ticketRepository.findByAppUserId(appUserId).stream()
                .map(ticketMapper::toTicketDto)
                .collect(Collectors.toList());
    }
}