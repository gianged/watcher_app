package com.watcher.mappers;

import com.watcher.dto.TicketDto;
import com.watcher.models.Ticket;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface TicketMapper {
    @Mapping(source = "appUserId", target = "appUser.id")
    Ticket toEntityFromTicketDto(TicketDto ticketDto);

    @Mapping(source = "appUser.id", target = "appUserId")
    TicketDto toTicketDto(Ticket ticket);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(source = "appUserId", target = "appUser.id", ignore = true)
    Ticket partialUpdateTicketFromTicketDto(TicketDto ticketDto, @MappingTarget Ticket ticket);
}