package com.watcher.services;

import com.watcher.models.Ticket;
import com.watcher.dto.TicketDto;
import com.watcher.repositories.TicketRepository;
import com.watcher.mappers.TicketMapper;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<TicketDto> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(ticketMapper::toTIcketDto)
                .collect(Collectors.toList());
    }

    public Optional<TicketDto> getTicketById(Integer id) {
        return ticketRepository.findById(id)
                .map(ticketMapper::toTIcketDto);
    }

    public TicketDto createTicket(TicketDto ticketDto) {
        Ticket ticket = ticketMapper.toEntityFromTicketDto(ticketDto);
        Ticket savedTicket = ticketRepository.save(ticket);
        return ticketMapper.toTIcketDto(savedTicket);
    }

    public Optional<TicketDto> updateTicket(Integer id, TicketDto ticketDto) {
        return ticketRepository.findById(id)
                .map(existingTicket -> {
                    ticketMapper.partialUpdateTicketFromTicketDto(ticketDto, existingTicket);
                    Ticket updatedTicket = ticketRepository.save(existingTicket);
                    return ticketMapper.toTIcketDto(updatedTicket);
                });
    }

    public void deleteTicket(Integer id) {
        ticketRepository.deleteById(id);
    }

    public List<TicketDto> getTicketsByAppUserId(Integer appUserId) {
        return ticketRepository.findByAppUserId(appUserId).stream()
                .map(ticketMapper::toTIcketDto)
                .collect(Collectors.toList());
    }
}